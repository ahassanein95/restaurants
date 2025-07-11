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

    // Debug: Log the profile data being sent to AI
    console.log('🧠 AI Service: Profile data being sent to AI:', userProfile);
    console.log('🧠 AI Service: Field being analyzed:', fieldInfo);

    // Check rate limits
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      console.log(`🚫 AI rate limited: ${rateLimitCheck.reason}. Reset in: ${rateLimitCheck.resetTime}`);
      return null;
    }

    // Generate unique request ID to prevent caching
    const requestId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🚀 Making OpenAI API call for field: ${fieldInfo.name} (Request ID: ${requestId})`);

    try {
      const prompt = this.buildFieldAnalysisPrompt(fieldInfo, userProfile, pageContext, requestId);
      const response = await this.callOpenAI(prompt);
      this.updateUsageStats(true);
      console.log(`✅ OpenAI API call successful for field: ${fieldInfo.name} (Request ID: ${requestId})`);
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

  buildFieldAnalysisPrompt(fieldInfo, userProfile, pageContext, requestId) {
    // Build comprehensive profile information including skills and experience
    const profileInfo = this.buildComprehensiveProfileInfo(userProfile);
    
    return `You are an AI assistant that helps fill web forms intelligently. Analyze the following form field and provide the most appropriate value.

REQUEST ID: ${requestId}
IMPORTANT: Each field is unique and should be analyzed independently, even if field names or labels seem similar.

FIELD INFORMATION:
- Type: ${fieldInfo.type}
- Name: ${fieldInfo.name}
- Placeholder: "${fieldInfo.placeholder}"
- Label: "${fieldInfo.label}"
- Required: ${fieldInfo.required || false}

USER PROFILE:
${profileInfo}

PAGE CONTEXT:
- URL: ${pageContext.url || 'Unknown'}
- Page Title: ${pageContext.title || 'Unknown'}
- Form Purpose: ${pageContext.formPurpose || 'Unknown'}

INSTRUCTIONS:
1. Analyze the field context and determine what information is being requested
2. PRIORITIZE using the user's actual profile data over generic defaults
3. For skill-related questions, use the user's specific skills and years of experience
4. For experience questions, use the user's actual work history
5. For education questions, use the user's actual education background
6. If the field asks for years of experience with a specific technology, use the user's skill data
7. If no profile value matches, suggest a reasonable default
8. For select dropdowns, suggest the best option based on user's profile
9. For text areas, provide contextually appropriate content based on user's background
10. Return only the value, no explanations
11. CRITICAL: Each field is unique - do not reuse values from previous fields

RESPONSE FORMAT:
{
  "value": "the actual value to fill",
  "confidence": 0.95,
  "reasoning": "brief explanation of why this value was chosen"
}

Example responses:
- For email field: {"value": "john.doe@example.com", "confidence": 0.99, "reasoning": "Direct email field match"}
- For name field: {"value": "John Doe", "confidence": 0.95, "reasoning": "Full name requested"}
- For Node.js experience: {"value": "3", "confidence": 0.95, "reasoning": "User has 3 years Node.js experience in profile"}
- For comment field: {"value": "Thank you for your service. I'm interested in learning more about your offerings.", "confidence": 0.8, "reasoning": "Professional comment appropriate for contact form"}`;
  }

  buildComprehensiveProfileInfo(userProfile) {
    let profileInfo = `- First Name: ${userProfile.firstName || 'Not provided'}
