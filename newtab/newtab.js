// Glitch Garden - New Tab Garden Page

document.addEventListener('DOMContentLoaded', () => {
  loadGarden();
  setupEventListeners();
  loadActivity();
});

function loadGarden() {
  chrome.storage.local.get(['garden', 'gardenTheme', 'showFlowerNames'], (result) => {
    const garden = result.garden || { flowers: [], totalPlayTime: 0, lastWatered: Date.now() };
    const theme = result.gardenTheme || 'default';
    const showNames = result.showFlowerNames !== false;
    
    // Update stats
    document.getElementById('playTime').textContent = formatPlayTime(garden.totalPlayTime || 0);
    document.getElementById('flowerCount').textContent = (garden.flowers || []).length;
    document.getElementById('lastWatered').textContent = formatDate(garden.lastWatered || Date.now());
    
    // Render flowers
    renderGarden(garden.flowers || [], theme, showNames);
    
    // Update flower type counts
    updateFlowerTypeCounts(garden.flowers || []);
    
    // Update glitch type counts
    updateGlitchTypeCounts(garden.flowers || []);
    
    // Update achievements
    updateAchievements(garden);
  });
}

function renderGarden(flowers, theme, showNames) {
  const grid = document.getElementById('gardenGrid');
  grid.innerHTML = '';
  
  if (flowers.length === 0) {
    grid.innerHTML = `
      <div class="empty-garden" style="grid-column: 1/-1; text-align: center; padding: 60px;">
        <span style="font-size: 64px;">🌱</span>
        <p style="color: #888; margin-top: 20px;">Your garden is empty. Browse the web with glitches on to grow flowers!</p>
      </div>
    `;
    return;
  }
  
  // Sort flowers by last watered (most recent first)
  const sortedFlowers = [...flowers].sort((a, b) => b.watered - a.watered);
  
  sortedFlowers.forEach((flower, index) => {
    const flowerEl = document.createElement('div');
    flowerEl.className = 'flower-item';
    flowerEl.dataset.id = flower.id;
    
    // Choose emoji based on type
    let emoji = '🌸';
    switch(flower.type) {
      case 'daisy': emoji = '🌼'; break;
      case 'rose': emoji = '🌹'; break;
      case 'tulip': emoji = '🌷'; break;
      case 'sunflower': emoji = '🌻'; break;
      case 'cactus': emoji = '🌵'; break;
    }
    
    // Apply theme-based styling
    let themeStyle = '';
    switch(theme) {
      case 'desert':
        themeStyle = 'filter: hue-rotate(30deg) saturate(150%);';
        break;
      case 'rainforest':
        themeStyle = 'filter: hue-rotate(-20deg) brightness(120%);';
        break;
      case 'moonlight':
        themeStyle = 'filter: hue-rotate(180deg) brightness(80%);';
        break;
      case 'cosmic':
        themeStyle = 'filter: hue-rotate(90deg) saturate(200%); animation: twinkle 2s infinite;';
        break;
    }
    
    flowerEl.innerHTML = `
      <span class="flower-emoji" style="${themeStyle}">${emoji}</span>
      ${showNames ? `<span class="flower-name">${flower.type || 'Wildflower'}</span>` : ''}
      <span class="flower-glitch">${flower.glitchType || 'wild'}</span>
      <span class="flower-watered" title="Last watered">💧 ${formatTimeAgo(flower.watered)}</span>
    `;
    
    flowerEl.addEventListener('click', () => showFlowerDetails(flower));
    
    grid.appendChild(flowerEl);
  });
}

function updateFlowerTypeCounts(flowers) {
  const counts = {
    daisy: 0,
    rose: 0,
    tulip: 0,
    sunflower: 0,
    cactus: 0
  };
  
  flowers.forEach(flower => {
    if (counts.hasOwnProperty(flower.type)) {
      counts[flower.type]++;
    }
  });
  
  document.getElementById('daisyCount').textContent = counts.daisy;
  document.getElementById('roseCount').textContent = counts.rose;
  document.getElementById('tulipCount').textContent = counts.tulip;
  document.getElementById('sunflowerCount').textContent = counts.sunflower;
  document.getElementById('cactusCount').textContent = counts.cactus;
}

