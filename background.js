// Glitch Garden - Service Worker
// Handles installation, updates, and background tasks

// Default settings
const DEFAULT_SETTINGS = {
  glitchIntensity: 25,
  effects: {
    wiggle: true,
    pixelFilter: true,
    wordSwap: false,
    rotate: false,
    colorShift: false,
    wobble: false,
    float: false,
    glitch404: false
  },
  garden: {
    flowers: [],
    lastWatered: Date.now(),
    totalPlayTime: 0
  },
  isPro: false,
  recipes: [],
  savedRecipes: [],
  accessibility: {
    dyslexiaFont: false,
    highContrast: false,
    reducedMotion: false
  }
};

// Initialize on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Set default settings
    await chrome.storage.local.set(DEFAULT_SETTINGS);
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('newtab/newtab.html?welcome=true')
    });
  }
  
  if (details.reason === 'update') {
    // Handle updates
    const { version } = chrome.runtime.getManifest();
    console.log(`Updated to version ${version}`);
  }
});

// Track active tabs for playtime
let activeTabId = null;
let activeTabStartTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Update playtime for previous tab
  if (activeTabId && activeTabStartTime) {
    const duration = (Date.now() - activeTabStartTime) / 1000 / 60; // minutes
    await updatePlaytime(duration);
  }
  
  // Start tracking new tab
  activeTabId = activeInfo.tabId;
  activeTabStartTime = Date.now();
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId === activeTabId && activeTabStartTime) {
    const duration = (Date.now() - activeTabStartTime) / 1000 / 60;
    await updatePlaytime(duration);
    activeTabId = null;
    activeTabStartTime = null;
  }
});

async function updatePlaytime(minutes) {
  if (minutes < 0.1) return; // Ignore very short tabs
  
  const data = await chrome.storage.local.get(['garden', 'isPro']);
  const garden = data.garden || DEFAULT_SETTINGS.garden;
  
  garden.totalPlayTime = (garden.totalPlayTime || 0) + minutes;
  
  // Grow flowers based on playtime (every 30 minutes)
  const newFlowers = Math.floor(garden.totalPlayTime / 30) - (garden.flowers?.length || 0);
  
  if (newFlowers > 0) {
    for (let i = 0; i < newFlowers; i++) {
      garden.flowers.push({
        id: Date.now() + i + Math.random(),
        type: ['daisy', 'rose', 'tulip', 'sunflower', 'cactus'][Math.floor(Math.random() * 5)],
        planted: Date.now(),
        watered: Date.now(),
        glitchType: ['wiggle', 'pixel', 'word', 'rotate', 'color'][Math.floor(Math.random() * 5)]
      });
    }
  }
  
  await chrome.storage.local.set({ garden });
}

// Alarm for auto-saving recipes
chrome.alarms.create('recipeSync', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'recipeSync') {
    syncRecipes();
  }
});

async function syncRecipes() {
  // In v1, recipes are stored locally
  // Future: sync with community via GitHub gist or similar
  console.log('Recipe sync placeholder');
}
