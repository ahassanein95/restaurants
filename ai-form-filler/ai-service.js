// AI Service for intelligent form field recognition
class AIService {
  constructor() {
    // Centralized API key from config
    this.apiKey = CONFIG.OPENAI_API_KEY;
    
    console.log('🤖 AI Service: Initializing...');
    console.log(`🔑 Raw API Key: "${this.apiKey}"`);
    console.log(`🔑 API Key length: ${this.apiKey ? this.apiKey.length : 0}`);
    console.log(`🔑 API Key starts with 'sk-': ${this.apiKey ? this.apiKey.startsWith('sk-') : false}`);
    console.log(`🔑 API Key is not placeholder: ${this.apiKey !== 'YOUR_OPENAI_API_KEY_HERE'}`);
    
    this.isConfigured = !!this.apiKey && this.apiKey !== 'YOUR_OPENAI_API_KEY_HERE';
    
    console.log(`🔑 API Key configured: ${this.isConfigured ? 'Yes' : 'No'}`);
    if (this.isConfigured) {
      console.log(`🔑 API Key: ${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length - 4)}`);
    }
    
    // Usage tracking and rate limiting
    this.usageStats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      lastCallTime: 0,
      dailyCalls: 0,
      lastResetDate: new Date().toDateString()
    };
    
    // Rate limiting settings from config
    this.rateLimit = {
      maxCallsPerMinute: CONFIG.RATE_LIMITS.maxCallsPerMinute,
      maxCallsPerDay: CONFIG.RATE_LIMITS.maxCallsPerDay,
      callsThisMinute: 0,
      lastMinuteReset: Date.now()
    };
    
    console.log(`⚡ Rate limits: ${this.rateLimit.maxCallsPerMinute}/min, ${this.rateLimit.maxCallsPerDay}/day`);
    
