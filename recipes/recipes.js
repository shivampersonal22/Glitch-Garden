// Glitch Garden - Recipes Page

// Sample recipe data
const DEFAULT_RECIPES = [
  {
    id: 'chaos',
    name: 'Chaos Mode',
    description: 'Maximum glitch. Everything everywhere all at once.',
    intensity: 100,
    effects: {
      wiggle: true,
      pixelFilter: true,
      wordSwap: true,
      rotate: true,
      colorShift: true,
      wobble: true,
      float: true,
      glitch404: true
    },
    author: 'Community',
    uses: 1247,
    saves: 342,
    pro: true,
    created: '2024-01-15'
  },
  {
    id: 'relax',
    name: 'Relax Mode',
    description: 'Gentle color shifts and floating elements. Perfect for unwinding.',
    intensity: 30,
    effects: {
      wiggle: false,
      pixelFilter: false,
      wordSwap: false,
      rotate: false,
      colorShift: true,
      wobble: false,
      float: true,
      glitch404: false
    },
    author: 'Community',
    uses: 856,
    saves: 234,
    pro: false,
    created: '2024-02-01'
  },
  {
    id: 'focus',
    name: 'Focus Mode',
    description: 'Subtle word highlighting to keep your brain engaged.',
    intensity: 15,
    effects: {
      wiggle: false,
      pixelFilter: false,
      wordSwap: true,
      rotate: false,
      colorShift: false,
      wobble: false,
      float: false,
      glitch404: false
    },
    author: 'Community',
    uses: 623,
    saves: 156,
    pro: true,
    created: '2024-01-28'
  },
  {
    id: 'retro',
    name: 'Retro Glitch',
    description: 'Pixel filters and wobble for that old-school CRT feel.',
    intensity: 45,
    effects: {
      wiggle: false,
      pixelFilter: true,
      wordSwap: false,
      rotate: true,
      colorShift: true,
      wobble: true,
      float: false,
      glitch404: false
    },
    author: 'Community',
    uses: 412,
    saves: 98,
    pro: false,
    created: '2024-02-10'
  },
  {
    id: 'surprise',
    name: 'Surprise Mode',
    description: 'Random effects at random times. Never the same twice.',
    intensity: 60,
    effects: {
      wiggle: true,
      pixelFilter: true,
      wordSwap: false,
      rotate: true,
      colorShift: true,
      wobble: true,
      float: true,
      glitch404: false
    },
    author: 'Community',
    uses: 389,
    saves: 76,
    pro: false,
    created: '2024-02-05'
  },
  {
    id: 'extreme',
    name: 'Extreme Chaos',
    description: 'For the true glitch enthusiasts. 404 pranks included.',
    intensity: 90,
    effects: {
      wiggle: true,
      pixelFilter: true,
      wordSwap: true,
      rotate: true,
      colorShift: true,
      wobble: true,
      float: true,
      glitch404: true
    },
    author: 'Community',
    uses: 267,
    saves: 45,
    pro: true,
    created: '2024-01-20'
  }
];

let currentTab = 'trending';
let userRecipes = [];

document.addEventListener('DOMContentLoaded', () => {
  loadUserRecipes();
  loadRecipes('trending');
  setupEventListeners();
});

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentTab = e.target.dataset.tab;
      loadRecipes(currentTab);
    });
  });
  
  // Save recipe button
  document.getElementById('saveRecipeBtn').addEventListener('click', saveRecipe);
  
  // Intensity slider
  document.getElementById('recipeIntensity').addEventListener('input', (e) => {
    document.getElementById('recipeIntensityDisplay').textContent = e.target.value + '%';
  });
  
  // Navigation links
  document.getElementById('gardenLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('newtab/newtab.html') });
  });
  
  document.getElementById('settingsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  
  document.getElementById('shareLink').addEventListener('click', (e) => {
    e.preventDefault();
    shareCurrentRecipe();
  });
}

