// Content script for AI Form Filler
class AIFormFiller {
  constructor() {
    this.formFields = [];
    this.userProfile = {};
    this.aiService = new AIService();
    this.pageContext = {};
    this.isReady = false;
    this.init();
  }

  init() {
    // Get page context
    this.pageContext = {
      url: window.location.href,
      title: document.title,
      formPurpose: this.detectFormPurpose()
    };

    // Mark as ready after initialization
    this.isReady = true;
    console.log('🤖 AI Form Filler: Content script initialized and ready');

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (!this.isReady) {
        console.log('⚠️ Content script not ready yet');
        sendResponse({ error: 'Content script not ready' });
        return;
      }

      if (request.action === 'fillForm') {
        this.fillFormWithAI().then(result => {
          sendResponse(result);
        });
        return true; // Keep message channel open for async response
      } else if (request.action === 'analyzeForm') {
        const fields = this.analyzeFormFields();
        sendResponse({ fields });
      } else if (request.action === 'checkIframes') {
        this.checkIframesForForms().then(result => {
          sendResponse(result);
        });
        return true;
      } else if (request.action === 'getAIStatus') {
        const stats = this.aiService.getUsageStats();
        sendResponse({ stats });
      } else if (request.action === 'ping') {
        sendResponse({ ready: true, timestamp: Date.now() });
      }
    });

    // Check if auto-fill is enabled
    chrome.storage.sync.get(['autoFill'], (result) => {
      if (result.autoFill) {
        setTimeout(() => this.fillFormWithAI(), CONFIG.AUTO_FILL_DELAY); // Wait for page to load
      }
    });

    // Monitor for dynamically loaded content
    this.observePageChanges();
  }

  detectFormPurpose() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const bodyText = document.body.textContent.toLowerCase();
    
    if (url.includes('contact') || title.includes('contact') || bodyText.includes('contact us')) {
      return 'Contact form';
    }
    if (url.includes('signup') || url.includes('register') || title.includes('sign up') || title.includes('register')) {
      return 'Registration form';
    }
    if (url.includes('login') || title.includes('login') || title.includes('sign in')) {
      return 'Login form';
    }
    if (url.includes('checkout') || url.includes('payment') || title.includes('checkout') || title.includes('payment')) {
      return 'Payment form';
    }
    if (url.includes('survey') || title.includes('survey') || bodyText.includes('survey')) {
      return 'Survey form';
    }
    if (url.includes('feedback') || title.includes('feedback') || bodyText.includes('feedback')) {
      return 'Feedback form';
    }
    
    return 'General form';
  }

  observePageChanges() {
    // Watch for new elements being added to the page
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if new iframes were added
              if (node.tagName === 'IFRAME') {
                this.injectIntoIframe(node);
              }
              // Check if new form elements were added
              const newInputs = node.querySelectorAll ? node.querySelectorAll('input, textarea, select') : [];
              if (newInputs.length > 0) {
                console.log('New form elements detected:', newInputs.length);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  async checkIframesForForms() {
    const iframes = document.querySelectorAll('iframe');
    let totalFields = 0;
    const iframeResults = [];

    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      try {
        if (iframe.contentDocument) {
          const iframeInputs = iframe.contentDocument.querySelectorAll('input, textarea, select');
          totalFields += iframeInputs.length;
          
          iframeResults.push({
            index: i,
            src: iframe.src,
            fields: iframeInputs.length,
            accessible: true
          });
        } else {
          iframeResults.push({
            index: i,
            src: iframe.src,
            fields: 'unknown',
            accessible: false
          });
        }
      } catch (error) {
        iframeResults.push({
          index: i,
          src: iframe.src,
          fields: 'error',
          accessible: false,
          error: error.message
        });
      }
    }

    return {
      totalIframes: iframes.length,
      totalFields: totalFields,
      iframeResults: iframeResults
    };
  }

  injectIntoIframe(iframe) {
    try {
      if (iframe.contentDocument) {
        console.log('Iframe detected:', iframe.src);
      }
    } catch (error) {
      console.log('Cross-origin iframe detected');
    }
  }

  analyzeFormFields() {
    const fields = [];
    const selectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="password"]',
      'input[type="tel"]',
      'input[type="number"]',
      'input[type="url"]',
      'input[type="search"]',
      'input[type="date"]',
      'input[type="time"]',
      'input[type="datetime-local"]',
      'input[type="month"]',
      'input[type="week"]',
      'input[type="color"]',
      'input[type="file"]',
      'input[type="range"]',
      'input:not([type])',
      'textarea',
      'select',
      'input[type="checkbox"]',
      'input[type="radio"]'
    ];

    // Check main page fields
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isVisible(element)) {
          const fieldInfo = {
            type: element.type || element.tagName.toLowerCase(),
            name: element.name || element.id || '',
            placeholder: element.placeholder || '',
            label: this.getFieldLabel(element),
            value: element.value || '',
            required: element.required || false,
            element: element,
            source: 'main-page'
          };
          fields.push(fieldInfo);
        }
      });
    });

    // Check iframe fields
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe, iframeIndex) => {
      try {
        if (iframe.contentDocument) {
          selectors.forEach(selector => {
            const iframeElements = iframe.contentDocument.querySelectorAll(selector);
            iframeElements.forEach(element => {
              if (this.isVisible(element)) {
                const fieldInfo = {
                  type: element.type || element.tagName.toLowerCase(),
                  name: element.name || element.id || '',
                  placeholder: element.placeholder || '',
                  label: this.getFieldLabel(element),
                  value: element.value || '',
                  required: element.required || false,
                  element: element,
                  source: `iframe-${iframeIndex + 1}`,
                  iframe: iframe
                };
                fields.push(fieldInfo);
              }
            });
          });
        }
      } catch (error) {
        // Cross-origin iframe, skip
      }
    });

    // Check for custom form elements
    const additionalSelectors = [
      '[data-form-field]',
      '[data-input]',
      '[role="textbox"]',
      '[role="combobox"]',
      '[role="listbox"]',
      '[contenteditable="true"]'
    ];
    
    additionalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isVisible(element) && !fields.some(f => f.element === element)) {
          const fieldInfo = {
            type: 'custom',
            name: element.getAttribute('data-form-field') || element.getAttribute('data-input') || element.id || '',
            placeholder: element.placeholder || '',
            label: this.getFieldLabel(element),
            value: element.value || element.textContent || '',
            required: element.required || false,
            element: element,
            source: 'main-page'
          };
          fields.push(fieldInfo);
        }
      });
    });

    this.formFields = fields;
    return fields;
  }

  isVisible(element) {
    const style = window.getComputedStyle(element);
    const isHidden = style.display === 'none' || 
                    style.visibility === 'hidden' || 
                    element.offsetWidth === 0 || 
                    element.offsetHeight === 0;
    
    const rect = element.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && 
                      rect.bottom > 0 && 
                      rect.left < window.innerWidth && 
                      rect.right > 0;
    
    return !isHidden || inViewport;
  }

  getFieldLabel(element) {
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.textContent.trim();
    }

    if (element.getAttribute('aria-label')) {
      return element.getAttribute('aria-label');
    }

    if (element.title) {
      return element.title;
    }

    const parent = element.parentElement;
    if (parent) {
      const textNodes = Array.from(parent.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .filter(text => text.length > 0);
      
      if (textNodes.length > 0) {
        return textNodes[0];
      }
    }

    return '';
  }

  async fillFormWithAI() {
    try {
      const fields = this.analyzeFormFields();
      if (fields.length === 0) {
        return { success: false, message: 'No form fields found' };
      }

      const profile = await this.getUserProfile();
      let filledCount = 0;
      
      for (const field of fields) {
        const value = await this.generateFieldValue(field, profile);
        if (value) {
          this.fillField(field.element, value);
          filledCount++;
        }
      }

      return { success: true, filledCount };
    } catch (error) {
      console.error('Error filling form:', error);
      return { success: false, message: error.message };
    }
  }

  async getUserProfile() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['userProfile'], (result) => {
        const profile = result.userProfile || {};
        
        // Log the profile data for debugging
        console.log('📋 Loading user profile:', profile);
        
        // Only use fallback values if no profile exists at all
        if (!profile.firstName && !profile.email) {
          console.log('⚠️ No profile found, using default values');
          const defaultProfile = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-123-4567',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            company: 'Tech Corp',
            jobTitle: 'Software Engineer',
            website: 'https://example.com'
          };
          resolve(defaultProfile);
        } else {
          console.log('✅ Using saved profile data');
          resolve(profile);
        }
      });
    });
  }

  async generateFieldValue(field, profile) {
    const fieldInfo = {
      type: field.type,
      name: field.name.toLowerCase(),
      placeholder: field.placeholder.toLowerCase(),
      label: field.label.toLowerCase(),
      required: field.required
    };

    console.log(`🤖 AI Form Filler: Analyzing field "${field.name}" (${field.type})`);
    console.log(`📋 Field details:`, {
      name: field.name,
      placeholder: field.placeholder,
      label: field.label,
      type: field.type,
      required: field.required
    });

    // For select fields, check available options first
    if (field.type === 'select-one' || field.type === 'select') {
      const options = Array.from(field.element.options);
      const validOptions = options.filter(opt => opt.value && opt.value.trim() !== '' && !opt.value.toLowerCase().includes('select'));
      
      console.log(`📋 Select field "${field.name}" has ${validOptions.length} valid options:`, validOptions.map(opt => opt.value));
      
      if (validOptions.length === 0) {
        console.log(`⚠️ No valid options found for select field "${field.name}"`);
        return '';
      }
      
      // Try to find a contextually appropriate option using AI
      if (this.aiService.isConfigured) {
        console.log(`🧠 Using AI to select best option for "${field.name}"`);
        const aiResult = await this.aiService.analyzeSelectOption(fieldInfo, validOptions, profile, this.pageContext);
        
        if (aiResult && aiResult.selectedOption) {
          console.log(`🎯 AI selected: "${aiResult.selectedOption}" (confidence: ${aiResult.confidence})`);
          console.log(`💭 AI reasoning: ${aiResult.reasoning}`);
          return aiResult.selectedOption;
        }
      }
      
      // Fallback to contextual selection
      const contextOptions = this.getContextualSelectValue(fieldInfo, validOptions);
      if (contextOptions) {
        console.log(`✅ Using contextual select value: "${contextOptions}"`);
        return contextOptions;
      }
      
      // If no contextual match, return the first valid option
      console.log(`📝 Using first valid select option: "${validOptions[0].value}"`);
      return validOptions[0].value;
    }

    // Check if AI is configured
    if (!this.aiService.isConfigured) {
      console.log(`⚠️ AI not configured, using fallback logic for field "${field.name}"`);
      const fallbackValue = this.aiService.getFallbackValue(fieldInfo, profile);
      console.log(`📝 Fallback value: "${fallbackValue}"`);
      return fallbackValue;
    }

    console.log(`🧠 AI is configured, attempting AI analysis for field "${field.name}"`);

    // Try AI-powered field recognition first
    const aiResult = await this.aiService.analyzeField(fieldInfo, profile, this.pageContext);
    
    if (aiResult && aiResult.value) {
      console.log(`🎯 AI suggested "${aiResult.value}" for field "${field.name}" (confidence: ${aiResult.confidence})`);
      console.log(`💭 AI reasoning: ${aiResult.reasoning}`);
      
      // If AI confidence is high enough, use it
      if (aiResult.confidence > CONFIG.CONFIDENCE_THRESHOLD) {
        console.log(`✅ Using AI suggestion (confidence ${aiResult.confidence} > ${CONFIG.CONFIDENCE_THRESHOLD})`);
        return aiResult.value;
      } else {
        console.log(`⚠️ AI confidence too low (${aiResult.confidence} <= ${CONFIG.CONFIDENCE_THRESHOLD}), using fallback`);
      }
    } else {
      console.log(`❌ AI analysis failed or returned no result for field "${field.name}"`);
    }
    
    // Fallback to rule-based logic if AI fails or confidence is low
    const fallbackValue = this.aiService.getFallbackValue(fieldInfo, profile);
    console.log(`📝 Using fallback value "${fallbackValue}" for field "${field.name}"`);
    
    return fallbackValue;
  }

  getContextualSelectValue(fieldInfo, options) {
    const { name, placeholder, label } = fieldInfo;
    
    // Common patterns for different types of dropdowns
    if (name.includes('country') || placeholder.includes('country') || label.includes('country')) {
      const countryOption = options.find(opt => 
        opt.text.toLowerCase().includes('usa') || 
        opt.text.toLowerCase().includes('united states') ||
        opt.text.toLowerCase().includes('america')
      );
      if (countryOption) return countryOption.value;
    }
    
    if (name.includes('state') || placeholder.includes('state') || label.includes('state')) {
      const stateOption = options.find(opt => 
        opt.text.toLowerCase().includes('new york') || 
        opt.text.toLowerCase().includes('ny')
      );
      if (stateOption) return stateOption.value;
    }
    
    if (name.includes('inquiry') || placeholder.includes('inquiry') || label.includes('inquiry') ||
        name.includes('type') || placeholder.includes('type') || label.includes('type')) {
      const inquiryOption = options.find(opt => 
        opt.text.toLowerCase().includes('general') || 
        opt.text.toLowerCase().includes('support') ||
        opt.text.toLowerCase().includes('question')
      );
      if (inquiryOption) return inquiryOption.value;
    }
    
    return null;
  }

  fillField(element, value) {
    try {
      // Clear any existing visual feedback first
      element.style.backgroundColor = '';
      element.style.border = '';
      element.style.color = '';
      element.style.fontWeight = '';
      
      // Set the value using multiple approaches for maximum compatibility
      element.value = value;
      element.setAttribute('value', value);
      
      // For React and other frameworks, also set the defaultValue
      element.defaultValue = value;
      
      // Trigger focus event first
      element.focus();
      
      // Trigger multiple events to ensure the website recognizes the change
      const events = ['input', 'change', 'blur', 'keyup', 'keydown'];
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
      });
      
      // Handle select elements
      if (element.tagName === 'SELECT') {
        const options = Array.from(element.options);
        const option = options.find(opt => 
          opt.text.toLowerCase().includes(value.toLowerCase()) ||
          opt.value.toLowerCase().includes(value.toLowerCase())
        );
        
        if (option) {
          element.value = option.value;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          const firstOption = options.find(opt => opt.value && opt.value.trim() !== '');
          if (firstOption) {
            element.value = firstOption.value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
      
      // Handle checkboxes and radios
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      
      // Add visual feedback
      this.addVisualFeedback(element, value);
      
      // Force a re-render by briefly changing and restoring the value
      setTimeout(() => {
        const currentValue = element.value;
        element.value = '';
        element.value = currentValue;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }, 10);
      
    } catch (error) {
      console.error('Error filling field:', error);
    }
  }

  addVisualFeedback(element, value) {
    const originalBackground = element.style.backgroundColor;
    const originalBorder = element.style.border;
    const originalColor = element.style.color;
    
    element.style.backgroundColor = '#e8f5e8';
    element.style.border = '2px solid #4CAF50';
    element.style.color = '#2e7d32';
    element.style.fontWeight = 'bold';
    
    // Add a temporary label
    const label = document.createElement('div');
    label.textContent = `✅ AI filled: ${value}`;
    label.style.cssText = `
      position: absolute;
      background: #4CAF50;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      pointer-events: none;
      margin-top: -25px;
      margin-left: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    // Position the label
    const rect = element.getBoundingClientRect();
    const iframe = element.closest('iframe');
    
    if (iframe) {
      const iframeRect = iframe.getBoundingClientRect();
      label.style.left = (iframeRect.left + rect.left) + 'px';
      label.style.top = (iframeRect.top + rect.top) + 'px';
    } else {
      label.style.left = rect.left + 'px';
      label.style.top = rect.top + 'px';
    }
    
    document.body.appendChild(label);
    
    // Remove visual feedback after 3 seconds
    setTimeout(() => {
      element.style.backgroundColor = originalBackground;
      element.style.border = originalBorder;
      element.style.color = originalColor;
      element.style.fontWeight = '';
      if (label.parentNode) {
        label.parentNode.removeChild(label);
      }
    }, 3000);
  }
}

// Initialize the form filler
const formFiller = new AIFormFiller();

// Global functions for testing
window.testAIFiller = function() {
  const fields = formFiller.analyzeFormFields();
  console.log('Detected fields:', fields);
  return fields;
};

window.fillSpecificField = function(fieldIndex, value) {
  const fields = formFiller.analyzeFormFields();
  if (fields[fieldIndex]) {
    formFiller.fillField(fields[fieldIndex].element, value);
  }
};

window.checkFieldValues = function() {
  const fields = formFiller.analyzeFormFields();
  fields.forEach((field, index) => {
    console.log(`${index + 1}. ${field.name}: "${field.element.value}"`);
  });
}; 