    this.loadUsageStats();
  }

  async loadUsageStats() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['aiUsageStats', 'aiRateLimit'], (result) => {
        if (result.aiUsageStats) {
          this.usageStats = { ...this.usageStats, ...result.aiUsageStats };
        }
        if (result.aiRateLimit) {
          this.rateLimit = { ...this.rateLimit, ...result.aiRateLimit };
        }
        this.checkDailyReset();
        resolve();
      });
    });
  }

  async saveUsageStats() {
    return new Promise((resolve) => {
      chrome.storage.local.set({
        aiUsageStats: this.usageStats,
        aiRateLimit: this.rateLimit
      }, resolve);
    });
  }

  checkDailyReset() {
    const today = new Date().toDateString();
    if (this.usageStats.lastResetDate !== today) {
      this.usageStats.dailyCalls = 0;
      this.usageStats.lastResetDate = today;
      this.saveUsageStats();
    }
  }

  checkRateLimit() {
    const now = Date.now();
    
    // Reset minute counter if needed
    if (now - this.rateLimit.lastMinuteReset > 60000) {
      this.rateLimit.callsThisMinute = 0;
      this.rateLimit.lastMinuteReset = now;
    }
    
    // Check daily limit
    if (this.usageStats.dailyCalls >= this.rateLimit.maxCallsPerDay) {
      return { allowed: false, reason: 'Daily limit exceeded', resetTime: 'tomorrow' };
    }
    
    // Check minute limit
    if (this.rateLimit.callsThisMinute >= this.rateLimit.maxCallsPerMinute) {
      const waitTime = Math.ceil((60000 - (now - this.rateLimit.lastMinuteReset)) / 1000);
      return { allowed: false, reason: 'Rate limit exceeded', resetTime: `${waitTime} seconds` };
    }
    
    return { allowed: true };
  }

  updateUsageStats(success = true) {
    this.usageStats.totalCalls++;
    this.usageStats.dailyCalls++;
    this.usageStats.lastCallTime = Date.now();
    
    if (success) {
      this.usageStats.successfulCalls++;
    } else {
      this.usageStats.failedCalls++;
    }
    
    this.rateLimit.callsThisMinute++;
    this.saveUsageStats();
  }

  async analyzeField(fieldInfo, userProfile, pageContext = {}) {
    if (!this.isConfigured) {
      console.log('🤖 AI Service: Not configured, falling back to rule-based logic');
      return null;
    }

    // Check rate limits
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      console.log(`🚫 AI rate limited: ${rateLimitCheck.reason}. Reset in: ${rateLimitCheck.resetTime}`);
      return null;
    }

    console.log(`🚀 Making OpenAI API call for field: ${fieldInfo.name}`);

    try {
      const prompt = this.buildFieldAnalysisPrompt(fieldInfo, userProfile, pageContext);
      const response = await this.callOpenAI(prompt);
      this.updateUsageStats(true);
      console.log(`✅ OpenAI API call successful for field: ${fieldInfo.name}`);
      return this.parseAIResponse(response);
    } catch (error) {
      this.updateUsageStats(false);
      console.error('❌ AI analysis failed:', error);
      
      // Handle specific API errors
      if (error.message.includes('429')) {
        console.log('🚫 OpenAI rate limit hit, falling back to rule-based logic');
      } else if (error.message.includes('401')) {
        console.log('🔑 OpenAI API key invalid, falling back to rule-based logic');
      } else if (error.message.includes('402')) {
        console.log('💰 OpenAI quota exceeded, falling back to rule-based logic');
      }
      
      return null;
    }
  }

  buildFieldAnalysisPrompt(fieldInfo, userProfile, pageContext) {
    return `You are an AI assistant that helps fill web forms intelligently. Analyze the following form field and provide the most appropriate value.

FIELD INFORMATION:
- Type: ${fieldInfo.type}
- Name: ${fieldInfo.name}
- Placeholder: "${fieldInfo.placeholder}"
- Label: "${fieldInfo.label}"
- Required: ${fieldInfo.required || false}

USER PROFILE:
- First Name: ${userProfile.firstName}
- Last Name: ${userProfile.lastName}
- Email: ${userProfile.email}
- Phone: ${userProfile.phone}
- Address: ${userProfile.address}
- City: ${userProfile.city}
- State: ${userProfile.state}
- Zip Code: ${userProfile.zipCode}
- Country: ${userProfile.country}
- Company: ${userProfile.company}
- Job Title: ${userProfile.jobTitle}
- Website: ${userProfile.website}

PAGE CONTEXT:
- URL: ${pageContext.url || 'Unknown'}
- Page Title: ${pageContext.title || 'Unknown'}
- Form Purpose: ${pageContext.formPurpose || 'Unknown'}

INSTRUCTIONS:
1. Analyze the field context and determine what information is being requested
2. Choose the most appropriate value from the user profile
3. If no profile value matches, suggest a reasonable default
4. For select dropdowns, suggest the best option
5. For text areas, provide contextually appropriate content
6. Return only the value, no explanations

RESPONSE FORMAT:
{
  "value": "the actual value to fill",
  "confidence": 0.95,
  "reasoning": "brief explanation of why this value was chosen"
}

Example responses:
- For email field: {"value": "john.doe@example.com", "confidence": 0.99, "reasoning": "Direct email field match"}
- For name field: {"value": "John Doe", "confidence": 0.95, "reasoning": "Full name requested"}
- For comment field: {"value": "Thank you for your service. I'm interested in learning more about your offerings.", "confidence": 0.8, "reasoning": "Professional comment appropriate for contact form"}`;
  }

  async callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: CONFIG.AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing web forms and providing appropriate values. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: CONFIG.MAX_TOKENS,
        temperature: CONFIG.TEMPERATURE,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  parseAIResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        value: parsed.value,
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning || 'AI analysis'
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return null;
    }
  }

  async analyzeFormContext(formFields, userProfile, pageContext) {
    if (!this.isConfigured) return null;

    // Check rate limits
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      return null;
    }

    try {
      const prompt = this.buildFormContextPrompt(formFields, userProfile, pageContext);
      const response = await this.callOpenAI(prompt);
      this.updateUsageStats(true);
      return this.parseAIResponse(response);
    } catch (error) {
      this.updateUsageStats(false);
      console.error('Form context analysis failed:', error);
      return null;
    }
  }

  buildFormContextPrompt(formFields, userProfile, pageContext) {
    const fieldsSummary = formFields.map(f => 
      `- ${f.type}: "${f.name}" (${f.placeholder})`
    ).join('\n');

    return `Analyze this form and provide context for better field filling:

FORM FIELDS:
${fieldsSummary}

USER PROFILE: Available
PAGE CONTEXT: ${pageContext.url || 'Unknown'}

What type of form is this? What is its purpose? Provide context to help fill fields more intelligently.

Response format:
{
  "formType": "contact|registration|payment|survey|other",
  "purpose": "brief description of form purpose",
  "suggestions": ["field-specific suggestions"]
}`;
  }

  // Get usage statistics for monitoring
  getUsageStats() {
    return {
      ...this.usageStats,
      rateLimit: this.rateLimit,
      isConfigured: this.isConfigured
    };
  }

  // Fallback method for when AI is not available
  getFallbackValue(fieldInfo, userProfile) {
    const { type, name, placeholder, label } = fieldInfo;
    
    // Email fields
    if (type === 'email' || name.includes('email') || placeholder.includes('email') || label.includes('email')) {
      return userProfile.email;
    }

    // Name fields
    if (name.includes('first') || name.includes('fname') || 
        placeholder.includes('first name') || placeholder.includes('first') ||
        label.includes('first name') || label.includes('first')) {
      return userProfile.firstName;
    }
    if (name.includes('last') || name.includes('lname') || 
        placeholder.includes('last name') || placeholder.includes('last') ||
        label.includes('last name') || label.includes('last')) {
      return userProfile.lastName;
    }
    if (name.includes('name') && !name.includes('first') && !name.includes('last') && 
        !placeholder.includes('first') && !placeholder.includes('last')) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }

    // Phone fields
    if (type === 'tel' || name.includes('phone') || name.includes('mobile') || 
        placeholder.includes('phone') || label.includes('phone')) {
      return userProfile.phone;
    }

    // Address fields
    if (name.includes('address') || name.includes('street') || 
        placeholder.includes('address') || label.includes('address')) {
      return userProfile.address;
    }
    if (name.includes('city') || placeholder.includes('city') || label.includes('city')) {
      return userProfile.city;
    }
    if (name.includes('state') || name.includes('province') || 
        placeholder.includes('state') || label.includes('state')) {
      return userProfile.state;
    }
    if (name.includes('zip') || name.includes('postal') || 
        placeholder.includes('zip') || label.includes('zip')) {
      return userProfile.zipCode;
    }
    if (name.includes('country') || placeholder.includes('country') || label.includes('country')) {
      return userProfile.country;
    }

    // Company fields
    if (name.includes('company') || name.includes('organization') || 
        placeholder.includes('company') || label.includes('company')) {
      return userProfile.company;
    }
    if (name.includes('job') || name.includes('title') || name.includes('position') || 
        placeholder.includes('job') || placeholder.includes('title') || label.includes('job')) {
      return userProfile.jobTitle;
    }

    // Website fields
    if (type === 'url' || name.includes('website') || name.includes('url') || 
        placeholder.includes('website') || placeholder.includes('url')) {
      return userProfile.website;
    }

    // Comment/Message fields
    if (name.includes('comment') || name.includes('message') || name.includes('note') || 
        placeholder.includes('comment') || placeholder.includes('message') || 
        label.includes('comment') || label.includes('message')) {
      return 'Thank you for your service. This is a test comment generated by AI Form Filler.';
    }

    // Search fields - leave empty
    if (type === 'search') {
      return '';
    }

    // Generic fallbacks
    switch (type) {
      case 'text':
        if (name.includes('name') || name.includes('fname') || name.includes('lname')) {
          return 'John Doe';
        }
        return 'Sample text';
      case 'number':
        return '123';
      case 'url':
        return 'https://example.com';
      case 'textarea':
        return 'This is a sample comment or message generated by AI Form Filler.';
      default:
        return 'Sample value';
    }
  }

  async analyzeSelectOption(fieldInfo, options, userProfile, pageContext = {}) {
    if (!this.isConfigured) {
      return null;
    }

    // Check rate limits
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      console.log(`🚫 AI rate limited for select analysis: ${rateLimitCheck.reason}`);
      return null;
    }

    try {
      const prompt = this.buildSelectAnalysisPrompt(fieldInfo, options, userProfile, pageContext);
      const response = await this.callOpenAI(prompt);
      this.updateUsageStats(true);
      return this.parseSelectResponse(response, options);
    } catch (error) {
      this.updateUsageStats(false);
      console.error('❌ Select analysis failed:', error);
      return null;
    }
  }

  buildSelectAnalysisPrompt(fieldInfo, options, userProfile, pageContext) {
    const optionList = options.map(opt => `- "${opt.value}"`).join('\n');
    
    return `You are an AI assistant that helps select the most appropriate option from dropdown menus. Analyze the field and available options to choose the best match.

FIELD INFORMATION:
- Type: ${fieldInfo.type}
- Name: "${fieldInfo.name}"
- Placeholder: "${fieldInfo.placeholder}"
- Label: "${fieldInfo.label}"

AVAILABLE OPTIONS:
${optionList}

USER PROFILE:
- First Name: ${userProfile.firstName}
- Last Name: ${userProfile.lastName}
- Email: ${userProfile.email}
- Phone: ${userProfile.phone}
- Address: ${userProfile.address}
- City: ${userProfile.city}
- State: ${userProfile.state}
- Zip Code: ${userProfile.zipCode}
- Country: ${userProfile.country}
- Company: ${userProfile.company}
- Job Title: ${userProfile.jobTitle}
- Website: ${userProfile.website}

PAGE CONTEXT:
- URL: ${pageContext.url || 'Unknown'}
- Page Title: ${pageContext.title || 'Unknown'}
- Form Purpose: ${pageContext.formPurpose || 'Unknown'}

INSTRUCTIONS:
1. Analyze what type of information this dropdown is requesting
2. Choose the most appropriate option from the available choices
3. Consider the user's profile and form context
4. Return only the exact option value, no explanations

RESPONSE FORMAT:
{
  "selectedOption": "the exact option value to select",
  "confidence": 0.95,
  "reasoning": "brief explanation of why this option was chosen"
}

Example responses:
- For country field: {"selectedOption": "United States", "confidence": 0.99, "reasoning": "User profile shows US address"}
- For experience level: {"selectedOption": "3-5 years", "confidence": 0.8, "reasoning": "Reasonable experience level for software engineer"}`;
  }

  parseSelectResponse(response, options) {
    try {
      const parsed = JSON.parse(response);
      const selectedOption = parsed.selectedOption;
      
      // Verify the selected option exists in the available options
      const validOption = options.find(opt => opt.value === selectedOption);
      if (!validOption) {
        console.log(`⚠️ AI suggested "${selectedOption}" but it's not in available options`);
        return null;
      }
      
      return {
        selectedOption: selectedOption,
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning || 'AI analysis'
      };
    } catch (error) {
      console.error('Failed to parse select response:', error);
      return null;
    }
  }
}

// Export for use in other files
window.AIService = AIService; 