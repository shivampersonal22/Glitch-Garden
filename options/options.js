// Glitch Garden - Options/Settings Page

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
  checkProStatus();
  calculateStorageSize();
  displayVersion();
});

// Load all settings
function loadSettings() {
  chrome.storage.local.get([
    'glitchIntensity',
    'enableOnStartup',
    'autoSaveRecipes',
    'gardenTheme',
    'showFlowerNames',
    'gardenAnimations',
    'dyslexiaFont',
    'highContrast',
    'reducedMotion',
    'animationSpeed',
    'isPro',
    'aiWordSwap',
    'custom404',
    'custom404Url'
  ], (result) => {
    // General
    document.getElementById('defaultIntensity').value = result.glitchIntensity || 25;
    document.getElementById('intensityDisplay').textContent = (result.glitchIntensity || 25) + '%';
    document.getElementById('enableOnStartup').checked = result.enableOnStartup !== false;
    document.getElementById('autoSaveRecipes').checked = result.autoSaveRecipes !== false;
    
    // Garden
    document.getElementById('gardenTheme').value = result.gardenTheme || 'default';
    document.getElementById('showFlowerNames').checked = result.showFlowerNames !== false;
    document.getElementById('gardenAnimations').checked = result.gardenAnimations !== false;
    
    // Accessibility
    document.getElementById('dyslexiaFont').checked = result.dyslexiaFont || false;
    document.getElementById('highContrast').checked = result.highContrast || false;
    document.getElementById('reducedMotion').checked = result.reducedMotion || false;
    document.getElementById('animationSpeed').value = result.animationSpeed || '1';
    
    // Pro features
    if (result.isPro) {
      document.getElementById('aiWordSwap').checked = result.aiWordSwap !== false;
      document.getElementById('custom404').checked = result.custom404 || false;
      document.getElementById('custom404Url').value = result.custom404Url || '';
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Intensity slider
  document.getElementById('defaultIntensity').addEventListener('input', (e) => {
    document.getElementById('intensityDisplay').textContent = e.target.value + '%';
  });
  
  // Save button
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  
  // Reset button
  document.getElementById('resetSettings').addEventListener('click', resetSettings);
  
  // Upgrade buttons
  document.getElementById('upgradeBtn').addEventListener('click', upgradeToPro);
  document.getElementById('proUpgradeBtn').addEventListener('click', upgradeToPro);
  
  // Garden reset
  document.getElementById('resetGardenBtn').addEventListener('click', resetGarden);
  
  // Data export/import
  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('importDataBtn').addEventListener('click', importData);
  document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
  
  // Links
  document.getElementById('websiteLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://glitchgarden.com' });
  });
  
  document.getElementById('githubLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/yourusername/glitch-garden' });
  });
  
  document.getElementById('supportLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://buymeacoffee.com/yourusername' });
  });
}

// Save settings
function saveSettings() {
  const settings = {
    glitchIntensity: parseInt(document.getElementById('defaultIntensity').value),
    enableOnStartup: document.getElementById('enableOnStartup').checked,
    autoSaveRecipes: document.getElementById('autoSaveRecipes').checked,
    gardenTheme: document.getElementById('gardenTheme').value,
    showFlowerNames: document.getElementById('showFlowerNames').checked,
    gardenAnimations: document.getElementById('gardenAnimations').checked,
    dyslexiaFont: document.getElementById('dyslexiaFont').checked,
    highContrast: document.getElementById('highContrast').checked,
    reducedMotion: document.getElementById('reducedMotion').checked,
    animationSpeed: document.getElementById('animationSpeed').value
  };
  
  // Add Pro settings if enabled
  chrome.storage.local.get(['isPro'], (result) => {
    if (result.isPro) {
      settings.aiWordSwap = document.getElementById('aiWordSwap').checked;
      settings.custom404 = document.getElementById('custom404').checked;
      settings.custom404Url = document.getElementById('custom404Url').value;
    }
    
    chrome.storage.local.set(settings, () => {
      showSaveStatus('✅ Settings saved');
      
      // Notify content script of changes
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { type: 'settingsUpdated', settings }).catch(() => {});
        });
      });
    });
  });
}

// Reset to defaults
function resetSettings() {
  if (confirm('Reset all settings to default? This will not delete your garden.')) {
    const defaults = {
      glitchIntensity: 25,
      enableOnStartup: true,
      autoSaveRecipes: true,
      gardenTheme: 'default',
      showFlowerNames: true,
      gardenAnimations: true,
      dyslexiaFont: false,
      highContrast: false,
      reducedMotion: false,
      animationSpeed: '1'
    };
    
    chrome.storage.local.set(defaults, () => {
      loadSettings();
      showSaveStatus('✅ Reset to defaults');
    });
  }
}

// Check Pro status
function checkProStatus() {
  chrome.storage.local.get(['isPro'], (result) => {
    const isPro = result.isPro || false;
    
    if (isPro) {
      document.getElementById('proStatus').textContent = '✨ Pro Plan';
      document.getElementById('proStatus').style.color = '#6ee7b7';
      document.getElementById('upgradeBtn').style.display = 'none';
      document.getElementById('proLocked').style.display = 'none';
      document.getElementById('proUnlocked').style.display = 'block';
    } else {
      document.getElementById('proStatus').textContent = 'Free Plan';
      document.getElementById('proStatus').style.color = '#aaa';
      document.getElementById('proLocked').style.display = 'block';
      document.getElementById('proUnlocked').style.display = 'none';
    }
  });
}

// Upgrade to Pro
function upgradeToPro() {
  chrome.tabs.create({ 
    url: 'https://gumroad.com/l/glitch-garden-pro?checkout=true' 
  });
}

// Reset garden
function resetGarden() {
  if (confirm('Are you sure? This will delete ALL your flowers permanently.')) {
    chrome.storage.local.get(['garden'], (result) => {
      const garden = result.garden || {};
      garden.flowers = [];
      garden.totalPlayTime = 0;
      
      chrome.storage.local.set({ garden }, () => {
        showSaveStatus('✅ Garden reset');
      });
    });
  }
}

// Export all data
function exportData() {
  chrome.storage.local.get(null, (data) => {
    const exportData = {
      exported: new Date().toISOString(),
      version: '1.0.0',
      data: data
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
      url: url,
      filename: `glitch-garden-backup-${new Date().toISOString().split('T')[0]}.json`
    });
  });
}

// Import data
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        
        if (confirm('Import this data? This will overwrite your current settings and garden.')) {
          chrome.storage.local.clear(() => {
            chrome.storage.local.set(imported.data, () => {
              showSaveStatus('✅ Data imported');
              loadSettings();
              checkProStatus();
            });
          });
        }
      } catch (error) {
        alert('Invalid backup file');
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}

// Clear all data
function clearAllData() {
  if (confirm('⚠️ DANGER: This will delete ALL your data permanently. This cannot be undone. Continue?')) {
    chrome.storage.local.clear(() => {
      showSaveStatus('✅ All data cleared');
      loadSettings();
      checkProStatus();
    });
  }
}

// Calculate storage size
function calculateStorageSize() {
  chrome.storage.local.get(null, (data) => {
    const size = new Blob([JSON.stringify(data)]).size;
    const kb = (size / 1024).toFixed(2);
    document.getElementById('storageSize').textContent = `${kb} KB`;
  });
}

// Show save status
function showSaveStatus(message) {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  status.style.opacity = '1';
  
  setTimeout(() => {
    status.style.opacity = '0';
  }, 3000);
}

// Display version
function displayVersion() {
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = manifest.version;
}