function updateGlitchTypeCounts(flowers) {
  const counts = {
    wiggle: 0,
    pixel: 0,
    word: 0,
    rotate: 0,
    color: 0
  };
  
  flowers.forEach(flower => {
    if (counts.hasOwnProperty(flower.glitchType)) {
      counts[flower.glitchType]++;
    }
  });
  
  document.getElementById('wiggleCount').textContent = counts.wiggle;
  document.getElementById('pixelCount').textContent = counts.pixel;
  document.getElementById('wordCount').textContent = counts.word;
  document.getElementById('rotateCount').textContent = counts.rotate;
  document.getElementById('colorCount').textContent = counts.color;
}

function updateAchievements(garden) {
  const flowerCount = (garden.flowers || []).length;
  const playTime = garden.totalPlayTime || 0;
  
  const achievements = {
    novice: flowerCount >= 10,
    greenThumb: flowerCount >= 50,
    master: flowerCount >= 100,
    addict: playTime >= 60
  };
  
  const achievementElements = document.querySelectorAll('.achievements li');
  
  if (achievements.novice) {
    achievementElements[0].classList.add('unlocked');
    achievementElements[0].classList.remove('locked');
    achievementElements[0].innerHTML = '✅ Novice Gardener (10 flowers)';
  }
  
  if (achievements.greenThumb) {
    achievementElements[1].classList.add('unlocked');
    achievementElements[1].classList.remove('locked');
    achievementElements[1].innerHTML = '✅ Green Thumb (50 flowers)';
  }
  
  if (achievements.master) {
    achievementElements[2].classList.add('unlocked');
    achievementElements[2].classList.remove('locked');
    achievementElements[2].innerHTML = '✅ Garden Master (100 flowers)';
  }
  
  if (achievements.addict) {
    achievementElements[3].classList.add('unlocked');
    achievementElements[3].classList.remove('locked');
    achievementElements[3].innerHTML = '✅ Glitch Addict (1 hour playtime)';
  }
}

function setupEventListeners() {
  // Water garden button
  document.getElementById('waterBtn').addEventListener('click', waterGarden);
  
  // Scatter seeds button
  document.getElementById('scatterBtn').addEventListener('click', scatterSeeds);
  
  // Harvest button
  document.getElementById('harvestBtn').addEventListener('click', harvestGarden);
  
  // Navigation links
  document.getElementById('settingsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  
  document.getElementById('recipesLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('recipes/recipes.html') });
  });
  
  document.getElementById('shareLink').addEventListener('click', (e) => {
    e.preventDefault();
    shareGarden();
  });
}

function waterGarden() {
  chrome.storage.local.get(['garden'], (result) => {
    const garden = result.garden || { flowers: [] };
    
    garden.lastWatered = Date.now();
    
    // Add a new flower with 20% chance
    if (Math.random() < 0.2) {
      const newFlower = {
        id: Date.now(),
        type: ['daisy', 'rose', 'tulip', 'sunflower', 'cactus'][Math.floor(Math.random() * 5)],
        planted: Date.now(),
        watered: Date.now(),
        glitchType: ['wiggle', 'pixel', 'word', 'rotate', 'color'][Math.floor(Math.random() * 5)]
      };
      
      garden.flowers.push(newFlower);
      
      // Add activity
      addActivity('🌱', 'A new flower sprouted!', 'just now');
    }
    
    chrome.storage.local.set({ garden }, () => {
      loadGarden();
    });
  });
}