function loadUserRecipes() {
  chrome.storage.local.get(['userRecipes'], (result) => {
    userRecipes = result.userRecipes || [];
  });
}

function loadRecipes(tab) {
  const grid = document.getElementById('recipesGrid');
  grid.innerHTML = '';
  
  let recipes = [];
  
  switch(tab) {
    case 'trending':
      recipes = [...DEFAULT_RECIPES].sort((a, b) => b.uses - a.uses);
      break;
    case 'newest':
      recipes = [...DEFAULT_RECIPES].sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case 'popular':
      recipes = [...DEFAULT_RECIPES].sort((a, b) => b.saves - a.saves);
      break;
    case 'my':
      recipes = userRecipes;
      if (recipes.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
            <span style="font-size: 48px;">📝</span>
            <p style="color: #888; margin-top: 20px;">You haven't created any recipes yet.</p>
            <p style="color: #666; font-size: 14px;">Use the form below to create your first recipe!</p>
          </div>
        `;
        return;
      }
      break;
  }
  
  recipes.forEach(recipe => {
    grid.appendChild(createRecipeCard(recipe));
  });
}

function createRecipeCard(recipe) {
  const card = document.createElement('div');
  card.className = `recipe-card ${recipe.pro ? 'pro' : ''}`;
  card.dataset.id = recipe.id;
  
  // Calculate intensity percentage for bar
  const intensityPercent = recipe.intensity || 50;
  
  // Get active effects
  const effects = recipe.effects || {};
  const activeEffects = Object.entries(effects)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name);
  
  card.innerHTML = `
    <div class="recipe-header">
      <h3 class="recipe-name">${recipe.name}</h3>
      ${recipe.pro ? '<span class="recipe-badge">PRO</span>' : ''}
    </div>
    
    <div class="recipe-meta">
      <span>👤 ${recipe.author || 'You'}</span>
      <span>📅 ${formatDate(recipe.created)}</span>
    </div>
    
    <div class="recipe-effects">
      ${activeEffects.map(effect => `
        <span class="effect-tag active">${formatEffectName(effect)}</span>
      `).join('')}
    </div>
    
    <div class="recipe-intensity">
      <div class="intensity-bar">
        <div class="intensity-fill" style="width: ${intensityPercent}%"></div>
      </div>
      <span style="color: #888; font-size: 12px;">${intensityPercent}% intensity</span>
    </div>
    
    <p class="recipe-description">${recipe.description || 'No description'}</p>
    
    <div class="recipe-footer">
      <div class="recipe-stats">
        <span>🔥 ${recipe.uses || 0}</span>
        <span>⭐ ${recipe.saves || 0}</span>
      </div>
      
      <div class="recipe-actions">
        <button class="btn-apply" onclick="applyRecipe('${recipe.id}')">Apply</button>
        <button class="btn-save" onclick="saveRecipeToCollection('${recipe.id}')">Save</button>
      </div>
    </div>
  `;
  
  return card;
}

function formatEffectName(effect) {
  const names = {
    wiggle: 'Wiggle',
    pixelFilter: 'Pixel',
    wordSwap: 'Word',
    rotate: 'Rotate',
    colorShift: 'Color',
    wobble: 'Wobble',
    float: 'Float',
    glitch404: '404'
  };
  return names[effect] || effect;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function saveRecipe() {
  const name = document.getElementById('recipeName').value.trim();
  if (!name) {
    alert('Please enter a recipe name');
    return;
  }
  
  const effects = {
    wiggle: document.getElementById('recipeWiggle').checked,
    pixelFilter: document.getElementById('recipePixel').checked,
    wordSwap: document.getElementById('recipeWord').checked,
    rotate: document.getElementById('recipeRotate').checked,
    colorShift: document.getElementById('recipeColor').checked,
    wobble: document.getElementById('recipeWobble').checked,
    float: document.getElementById('recipeFloat').checked,
    glitch404: document.getElementById('recipe404').checked
  };
  
  const intensity = parseInt(document.getElementById('recipeIntensity').value);
  const description = document.getElementById('recipeDescription').value.trim();
  
  // Check if any effects selected
  if (!Object.values(effects).some(v => v)) {
    alert('Please select at least one effect');
    return;
  }
  
  // Check Pro features
  chrome.storage.local.get(['isPro'], (result) => {
    const isPro = result.isPro || false;
    
    if ((effects.wordSwap || effects.glitch404) && !isPro) {
      alert('Word Swap and 404 Pranks are Pro features. Upgrade to use them in recipes.');
      return;
    }
    
    const newRecipe = {
      id: 'user_' + Date.now(),
      name,
      description,
      intensity,
      effects,
      author: 'You',
      uses: 0,
      saves: 0,
      pro: effects.wordSwap || effects.glitch404,
      created: new Date().toISOString().split('T')[0]
    };
    
    userRecipes.push(newRecipe);
    
    chrome.storage.local.set({ userRecipes }, () => {
      alert('Recipe saved!');
      document.getElementById('recipeName').value = '';
      document.getElementById('recipeDescription').value = '';
      document.getElementById('recipeWiggle').checked = false;
      document.getElementById('recipePixel').checked = false;
      document.getElementById('recipeWord').checked = false;
      document.getElementById('recipeRotate').checked = false;
      document.getElementById('recipeColor').checked = false;
      document.getElementById('recipeWobble').checked = false;
      document.getElementById('recipeFloat').checked = false;
      document.getElementById('recipe404').checked = false;
      document.getElementById('recipeIntensity').value = 50;
      document.getElementById('recipeIntensityDisplay').textContent = '50%';
      
      if (currentTab === 'my') {
        loadRecipes('my');
      }
    });
  });
}

// Make functions available globally for onclick handlers
window.applyRecipe = function(recipeId) {
  let recipe;
  
  // Find recipe in defaults or user recipes
  recipe = DEFAULT_RECIPES.find(r => r.id === recipeId);
  if (!recipe) {
    recipe = userRecipes.find(r => r.id === recipeId);
  }
  
  if (!recipe) return;
  
  // Check Pro requirements
  chrome.storage.local.get(['isPro'], (result) => {
    const isPro = result.isPro || false;
    
    if (recipe.pro && !isPro) {
      alert('This recipe requires Pro features. Upgrade to apply it.');
      return;
    }
    
    // Apply recipe settings
    const settings = {
      glitchIntensity: recipe.intensity,
      effects: recipe.effects
    };
    
    chrome.storage.local.set(settings, () => {
      alert(`Applied recipe: ${recipe.name}`);
      
      // Increment use count
      if (recipeId.startsWith('user_')) {
        const userRecipe = userRecipes.find(r => r.id === recipeId);
        if (userRecipe) {
          userRecipe.uses = (userRecipe.uses || 0) + 1;
          chrome.storage.local.set({ userRecipes });
        }
      }
    });
  });
};

window.saveRecipeToCollection = function(recipeId) {
  // In v1, just show a message
  // Future: save to user's collection
  alert('Recipe saved to your collection!');
  
  // Increment saves
  if (recipeId.startsWith('user_')) {
    const userRecipe = userRecipes.find(r => r.id === recipeId);
    if (userRecipe) {
      userRecipe.saves = (userRecipe.saves || 0) + 1;
      chrome.storage.local.set({ userRecipes });
    }
  }
};

function shareCurrentRecipe() {
  // Get current recipe from form
  const name = document.getElementById('recipeName').value.trim();
  if (!name) {
    alert('Create a recipe first');
    return;
  }
  
  const shareText = `Check out my Glitch Garden recipe: ${name}`;
  navigator.clipboard.writeText(shareText).then(() => {
    alert('Recipe description copied to clipboard! Share it on social media 🎉');
  });
}
