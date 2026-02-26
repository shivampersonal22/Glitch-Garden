// Glitch Garden - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});

function loadSettings() {
  chrome.storage.local.get(['glitchIntensity', 'effects', 'isPro', 'garden'], (result) => {
    // Set intensity slider
    const intensity = result.glitchIntensity || 25;
    document.getElementById('intensity').value = intensity;
    document.getElementById('intensityValue').textContent = intensity + '%';
    
    // Set effect toggles
    const effects = result.effects || {
      wiggle: true,
      pixelFilter: true,
      wordSwap: false,
      rotate: true,
      colorShift: true,
      wobble: true,
      float: true,
      glitch404: false
    };
    
    for (const [effect, enabled] of Object.entries(effects)) {
      const checkbox = document.getElementById(`effect-${effect}`);
      if (checkbox) {
        checkbox.checked = enabled;
      }
    }
    
    // Handle Pro features
    const isPro = result.isPro || false;
    if (isPro) {
      document.getElementById('effect-wordSwap').disabled = false;
      document.getElementById('effect-glitch404').disabled = false;
      document.getElementById('proPrompt').style.display = 'none';
    }
    
    // Update garden preview
    const garden = result.garden || { flowers: [] };
    updateGardenPreview(garden.flowers || []);
  });
}

function setupEventListeners() {
  // Intensity slider
  document.getElementById('intensity').addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('intensityValue').textContent = value + '%';
    
    chrome.storage.local.set({ glitchIntensity: parseInt(value) });
  });
  
  // Effect toggles (event delegation)
  document.getElementById('effectsGrid').addEventListener('change', (e) => {
    if (e.target.classList.contains('effect-toggle')) {
      const effectId = e.target.id.replace('effect-', '');
      
      chrome.storage.local.get(['effects'], (result) => {
        const effects = result.effects || {};
        effects[effectId] = e.target.checked;
        chrome.storage.local.set({ effects });
      });
    }
  });
  
  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // View garden link
  document.getElementById('viewGardenLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('newtab/newtab.html') });
  });
  
  // View recipes link
  document.getElementById('viewRecipesLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('recipes/recipes.html') });
  });
  
  // Recipe items
  document.querySelectorAll('.recipe-item').forEach(item => {
    item.addEventListener('click', () => {
      const recipe = item.dataset.recipe;
      applyRecipe(recipe);
    });
  });
  
  // Upgrade button
  document.getElementById('upgradeBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://gumroad.com/l/glitch-garden-pro' });
  });
}

function updateGardenPreview(flowers) {
  const preview = document.getElementById('flowerPreview');
  if (!preview) return;
  
  preview.innerHTML = '';
  
  if (flowers.length === 0) {
    preview.innerHTML = '<span class="flower">🌱</span><span class="flower">🌱</span><span class="flower">🌱</span>';
    return;
  }
  
  // Show last 3 flowers
  const lastFlowers = flowers.slice(-3);
  lastFlowers.forEach(flower => {
    const flowerEl = document.createElement('span');
    flowerEl.className = 'flower';
    
    switch(flower.type) {
      case 'daisy': flowerEl.textContent = '🌼'; break;
      case 'rose': flowerEl.textContent = '🌹'; break;
      case 'tulip': flowerEl.textContent = '🌷'; break;
      case 'sunflower': flowerEl.textContent = '🌻'; break;
      case 'cactus': flowerEl.textContent = '🌵'; break;
      default: flowerEl.textContent = '🌸';
    }
    
    preview.appendChild(flowerEl);
  });
}

function applyRecipe(recipe) {
  let settings = {};
  
  switch(recipe) {
    case 'chaos':
      settings = {
        glitchIntensity: 100,
        effects: {
          wiggle: true,
          pixelFilter: true,
          wordSwap: true,
          rotate: true,
          colorShift: true,
          wobble: true,
          float: true,
          glitch404: true
        }
      };
      break;
      
    case 'relax':
      settings = {
        glitchIntensity: 30,
        effects: {
          wiggle: false,
          pixelFilter: false,
          wordSwap: false,
          rotate: false,
          colorShift: true,
          wobble: false,
          float: true,
          glitch404: false
        }
      };
      break;
      
    case 'focus':
      settings = {
        glitchIntensity: 15,
        effects: {
          wiggle: false,
          pixelFilter: false,
          wordSwap: true,
          rotate: false,
          colorShift: false,
          wobble: false,
          float: false,
          glitch404: false
        }
      };
      break;
  }
  
  chrome.storage.local.set(settings, () => {
    // Reload popup to show changes
    window.location.reload();
  });
}