function scatterSeeds() {
  chrome.storage.local.get(['garden', 'isPro'], (result) => {
    const garden = result.garden || { flowers: [] };
    const isPro = result.isPro || false;
    
    // Free users: 1 seed
    // Pro users: 3 seeds
    const seedCount = isPro ? 3 : 1;
    
    for (let i = 0; i < seedCount; i++) {
      if (Math.random() < 0.5) { // 50% chance per seed
        const newFlower = {
          id: Date.now() + i,
          type: ['daisy', 'rose', 'tulip', 'sunflower', 'cactus'][Math.floor(Math.random() * 5)],
          planted: Date.now(),
          watered: Date.now(),
          glitchType: ['wiggle', 'pixel', 'word', 'rotate', 'color'][Math.floor(Math.random() * 5)]
        };
        
        garden.flowers.push(newFlower);
      }
    }
    
    chrome.storage.local.set({ garden }, () => {
      loadGarden();
      addActivity('🌱', `Scattered ${seedCount} seeds...`, 'just now');
    });
  });
}

function harvestGarden() {
  chrome.storage.local.get(['garden'], (result) => {
    const garden = result.garden || { flowers: [] };
    
    // Harvest 10% of flowers
    const harvestCount = Math.max(1, Math.floor(garden.flowers.length * 0.1));
    
    // Remove random flowers
    for (let i = 0; i < harvestCount; i++) {
      if (garden.flowers.length > 0) {
        const randomIndex = Math.floor(Math.random() * garden.flowers.length);
        garden.flowers.splice(randomIndex, 1);
      }
    }
    
    chrome.storage.local.set({ garden }, () => {
      loadGarden();
      addActivity('✂️', `Harvested ${harvestCount} flowers`, 'just now');
    });
  });
}

function shareGarden() {
  chrome.storage.local.get(['garden'], (result) => {
    const garden = result.garden || { flowers: [] };
    const flowerCount = garden.flowers.length;
    const playTime = Math.floor((garden.totalPlayTime || 0) / 60);
    
    const shareText = `🌱 My Glitch Garden has ${flowerCount} flowers after ${playTime} hours of play!`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Garden stats copied to clipboard!');
    });
  });
}

function loadActivity() {
  // Load recent activity from storage
  chrome.storage.local.get(['activity'], (result) => {
    const activities = result.activity || [];
    displayActivities(activities.slice(-10));
  });
}

function addActivity(icon, text, time) {
  chrome.storage.local.get(['activity'], (result) => {
    const activities = result.activity || [];
    
    activities.push({
      icon,
      text,
      time,
      timestamp: Date.now()
    });
    
    // Keep last 50 activities
    if (activities.length > 50) {
      activities.shift();
    }
    
    chrome.storage.local.set({ activity: activities }, () => {
      displayActivities(activities.slice(-10));
    });
  });
}

function displayActivities(activities) {
  const feed = document.getElementById('activityFeed');
  feed.innerHTML = '';
  
  if (activities.length === 0) {
    feed.innerHTML = '<p style="color: #666; text-align: center;">No activity yet</p>';
    return;
  }
  
  activities.reverse().forEach(activity => {
    const activityEl = document.createElement('div');
    activityEl.className = 'activity-item';
    activityEl.innerHTML = `
      <span class="activity-icon">${activity.icon}</span>
      <span class="activity-text">${activity.text}</span>
      <span class="activity-time">${activity.time}</span>
    `;
    feed.appendChild(activityEl);
  });
}

function formatPlayTime(minutes) {
  if (minutes < 60) {
    return `${Math.floor(minutes)} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString();
}

function formatTimeAgo(timestamp) {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function showFlowerDetails(flower) {
  // Simple alert for now
  // Future: detailed modal
  alert(`
    🌸 ${flower.type || 'Wildflower'}
    🌱 Planted: ${new Date(flower.planted).toLocaleString()}
    💧 Last Watered: ${formatTimeAgo(flower.watered)}
    🌀 Glitch Type: ${flower.glitchType || 'wild'}
  `);
}
