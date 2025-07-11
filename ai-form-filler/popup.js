// Minimal Popup JavaScript - No Shaking
document.addEventListener('DOMContentLoaded', function() {
  
  // Simple DOM elements
  const elements = {
    fillForm: document.getElementById('fillForm'),
    analyzeForm: document.getElementById('analyzeForm'),
    checkIframes: document.getElementById('checkIframes'),
    editProfile: document.getElementById('editProfile'),
    upgradeBtn: document.getElementById('upgradeBtn'),
    closeModal: document.getElementById('closeModal'),
    saveProfile: document.getElementById('saveProfile'),
    exportProfile: document.getElementById('exportProfile'),
    importProfile: document.getElementById('importProfile'),
    profileModal: document.getElementById('profileModal'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    status: document.getElementById('status'),
    autoFill: document.getElementById('autoFill'),
    smartSuggestions: document.getElementById('smartSuggestions'),
    privacyMode: document.getElementById('privacyMode')
  };

  // Simple initialization - no complex logic
  function init() {
    setStaticContent();
    setupEventListeners();
    loadCurrentProfile();
  }

  // Set static content to prevent any dynamic updates
  function setStaticContent() {
    // Set static profile info
    const profileName = document.getElementById('profileName');
    const profileTitle = document.getElementById('profileTitle');
    const profileEmail = document.getElementById('profileEmail');
    const avatarInitials = document.getElementById('avatarInitials');
    const profileProgress = document.getElementById('profileProgress');
    const profileScore = document.getElementById('profileScore');
    
    if (profileName) profileName.textContent = 'Complete Your Profile';
    if (profileTitle) profileTitle.textContent = 'Add your job title';
    if (profileEmail) profileEmail.textContent = 'Add your email';
    if (avatarInitials) avatarInitials.textContent = 'CP';
    if (profileProgress) profileProgress.style.width = '0%';
    if (profileScore) profileScore.textContent = '0%';
    
    // Set static stats
    const formsFilled = document.getElementById('formsFilled');
    const successRate = document.getElementById('successRate');
    const dailyCalls = document.getElementById('dailyCalls');
    const totalCalls = document.getElementById('totalCalls');
    const aiSuccessRate = document.getElementById('aiSuccessRate');
    
    if (formsFilled) formsFilled.textContent = '0';
    if (successRate) successRate.textContent = '0%';
    if (dailyCalls) dailyCalls.textContent = '0/10';
    if (totalCalls) totalCalls.textContent = '0';
    if (aiSuccessRate) aiSuccessRate.textContent = '0%';
    
    // Set static AI status
    const aiDot = document.querySelector('#aiStatus .ai-dot');
    const aiText = document.querySelector('#aiStatus .ai-text');
    
    if (aiDot) aiDot.className = 'ai-dot active';
    if (aiText) aiText.textContent = 'AI: Ready';
  }

  // Simple event listeners
  function setupEventListeners() {
    // Form actions
    if (elements.fillForm) {
      elements.fillForm.addEventListener('click', handleFillForm);
    }
    
    if (elements.analyzeForm) {
      elements.analyzeForm.addEventListener('click', handleAnalyzeForm);
    }
    
    if (elements.checkIframes) {
      elements.checkIframes.addEventListener('click', handleCheckIframes);
    }
    
    // Profile management
    if (elements.editProfile) {
      elements.editProfile.addEventListener('click', openProfileModal);
    }
    
    if (elements.closeModal) {
      elements.closeModal.addEventListener('click', closeProfileModal);
    }
    
    if (elements.saveProfile) {
      elements.saveProfile.addEventListener('click', saveProfile);
    }
    
    // Experience and Education buttons
    const addExperienceBtn = document.getElementById('addExperience');
    if (addExperienceBtn) {
      addExperienceBtn.addEventListener('click', addExperienceItem);
    }
    
    const addEducationBtn = document.getElementById('addEducation');
    if (addEducationBtn) {
      addEducationBtn.addEventListener('click', addEducationItem);
    }
    
    // Skills buttons
    const addTechnicalSkillBtn = document.getElementById('addTechnicalSkill');
    if (addTechnicalSkillBtn) {
      addTechnicalSkillBtn.addEventListener('click', () => addSkill('technicalSkill', 'technicalSkillsList'));
    }
    
    const addLanguageSkillBtn = document.getElementById('addLanguageSkill');
    if (addLanguageSkillBtn) {
      addLanguageSkillBtn.addEventListener('click', () => addSkill('languageSkill', 'languagesList'));
    }
    
    const addToolSkillBtn = document.getElementById('addToolSkill');
    if (addToolSkillBtn) {
      addToolSkillBtn.addEventListener('click', () => addSkill('toolSkill', 'toolsList'));
    }
    
    // Upgrade
    if (elements.upgradeBtn) {
      elements.upgradeBtn.addEventListener('click', () => {
        setStatus('Upgrade clicked!', 'success');
      });
    }
    
    // Settings
    if (elements.autoFill) {
      elements.autoFill.addEventListener('change', () => {
        setStatus('Auto-fill setting changed!', 'success');
      });
    }
    
    if (elements.smartSuggestions) {
      elements.smartSuggestions.addEventListener('change', () => {
        setStatus('Smart suggestions setting changed!', 'success');
      });
    }
    
    if (elements.privacyMode) {
      elements.privacyMode.addEventListener('change', () => {
        setStatus('Privacy mode setting changed!', 'success');
      });
    }
    
    // Modal overlay
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeProfileModal);
    }
    
    // Tab switching
    elements.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });
  }

  // Form actions
  function handleFillForm() {
    setStatus('Filling form...', 'loading');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        setStatus('No active tab found', 'error');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: 'fillForm'}, function(response) {
        if (chrome.runtime.lastError) {
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
  }

  function handleAnalyzeForm() {
    setStatus('Analyzing form...', 'loading');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        setStatus('No active tab found', 'error');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: 'analyzeForm'}, function(response) {
        if (chrome.runtime.lastError) {
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
  }

  function handleCheckIframes() {
    setStatus('Checking iframes...', 'loading');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        setStatus('No active tab found', 'error');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: 'checkIframes'}, function(response) {
        if (chrome.runtime.lastError) {
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
  }

  // Simple modal functions
  function openProfileModal() {
    if (elements.profileModal) {
      elements.profileModal.classList.remove('hidden');
      loadProfileData();
    }
  }

  function closeProfileModal() {
    if (elements.profileModal) {
      elements.profileModal.classList.add('hidden');
    }
  }

  function loadCurrentProfile() {
    chrome.storage.sync.get(['userProfile'], (result) => {
      const profile = result.userProfile || {};
      updateProfileDisplay(profile);
    });
  }

  function loadProfileData() {
    chrome.storage.sync.get(['userProfile'], (result) => {
      const profile = result.userProfile || {};
      
      // Load basic info
      if (profile.firstName) document.getElementById('firstName').value = profile.firstName;
      if (profile.lastName) document.getElementById('lastName').value = profile.lastName;
      if (profile.email) document.getElementById('email').value = profile.email;
      if (profile.phone) document.getElementById('phone').value = profile.phone;
      if (profile.address) document.getElementById('address').value = profile.address;
      if (profile.city) document.getElementById('city').value = profile.city;
      if (profile.state) document.getElementById('state').value = profile.state;
      if (profile.zipCode) document.getElementById('zipCode').value = profile.zipCode;
      if (profile.country) document.getElementById('country').value = profile.country;
      if (profile.website) document.getElementById('website').value = profile.website;
      if (profile.linkedin) document.getElementById('linkedin').value = profile.linkedin;
      if (profile.github) document.getElementById('github').value = profile.github;
      
      // Load professional info
      if (profile.jobTitle) document.getElementById('jobTitle').value = profile.jobTitle;
      if (profile.company) document.getElementById('company').value = profile.company;
      if (profile.industry) document.getElementById('industry').value = profile.industry;
      if (profile.yearsOfExperience) document.getElementById('yearsOfExperience').value = profile.yearsOfExperience;
      if (profile.summary) document.getElementById('summary').value = profile.summary;
      if (profile.bio) document.getElementById('bio').value = profile.bio;
      
      // Load skills
      if (profile.skills) {
        if (profile.skills.technical) {
          profile.skills.technical.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
              <span class="skill-text">${skill}</span>
              <button class="skill-remove" onclick="this.parentElement.remove()">×</button>
            `;
            document.getElementById('technicalSkillsList').appendChild(skillItem);
          });
        }
        
        if (profile.skills.languages) {
          profile.skills.languages.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
              <span class="skill-text">${skill}</span>
              <button class="skill-remove" onclick="this.parentElement.remove()">×</button>
            `;
            document.getElementById('languagesList').appendChild(skillItem);
          });
        }
        
        if (profile.skills.tools) {
          profile.skills.tools.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
              <span class="skill-text">${skill}</span>
              <button class="skill-remove" onclick="this.parentElement.remove()">×</button>
            `;
            document.getElementById('toolsList').appendChild(skillItem);
          });
        }
      }
      
      // Load experience
      if (profile.experience && profile.experience.length > 0) {
        const experienceList = document.getElementById('experienceList');
        experienceList.innerHTML = ''; // Clear existing items
        
        profile.experience.forEach(exp => {
          const experienceItem = document.createElement('div');
          experienceItem.className = 'experience-item';
          experienceItem.innerHTML = `
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Job Title</label>
                <input type="text" class="form-input" placeholder="Software Engineer" value="${exp.jobTitle || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-input" placeholder="Tech Corp" value="${exp.company || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="month" class="form-input" value="${exp.startDate || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="month" class="form-input" value="${exp.endDate || ''}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description</label>
                <textarea class="form-input form-textarea" placeholder="Job responsibilities and achievements...">${exp.description || ''}</textarea>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm remove-btn" onclick="this.parentElement.remove()">Remove</button>
          `;
          experienceList.appendChild(experienceItem);
        });
      }
      
      // Load education
      if (profile.education && profile.education.length > 0) {
        const educationList = document.getElementById('educationList');
        educationList.innerHTML = ''; // Clear existing items
        
        profile.education.forEach(edu => {
          const educationItem = document.createElement('div');
          educationItem.className = 'education-item';
          educationItem.innerHTML = `
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Degree</label>
                <input type="text" class="form-input" placeholder="Bachelor of Science" value="${edu.degree || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Field of Study</label>
                <input type="text" class="form-input" placeholder="Computer Science" value="${edu.fieldOfStudy || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Institution</label>
                <input type="text" class="form-input" placeholder="University Name" value="${edu.institution || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Graduation Year</label>
                <input type="number" class="form-input" placeholder="2020" value="${edu.graduationYear || ''}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description</label>
                <textarea class="form-input form-textarea" placeholder="Relevant coursework, achievements...">${edu.description || ''}</textarea>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm remove-btn" onclick="this.parentElement.remove()">Remove</button>
          `;
          educationList.appendChild(educationItem);
        });
      }
      
      // Load resume
      if (profile.resumeText) document.getElementById('resumeText').value = profile.resumeText;
    });
  }

  function switchTab(tabName) {
    // Update tab buttons
    elements.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab panes
    elements.tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `${tabName}-tab`);
    });
  }

  // Simple status function
  function setStatus(message, type) {
    if (elements.status) {
      elements.status.textContent = message;
      elements.status.className = `status-message ${type}`;
      
      setTimeout(() => {
        elements.status.textContent = '';
        elements.status.className = 'status-message';
      }, 3000);
    }
  }

  // Profile functions
  function saveProfile() {
    // Collect skills data
    const skills = {
      technical: Array.from(document.querySelectorAll('#technicalSkillsList .skill-text')).map(el => el.textContent),
      languages: Array.from(document.querySelectorAll('#languagesList .skill-text')).map(el => el.textContent),
      tools: Array.from(document.querySelectorAll('#toolsList .skill-text')).map(el => el.textContent)
    };

    // Debug: Log the skills being collected
    console.log('💾 Saving skills data:', skills);

    // Collect experience data
    const experience = [];
    document.querySelectorAll('#experienceList .experience-item').forEach(item => {
      const inputs = item.querySelectorAll('input, textarea');
      const exp = {};
      inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent?.toLowerCase().replace(/\s+/g, '') || '';
        if (label.includes('jobtitle')) exp.jobTitle = input.value;
        else if (label.includes('company')) exp.company = input.value;
        else if (label.includes('startdate')) exp.startDate = input.value;
        else if (label.includes('enddate')) exp.endDate = input.value;
        else if (label.includes('description')) exp.description = input.value;
      });
      if (exp.jobTitle || exp.company) experience.push(exp);
    });

    // Debug: Log the experience being collected
    console.log('💾 Saving experience data:', experience);

    // Collect education data
    const education = [];
    document.querySelectorAll('#educationList .education-item').forEach(item => {
      const inputs = item.querySelectorAll('input, textarea');
      const edu = {};
      inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent?.toLowerCase().replace(/\s+/g, '') || '';
        if (label.includes('degree')) edu.degree = input.value;
        else if (label.includes('fieldofstudy')) edu.fieldOfStudy = input.value;
        else if (label.includes('institution')) edu.institution = input.value;
        else if (label.includes('graduationyear')) edu.graduationYear = input.value;
        else if (label.includes('description')) edu.description = input.value;
      });
      if (edu.degree || edu.institution) education.push(edu);
    });

    // Debug: Log the education being collected
    console.log('💾 Saving education data:', education);

    const profile = {
      // Basic info
      firstName: document.getElementById('firstName')?.value || '',
      lastName: document.getElementById('lastName')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      address: document.getElementById('address')?.value || '',
      city: document.getElementById('city')?.value || '',
      state: document.getElementById('state')?.value || '',
      zipCode: document.getElementById('zipCode')?.value || '',
      country: document.getElementById('country')?.value || '',
      website: document.getElementById('website')?.value || '',
      linkedin: document.getElementById('linkedin')?.value || '',
      github: document.getElementById('github')?.value || '',
      
      // Professional info
      jobTitle: document.getElementById('jobTitle')?.value || '',
      company: document.getElementById('company')?.value || '',
      industry: document.getElementById('industry')?.value || '',
      yearsOfExperience: document.getElementById('yearsOfExperience')?.value || '',
      summary: document.getElementById('summary')?.value || '',
      bio: document.getElementById('bio')?.value || '',
      
      // Skills, Experience, and Education
      skills: skills,
      experience: experience,
      education: education,
      
      // Resume
      resumeText: document.getElementById('resumeText')?.value || ''
    };
    
    // Debug: Log the complete profile being saved
    console.log('💾 Saving complete profile:', profile);
    
    // Save to Chrome storage
    chrome.storage.sync.set({ userProfile: profile }, () => {
      setStatus('Profile saved successfully!', 'success');
      updateProfileDisplay(profile);
      closeProfileModal();
    });
  }

  function updateProfileDisplay(profile) {
    // Update main popup profile display
    const profileName = document.getElementById('profileName');
    const profileTitle = document.getElementById('profileTitle');
    const profileEmail = document.getElementById('profileEmail');
    const avatarInitials = document.getElementById('avatarInitials');
    
    if (profileName) {
      const fullName = `${profile.firstName || 'John'} ${profile.lastName || 'Doe'}`;
      profileName.textContent = fullName;
    }
    
    if (profileTitle) {
      profileTitle.textContent = profile.jobTitle || 'Software Engineer';
    }
    
    if (profileEmail) {
      profileEmail.textContent = profile.email || 'john.doe@example.com';
    }
    
    if (avatarInitials) {
      const initials = `${profile.firstName?.charAt(0) || 'J'}${profile.lastName?.charAt(0) || 'D'}`;
      avatarInitials.textContent = initials;
    }
    
    // Update profile completion
    updateProfileCompletion(profile);
  }

  function updateProfileCompletion(profile) {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'jobTitle', 'company'];
    const filledFields = fields.filter(field => profile[field] && profile[field].trim() !== '');
    const completion = Math.round((filledFields.length / fields.length) * 100);
    
    const progressBar = document.getElementById('profileProgress');
    const profileScore = document.getElementById('profileScore');
    
    if (progressBar) {
      progressBar.style.width = `${completion}%`;
    }
    
    if (profileScore) {
      profileScore.textContent = `${completion}%`;
    }
  }

  function addExperienceItem() {
    const experienceList = document.getElementById('experienceList');
    if (!experienceList) return;
    
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Job Title</label>
          <input type="text" class="form-input" placeholder="Software Engineer">
        </div>
        <div class="form-group">
          <label class="form-label">Company</label>
          <input type="text" class="form-input" placeholder="Tech Corp">
        </div>
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input type="month" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input type="month" class="form-input">
        </div>
        <div class="form-group full-width">
          <label class="form-label">Description</label>
          <textarea class="form-input form-textarea" placeholder="Job responsibilities and achievements..."></textarea>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    
    experienceList.appendChild(experienceItem);
  }

  function addEducationItem() {
    const educationList = document.getElementById('educationList');
    if (!educationList) return;
    
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Degree</label>
          <input type="text" class="form-input" placeholder="Bachelor of Science">
        </div>
        <div class="form-group">
          <label class="form-label">Field of Study</label>
          <input type="text" class="form-input" placeholder="Computer Science">
        </div>
        <div class="form-group">
          <label class="form-label">Institution</label>
          <input type="text" class="form-input" placeholder="University Name">
        </div>
        <div class="form-group">
          <label class="form-label">Graduation Year</label>
          <input type="number" class="form-input" placeholder="2020">
        </div>
        <div class="form-group full-width">
          <label class="form-label">Description</label>
          <textarea class="form-input form-textarea" placeholder="Relevant coursework, achievements..."></textarea>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    
    educationList.appendChild(educationItem);
  }

  function addSkill(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    
    if (!input || !list || !input.value.trim()) return;
    
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.innerHTML = `
      <span class="skill-text">${input.value}</span>
      <button class="skill-remove" onclick="this.parentElement.remove()">×</button>
    `;
    
    list.appendChild(skillItem);
    input.value = '';
  }

  // Initialize
  init();
});
