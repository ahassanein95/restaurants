# 🤖 AI Form Filler

A Chrome extension that intelligently fills out web forms using AI-powered field recognition and user profile data.

## Features

### 🧠 AI-Powered Intelligence
- **Smart Field Recognition**: Uses OpenAI GPT to analyze form fields and determine the most appropriate values
- **Context-Aware Filling**: Understands form purpose and context to provide better suggestions
- **Confidence Scoring**: AI provides confidence scores for its suggestions, with fallback to rule-based logic
- **Adaptive Learning**: Gets smarter with each form it encounters

### 👤 User Profile Management
- Store personal information securely in Chrome's sync storage
- Syncs across devices automatically
- Includes name, email, phone, address, company, and more
- Customizable profile fields

### 🔍 Advanced Form Detection
- Detects forms on the main page and inside iframes
- Analyzes form purpose (contact, registration, payment, etc.)
- Handles various input types: text, email, phone, select dropdowns, textareas
- Visual feedback with highlighted filled fields

### ⚙️ Smart Configuration
- Auto-fill option for automatic form filling
- Smart suggestions toggle
- OpenAI API key management
- Connection testing and status indicators

## Configuration

### AI Settings (`config.js`)

The extension uses a centralized configuration file for easy management:

```javascript
const CONFIG = {
  // Your OpenAI API key
  OPENAI_API_KEY: 'sk-your-actual-api-key-here',
  
  // Rate limiting to control costs
  RATE_LIMITS: {
    maxCallsPerMinute: 20,    // API calls per minute
    maxCallsPerDay: 1000,     // API calls per day
  },
  
  // AI model settings
  AI_MODEL: 'gpt-3.5-turbo',  // OpenAI model
  MAX_TOKENS: 150,            // Response length
  TEMPERATURE: 0.3,           // Creativity level
  
  // Extension behavior
  AUTO_FILL_DELAY: 2000,      // Auto-fill delay (ms)
  CONFIDENCE_THRESHOLD: 0.7,  // AI confidence threshold
};
```

### Rate Limiting

The extension includes built-in rate limiting to control API costs:
- **Per Minute**: 20 calls (configurable)
- **Per Day**: 1,000 calls (configurable)
- **Automatic Fallback**: Falls back to rule-based logic when limits are reached
- **Usage Tracking**: Monitor usage in the extension popup

## Setup

### 1. Install the Extension
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder

### 2. Configure AI (Required for AI Features)
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open `config.js` in the extension folder
3. Replace `'YOUR_OPENAI_API_KEY_HERE'` with your actual API key
4. Optionally adjust rate limits and other settings in the config file
5. Reload the extension in `chrome://extensions/`

### 3. Set Up Your Profile
1. Open the extension popup
2. Fill in your personal information in the "User Profile" section
3. Click "Save Profile"

## Usage

### Basic Form Filling
1. Navigate to any webpage with forms
2. Click the extension icon
3. Click "Fill Form" to intelligently fill all detected fields
4. Or click "Analyze Form" to see what fields were detected

### AI vs Rule-Based Logic
- **With AI**: The extension uses OpenAI GPT to analyze field context and provide intelligent suggestions
- **Without AI**: Falls back to rule-based pattern matching (still effective for common fields)

### Auto-Fill Mode
Enable auto-fill in settings to automatically fill forms when you visit pages (with a 2-second delay).

## How AI Works

The AI integration provides several key benefits:

1. **Context Understanding**: Analyzes the form's purpose and context to make better decisions
2. **Field Analysis**: Examines field names, placeholders, labels, and surrounding text
3. **Smart Suggestions**: Generates contextually appropriate values for complex fields
4. **Confidence Scoring**: Provides confidence levels for suggestions, allowing fallback to rule-based logic
5. **Adaptive Responses**: Learns from form patterns to improve future suggestions

### Example AI Analysis
For a field with:
- Name: "message"
- Placeholder: "Tell us about your project"
- Context: Contact form on a web development agency

The AI might suggest: "I'm interested in having a professional website developed for my business. I'd like to discuss your services and get a quote for a modern, responsive design."

## Privacy & Security

- **Local Processing**: Form analysis happens locally in your browser
- **Secure Storage**: User profile data is stored securely in Chrome's sync storage
- **API Security**: OpenAI API key is stored locally and never shared
- **No Data Collection**: The extension doesn't collect or transmit your form data

## Technical Details

### Architecture
- **Content Scripts**: Detect and fill forms on web pages
- **Background Script**: Manages extension lifecycle and future AI integration
- **Popup UI**: User interface for configuration and controls
- **AI Service**: Handles OpenAI API communication and field analysis

### Permissions
- `activeTab`: Access to current tab for form filling
- `storage`: Save user profile and settings
- `scripting`: Execute scripts in tabs
- `https://api.openai.com/*`: OpenAI API access

## Troubleshooting

### AI Not Working
1. Check that your OpenAI API key is correctly entered
2. Test the connection using the "Test AI Connection" button
3. Ensure you have internet connectivity
4. Verify your OpenAI account has available credits

### Forms Not Detected
1. Try clicking "Check for Embedded Forms" if the form is in an iframe
2. Some forms may load dynamically - wait a few seconds and try again
3. Check the browser console for any error messages

### Fields Not Filled
1. Ensure your user profile is complete
2. Check that the field types are supported
3. Try refreshing the page and filling again

## Development

### File Structure
```
ai-form-filler/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── content.js            # Content script for form detection/filling
├── ai-service.js         # AI integration service
├── background.js         # Background script
└── images/               # Extension icons
```

### Adding New Features
1. The AI service can be extended with new field types
2. User profile can be expanded with additional fields
3. Form detection can be enhanced for new form frameworks

## License

This project is open source and available under the MIT License.