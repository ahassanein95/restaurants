document.addEventListener('DOMContentLoaded', function() {
  const fillFormBtn = document.getElementById('fillForm');
  const analyzeFormBtn = document.getElementById('analyzeForm');
  const checkIframesBtn = document.getElementById('checkIframes');
  const statusDiv = document.getElementById('status');
  const autoFillToggle = document.getElementById('autoFillToggle');
  const smartToggle = document.getElementById('smartToggle');
  
  // Profile form elements
  const saveProfileBtn = document.getElementById('saveProfile');
  const profileInputs = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    city: document.getElementById('city'),
    state: document.getElementById('state'),
    zipCode: document.getElementById('zipCode'),
    country: document.getElementById('country'),
    company: document.getElementById('company'),
    jobTitle: document.getElementById('jobTitle'),
    website: document.getElementById('website')
  };

  // AI Status and Usage
  const aiIndicator = document.getElementById('aiIndicator');
  const aiDot = aiIndicator.querySelector('.ai-dot');
  const aiText = aiIndicator.querySelector('.ai-text');

  // Load saved settings and profile
  chrome.storage.sync.get(['autoFill', 'smartSuggestions', 'userProfile'], function(result) {
    if (result.autoFill) autoFillToggle.classList.add('active');
    if (result.smartSuggestions !== false) smartToggle.classList.add('active');
    
    if (result.userProfile) {
      Object.keys(result.userProfile).forEach(key => {
        if (profileInputs[key]) {
          profileInputs[key].value = result.userProfile[key] || '';
        }
      });
    }
  });

  // Handle toggle switches
  autoFillToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    chrome.storage.sync.set({ autoFill: this.classList.contains('active') });
  });

  smartToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    chrome.storage.sync.set({ smartSuggestions: this.classList.contains('active') });
  });

  // Save profile button
  saveProfileBtn.addEventListener('click', function() {
    const profile = {};
    Object.keys(profileInputs).forEach(key => {
      if (profileInputs[key]) {
        profile[key] = profileInputs[key].value.trim();
      }
    });
    
    chrome.storage.sync.set({ userProfile: profile }, function() {
      setStatus('Profile saved successfully!', 'success');
    });
  });

  // Fill form button
  fillFormBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        setStatus('No active tab found', 'error');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: 'fillForm'}, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Communication error:', chrome.runtime.lastError.message);
          setStatus('Page not ready. Please refresh and try again.', 'error');
          return;
        }

        if (response && response.success) {
          setStatus(`Form filled successfully! ${response.filledCount} fields filled.`, 'success');
        } else {
          setStatus('No forms found or error occurred.', 'error');
        }
      });
    });
  });

  // Analyze form button
  analyzeFormBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        setStatus('No active tab found', 'error');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: 'analyzeForm'}, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Communication error:', chrome.runtime.lastError.message);
          setStatus('Page not ready. Please refresh and try again.', 'error');
          return;
        }

        if (response && response.fields) {
          setStatus(`Found ${response.fields.length} form fields.`, 'success');
        } else {
          setStatus('No forms found.', 'error');
        }
      });
    });
  });

  // Check iframes button
  checkIframesBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        setStatus('No active tab found', 'error');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: 'checkIframes'}, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Communication error:', chrome.runtime.lastError.message);
          setStatus('Page not ready. Please refresh and try again.', 'error');
          return;
        }

        if (response && response.forms) {
          setStatus(`Found ${response.forms} forms in iframes.`, 'success');
        } else {
          setStatus('No forms found in iframes.', 'error');
        }
      });
    });
  });

  // Update AI status
  function updateAIStatus() {
    // Get AI status from content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        console.log('No active tab found');
        aiDot.className = 'ai-dot error';
        aiText.textContent = 'AI: No active tab';
        return;
      }

      // First ping to check if content script is ready
      chrome.tabs.sendMessage(tabs[0].id, {action: 'ping'}, function(pingResponse) {
        if (chrome.runtime.lastError) {
          console.log('Content script not ready:', chrome.runtime.lastError.message);
          aiDot.className = 'ai-dot error';
          aiText.textContent = 'AI: Page not ready';
          return;
        }

        // Now get AI status
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getAIStatus'}, function(response) {
          if (chrome.runtime.lastError) {
            console.log('Communication error:', chrome.runtime.lastError.message);
            aiDot.className = 'ai-dot error';
            aiText.textContent = 'AI: Page not ready';
            return;
          }

          if (response && response.stats) {
            const stats = response.stats;
            if (stats.isConfigured) {
              aiDot.className = 'ai-dot active';
              aiText.textContent = `AI: Ready (${stats.dailyCalls}/${stats.rateLimit.maxCallsPerDay} today)`;
            } else {
              aiDot.className = 'ai-dot error';
              aiText.textContent = 'AI: Not configured';
            }
            
            // Update usage statistics
            updateUsageStats(stats);
          } else {
            aiDot.className = 'ai-dot';
            aiText.textContent = 'AI: Loading...';
          }
        });
      });
    });
  }

  function updateUsageStats(stats) {
    document.getElementById('dailyCalls').textContent = `${stats.dailyCalls}/${stats.rateLimit.maxCallsPerDay}`;
    document.getElementById('totalCalls').textContent = stats.totalCalls;
    
    const successRate = stats.totalCalls > 0 
      ? Math.round((stats.successfulCalls / stats.totalCalls) * 100) 
      : 0;
    document.getElementById('successRate').textContent = `${successRate}%`;
  }

  // Update AI status on popup open
  updateAIStatus();

  function setStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    
    // Clear status after 3 seconds
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 3000);
  }
}); 