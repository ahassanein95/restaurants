// Configuration file for AI Form Filler
// Replace the placeholder with your actual OpenAI API key

const CONFIG = {
  // OpenAI API Configuration
  OPENAI_API_KEY: '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', // Replace with your actual API key
  
  // Rate Limiting Configuration
  RATE_LIMITS: {
    maxCallsPerMinute: 20,    // Maximum API calls per minute
    maxCallsPerDay: 1000,     // Maximum API calls per day
  },
  
  // AI Model Configuration
  AI_MODEL: 'gpt-3.5-turbo',  // OpenAI model to use
  MAX_TOKENS: 150,            // Maximum tokens per response
  TEMPERATURE: 0.3,           // Response creativity (0-1)
  
  // Extension Configuration
  AUTO_FILL_DELAY: 2000,      // Delay before auto-filling (ms)
  CONFIDENCE_THRESHOLD: 0.7,  // Minimum AI confidence to use AI suggestions
};

// Export for use in other files
window.CONFIG = CONFIG;

// Debug logging
console.log('📋 Config file loaded');
console.log('📋 CONFIG object:', CONFIG);
console.log('📋 API Key in config:', CONFIG.OPENAI_API_KEY ? 'Present' : 'Missing'); 