// Background service worker for AI Form Filler
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({
    autoFill: false,
    smartSuggestions: true,
    userProfile: {
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
    }
  });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will only trigger if no popup is defined
  console.log('Extension icon clicked on tab:', tab.id);
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'callAI') {
    handleAICall(request.data).then(response => {
      sendResponse(response);
    });
    return true; // Keep message channel open
  }
});

// AI API integration
async function handleAICall(data) {
  const { fieldInfo, userProfile } = data;
  
  // Mock AI response based on field type
  const mockAIResponse = {
    email: userProfile.email,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    phone: userProfile.phone,
    address: userProfile.address,
    city: userProfile.city,
    state: userProfile.state,
    zipCode: userProfile.zipCode,
    country: userProfile.country,
    company: userProfile.company,
    jobTitle: userProfile.jobTitle,
    website: userProfile.website
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    value: mockAIResponse[fieldInfo.type] || 'AI generated value'
  };
}

// Example OpenAI integration (you'll need to add your API key)
async function callOpenAI(prompt) {
  const API_KEY = 'your-openai-api-key'; // Store this securely
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that helps fill out web forms intelligently. Provide appropriate values based on the field context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
} 