- Last Name: ${userProfile.lastName || 'Not provided'}
- Email: ${userProfile.email || 'Not provided'}
- Phone: ${userProfile.phone || 'Not provided'}
- Address: ${userProfile.address || 'Not provided'}
- City: ${userProfile.city || 'Not provided'}
- State: ${userProfile.state || 'Not provided'}
- Zip Code: ${userProfile.zipCode || 'Not provided'}
- Country: ${userProfile.country || 'Not provided'}
- Company: ${userProfile.company || 'Not provided'}
- Job Title: ${userProfile.jobTitle || 'Not provided'}
- Industry: ${userProfile.industry || 'Not provided'}
- Years of Experience: ${userProfile.yearsOfExperience || 'Not provided'}
- Website: ${userProfile.website || 'Not provided'}
- LinkedIn: ${userProfile.linkedin || 'Not provided'}
- GitHub: ${userProfile.github || 'Not provided'}
- Professional Summary: ${userProfile.summary || 'Not provided'}
- Bio: ${userProfile.bio || 'Not provided'}`;

    // Extract skills from experience descriptions
    const extractedSkills = new Set();
    if (userProfile.experience && userProfile.experience.length > 0) {
      profileInfo += `\n\nWORK EXPERIENCE:`;
      userProfile.experience.forEach((exp, index) => {
        profileInfo += `\n- ${index + 1}. ${exp.jobTitle || 'Position'} at ${exp.company || 'Company'} (${exp.startDate || 'Start'} - ${exp.endDate || 'Present'})`;
        if (exp.description) {
          profileInfo += `\n  Description: ${exp.description}`;
          
          // Extract potential skills from job descriptions
          const description = exp.description.toLowerCase();
          const skillKeywords = [
            'javascript', 'js', 'node', 'node.js', 'react', 'angular', 'vue', 'python', 'java', 'c++', 'c#', 
            'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'html', 'css', 'sql', 'mongodb',
            'mysql', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'linux', 'windows',
            'mac', 'android', 'ios', 'wordpress', 'drupal', 'shopify', 'salesforce', 'tableau', 'powerbi',
            'rest api', 'api', 'microservices', 'agile', 'scrum', 'devops', 'ci/cd', 'jenkins', 'jira',
            'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'excel', 'powerpoint', 'word'
          ];
          
          skillKeywords.forEach(skill => {
            if (description.includes(skill)) {
              extractedSkills.add(skill);
            }
          });
        }
      });
      
      // Add extracted skills to the profile info
      if (extractedSkills.size > 0) {
        profileInfo += `\n\nEXTRACTED SKILLS FROM EXPERIENCE: ${Array.from(extractedSkills).join(', ')}`;
      }
    }

    // Add skills information if available
    if (userProfile.skills) {
      profileInfo += `\n\nSKILLS & EXPERTISE:`;
      
      if (userProfile.skills.technical && userProfile.skills.technical.length > 0) {
        profileInfo += `\n- Technical Skills: ${userProfile.skills.technical.join(', ')}`;
      }
      
      if (userProfile.skills.languages && userProfile.skills.languages.length > 0) {
        profileInfo += `\n- Languages: ${userProfile.skills.languages.join(', ')}`;
      }
      
      if (userProfile.skills.tools && userProfile.skills.tools.length > 0) {
        profileInfo += `\n- Tools & Technologies: ${userProfile.skills.tools.join(', ')}`;
      }
    }

    // Add education information if available
    if (userProfile.education && userProfile.education.length > 0) {
      profileInfo += `\n\nEDUCATION:`;
      userProfile.education.forEach((edu, index) => {
        profileInfo += `\n- ${index + 1}. ${edu.degree || 'Degree'} in ${edu.fieldOfStudy || 'Field'} from ${edu.institution || 'Institution'} (${edu.graduationYear || 'Year'})`;
        if (edu.description) {
          profileInfo += `\n  Description: ${edu.description}`;
        }
      });
    }

    // Add resume text if available
    if (userProfile.resumeText) {
      profileInfo += `\n\nRESUME CONTENT: ${userProfile.resumeText.substring(0, 500)}${userProfile.resumeText.length > 500 ? '...' : ''}`;
    }

    return profileInfo;
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
    
    // Debug: Log the profile data being used in fallback
    console.log('📝 Fallback: Using profile data:', userProfile);
    console.log('📝 Fallback: Analyzing field:', fieldInfo);
    
    // Check for skill/technology experience questions
    const skillMatch = this.matchSkillExperience(fieldInfo, userProfile);
    if (skillMatch) {
      console.log(`📝 Fallback: Found skill match: "${skillMatch}"`);
      return skillMatch;
    }
    
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

  // Helper method to match skill experience questions
  matchSkillExperience(fieldInfo, userProfile) {
    const { name, placeholder, label } = fieldInfo;
    const fieldText = `${name} ${placeholder} ${label}`.toLowerCase();
    
    // Check if this is asking about years of experience with a technology
    if (fieldText.includes('year') && (fieldText.includes('experience') || fieldText.includes('work'))) {
      // Common technology keywords
      const techKeywords = [
        'javascript', 'js', 'node', 'node.js', 'react', 'angular', 'vue', 'python', 'java', 'c++', 'c#', 
        'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'html', 'css', 'sql', 'mongodb',
        'mysql', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'linux', 'windows',
        'mac', 'android', 'ios', 'wordpress', 'drupal', 'shopify', 'salesforce', 'tableau', 'powerbi',
        'rest api', 'api', 'microservices', 'agile', 'scrum', 'devops', 'ci/cd', 'jenkins', 'jira'
      ];
      
      for (const tech of techKeywords) {
        if (fieldText.includes(tech)) {
          // Check if user has this skill in their profile
          let hasSkill = false;
          
          // Check skills arrays first
          if (userProfile.skills) {
            const allSkills = [
              ...(userProfile.skills.technical || []),
              ...(userProfile.skills.tools || []),
              ...(userProfile.skills.languages || [])
            ];
            
            hasSkill = allSkills.some(skill => 
              skill.toLowerCase().includes(tech) || tech.includes(skill.toLowerCase())
            );
          }
          
          // If not found in skills, check experience descriptions
          if (!hasSkill && userProfile.experience) {
            hasSkill = userProfile.experience.some(exp => {
              if (exp.description) {
                return exp.description.toLowerCase().includes(tech);
              }
              return false;
            });
          }
          
          if (hasSkill) {
            // Return a reasonable experience value based on user's overall experience
            const baseExperience = parseInt(userProfile.yearsOfExperience) || 3;
            const skillExperience = Math.max(1, Math.floor(baseExperience * 0.7));
            console.log(`📝 Fallback: Found skill "${tech}" in experience, returning ${skillExperience} years`);
            return skillExperience.toString();
          }
        }
      }
    }
    
    // Check for general experience questions
    if (fieldText.includes('experience') && fieldText.includes('year')) {
      return userProfile.yearsOfExperience || '3';
    }
    
    return null;
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