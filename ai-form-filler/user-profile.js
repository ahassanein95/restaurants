// Enhanced User Profile Management System
class UserProfileManager {
  constructor() {
    this.profile = this.getDefaultProfile();
    this.loadProfile();
  }

  getDefaultProfile() {
    return {
      // Basic Information
      basic: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        website: '',
        linkedin: '',
        github: '',
        portfolio: ''
      },

      // Professional Information
      professional: {
        jobTitle: '',
        company: '',
        industry: '',
        yearsOfExperience: '',
        bio: '',
        summary: ''
      },

      // Work Experience
      workExperience: [],

      // Education
      education: [],

      // Skills & Certifications
      skills: {
        technical: [],
        languages: [],
        tools: [],
        certifications: []
      },

      // Job Preferences
      jobPreferences: {
        desiredSalary: {
          min: '',
          max: '',
          currency: 'USD'
        },
        location: {
          cities: [],
          countries: [],
          remoteWork: 'hybrid', // onsite, remote, hybrid
          relocation: false
        },
        industries: [],
        companySize: [], // startup, small, medium, large
        workType: [] // full-time, part-time, contract, freelance
      },

      // Resume/CV
      resume: {
        text: '',
        fileName: '',
        lastUpdated: null
      },

      // Settings
      settings: {
        theme: 'light', // light, dark, auto
        autoFill: true,
        smartSuggestions: true,
        privacyMode: false
      },

      // Usage & Analytics
      analytics: {
        totalFormsFilled: 0,
        successfulFills: 0,
        lastUsed: null,
        favoriteSites: []
      }
    };
  }

  async loadProfile() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['userProfile'], (result) => {
        if (result.userProfile) {
          this.profile = this.mergeProfiles(this.profile, result.userProfile);
        }
        resolve();
      });
    });
  }

  async saveProfile() {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ userProfile: this.profile }, () => {
        console.log('✅ Profile saved successfully');
        resolve();
      });
    });
  }

  mergeProfiles(defaultProfile, savedProfile) {
    // Deep merge to handle new fields
    const merged = { ...defaultProfile };
    
    for (const key in savedProfile) {
      if (typeof savedProfile[key] === 'object' && !Array.isArray(savedProfile[key])) {
        merged[key] = { ...merged[key], ...savedProfile[key] };
      } else {
        merged[key] = savedProfile[key];
      }
    }
    
    return merged;
  }

  // Work Experience Methods
  addWorkExperience(experience) {
    const newExperience = {
      id: Date.now().toString(),
      company: experience.company || '',
      jobTitle: experience.jobTitle || '',
      location: experience.location || '',
      startDate: experience.startDate || '',
      endDate: experience.endDate || '',
      current: experience.current || false,
      description: experience.description || '',
      achievements: experience.achievements || [],
      skills: experience.skills || [],
      ...experience
    };

    this.profile.workExperience.push(newExperience);
    this.saveProfile();
    return newExperience;
  }

  updateWorkExperience(id, updates) {
    const index = this.profile.workExperience.findIndex(exp => exp.id === id);
    if (index !== -1) {
      this.profile.workExperience[index] = { ...this.profile.workExperience[index], ...updates };
      this.saveProfile();
      return this.profile.workExperience[index];
    }
    return null;
  }

  removeWorkExperience(id) {
    this.profile.workExperience = this.profile.workExperience.filter(exp => exp.id !== id);
    this.saveProfile();
  }

  // Education Methods
  addEducation(education) {
    const newEducation = {
      id: Date.now().toString(),
      institution: education.institution || '',
      degree: education.degree || '',
      field: education.field || '',
      location: education.location || '',
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      current: education.current || false,
      gpa: education.gpa || '',
      description: education.description || '',
      achievements: education.achievements || [],
      ...education
    };

    this.profile.education.push(newEducation);
    this.saveProfile();
    return newEducation;
  }

  updateEducation(id, updates) {
    const index = this.profile.education.findIndex(edu => edu.id === id);
    if (index !== -1) {
      this.profile.education[index] = { ...this.profile.education[index], ...updates };
      this.saveProfile();
      return this.profile.education[index];
    }
    return null;
  }

  removeEducation(id) {
    this.profile.education = this.profile.education.filter(edu => edu.id !== id);
    this.saveProfile();
  }

  // Skills Methods
  addSkill(category, skill) {
    if (!this.profile.skills[category]) {
      this.profile.skills[category] = [];
    }
    
    const newSkill = {
      id: Date.now().toString(),
      name: skill.name || skill,
      level: skill.level || 'intermediate', // beginner, intermediate, advanced, expert
      years: skill.years || '',
      ...skill
    };

    this.profile.skills[category].push(newSkill);
    this.saveProfile();
    return newSkill;
  }

  updateSkill(category, id, updates) {
    const index = this.profile.skills[category]?.findIndex(skill => skill.id === id);
    if (index !== -1) {
      this.profile.skills[category][index] = { ...this.profile.skills[category][index], ...updates };
      this.saveProfile();
      return this.profile.skills[category][index];
    }
    return null;
  }

  removeSkill(category, id) {
    if (this.profile.skills[category]) {
      this.profile.skills[category] = this.profile.skills[category].filter(skill => skill.id !== id);
      this.saveProfile();
    }
  }

  // Resume Methods
  updateResume(resumeData) {
    this.profile.resume = {
      ...this.profile.resume,
      ...resumeData,
      lastUpdated: new Date().toISOString()
    };
    this.saveProfile();
  }

  // Analytics Methods
  trackFormFill(success = true, siteUrl = '') {
    this.profile.analytics.totalFormsFilled++;
    if (success) {
      this.profile.analytics.successfulFills++;
    }
    this.profile.analytics.lastUsed = new Date().toISOString();
    
    if (siteUrl) {
      this.addFavoriteSite(siteUrl);
    }
    
    this.saveProfile();
  }

  addFavoriteSite(siteUrl) {
    if (!this.profile.analytics.favoriteSites.includes(siteUrl)) {
      this.profile.analytics.favoriteSites.push(siteUrl);
      // Keep only last 10 favorite sites
      if (this.profile.analytics.favoriteSites.length > 10) {
        this.profile.analytics.favoriteSites = this.profile.analytics.favoriteSites.slice(-10);
      }
    }
  }

  // Profile Export/Import
  exportProfile() {
    return JSON.stringify(this.profile, null, 2);
  }

  importProfile(profileData) {
    try {
      const imported = JSON.parse(profileData);
      this.profile = this.mergeProfiles(this.getDefaultProfile(), imported);
      this.saveProfile();
      return true;
    } catch (error) {
      console.error('Failed to import profile:', error);
      return false;
    }
  }

  // Get Profile Data for AI
  getProfileForAI() {
    return {
      basic: this.profile.basic,
      professional: this.profile.professional,
      workExperience: this.profile.workExperience,
      education: this.profile.education,
      skills: this.profile.skills,
      jobPreferences: this.profile.jobPreferences,
      resume: this.profile.resume
    };
  }

  // Get Profile Summary for Forms
  getProfileSummary() {
    const summary = {
      fullName: `${this.profile.basic.firstName} ${this.profile.basic.lastName}`.trim(),
      email: this.profile.basic.email,
      phone: this.profile.basic.phone,
      address: this.profile.basic.address,
      city: this.profile.basic.city,
      state: this.profile.basic.state,
      zipCode: this.profile.basic.zipCode,
      country: this.profile.basic.country,
      website: this.profile.basic.website,
      jobTitle: this.profile.professional.jobTitle,
      company: this.profile.professional.company,
      yearsOfExperience: this.profile.professional.yearsOfExperience,
      bio: this.profile.professional.bio,
      summary: this.profile.professional.summary
    };

    // Add most recent work experience
    if (this.profile.workExperience.length > 0) {
      const latest = this.profile.workExperience[0];
      summary.latestCompany = latest.company;
      summary.latestJobTitle = latest.jobTitle;
      summary.latestJobDescription = latest.description;
    }

    // Add highest education
    if (this.profile.education.length > 0) {
      const highest = this.profile.education[0];
      summary.highestDegree = highest.degree;
      summary.institution = highest.institution;
      summary.fieldOfStudy = highest.field;
    }

    return summary;
  }

  // Profile Completion Score
  getProfileCompletionScore() {
    const sections = [
      { name: 'basic', weight: 0.3 },
      { name: 'professional', weight: 0.2 },
      { name: 'workExperience', weight: 0.25 },
      { name: 'education', weight: 0.15 },
      { name: 'skills', weight: 0.1 }
    ];

    let totalScore = 0;
    
    sections.forEach(section => {
      const sectionScore = this.getSectionCompletionScore(section.name);
      totalScore += sectionScore * section.weight;
    });

    return Math.round(totalScore * 100);
  }

  getSectionCompletionScore(sectionName) {
    const section = this.profile[sectionName];
    if (!section) return 0;

    let filledFields = 0;
    let totalFields = 0;

    if (sectionName === 'basic' || sectionName === 'professional') {
      Object.keys(section).forEach(key => {
        totalFields++;
        if (section[key] && section[key].toString().trim() !== '') {
          filledFields++;
        }
      });
    } else if (sectionName === 'workExperience') {
      totalFields = 1;
      filledFields = section.length > 0 ? 1 : 0;
    } else if (sectionName === 'education') {
      totalFields = 1;
      filledFields = section.length > 0 ? 1 : 0;
    } else if (sectionName === 'skills') {
      Object.keys(section).forEach(category => {
        totalFields++;
        if (section[category] && section[category].length > 0) {
          filledFields++;
        }
      });
    }

    return totalFields > 0 ? filledFields / totalFields : 0;
  }
}

// Export for use in other files
window.UserProfileManager = UserProfileManager; 