// Glitch Garden - Content Script
// Injects playful glitches based on intensity setting

let currentSettings = {
  glitchIntensity: 25,
  effects: {},
  accessibility: {}
};

// Load settings on init
chrome.storage.local.get(['glitchIntensity', 'effects', 'accessibility'], (result) => {
  currentSettings = { ...currentSettings, ...result };
  applyGlitches();
});

// Listen for setting changes
chrome.storage.onChanged.addListener((changes) => {
  let needsUpdate = false;
  
  if (changes.glitchIntensity) {
    currentSettings.glitchIntensity = changes.glitchIntensity.newValue;
    needsUpdate = true;
  }
  
  if (changes.effects) {
    currentSettings.effects = changes.effects.newValue;
    needsUpdate = true;
  }
  
  if (changes.accessibility) {
    currentSettings.accessibility = changes.accessibility.newValue;
    needsUpdate = true;
  }
  
  if (needsUpdate) {
    applyGlitches();
  }
});

function applyGlitches() {
  const intensity = currentSettings.glitchIntensity;
  const effects = currentSettings.effects;
  const accessibility = currentSettings.accessibility;
  
  // Remove existing glitch classes
  document.body.classList.remove(
    'glitch-wiggle', 'glitch-pixel', 'glitch-word', 
    'glitch-rotate', 'glitch-color', 'glitch-wobble',
    'glitch-float', 'glitch-dyslexia', 'glitch-high-contrast',
    'glitch-reduced-motion'
  );
  
  // Apply accessibility first (overrides)
  if (accessibility.dyslexiaFont) {
    document.body.classList.add('glitch-dyslexia');
  }
  
  if (accessibility.highContrast) {
    document.body.classList.add('glitch-high-contrast');
  }
  
  if (accessibility.reducedMotion) {
    document.body.classList.add('glitch-reduced-motion');
  }
  
  // Don't apply playful glitches if intensity is 0 or reduced motion is on
  if (intensity === 0 || accessibility.reducedMotion) return;
  
  // Apply effects based on intensity
  if (effects.wiggle && intensity >= 10) {
    document.body.classList.add('glitch-wiggle');
    applyWiggleEffect(intensity);
  }
  
  if (effects.pixelFilter && intensity >= 25) {
    document.body.classList.add('glitch-pixel');
    applyPixelEffect(intensity);
  }
  
  if (effects.wordSwap && intensity >= 50 && currentSettings.isPro) {
    applyWordSwapEffect();
  }
  
  if (effects.rotate && intensity >= 75) {
    document.body.classList.add('glitch-rotate');
    applyRotateEffect(intensity);
  }
  
  if (effects.colorShift && intensity >= 40) {
    document.body.classList.add('glitch-color');
    applyColorShift(intensity);
  }
  
  if (effects.wobble && intensity >= 30) {
    document.body.classList.add('glitch-wobble');
  }
  
  if (effects.float && intensity >= 20) {
    document.body.classList.add('glitch-float');
  }
  
  // 404 glitch at high intensity (random)
  if (effects.glitch404 && intensity >= 80 && Math.random() < intensity / 200) {
    trigger404Glitch();
  }
}

function applyWiggleEffect(intensity) {
  const wiggleSpeed = Math.max(0.1, intensity / 100);
  document.documentElement.style.setProperty('--glitch-wiggle-speed', `${wiggleSpeed}s`);
}

function applyPixelEffect(intensity) {
  const pixelSize = Math.max(1, Math.floor(intensity / 10));
  document.documentElement.style.setProperty('--glitch-pixel-size', `${pixelSize}px`);
}

function applyWordSwapEffect() {
  // In v1, this is a placeholder
  // Future: integrate with OpenRouter API for AI word swaps
  const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');
  elements.forEach(el => {
    if (el.children.length === 0 && el.textContent.length > 10) {
      // Randomly swap words occasionally
      if (Math.random() < 0.01) {
        const words = el.textContent.split(' ');
        const randomIndex = Math.floor(Math.random() * words.length);
        words[randomIndex] = '✨' + words[randomIndex] + '✨';
        el.textContent = words.join(' ');
      }
    }
  });
}

function applyRotateEffect(intensity) {
  const rotateDeg = (intensity - 75) / 25; // 0-25 degrees
  document.documentElement.style.setProperty('--glitch-rotate', `${rotateDeg}deg`);
}

function applyColorShift(intensity) {
  const hueShift = Math.floor((intensity / 100) * 360);
  document.documentElement.style.setProperty('--glitch-hue-shift', `${hueShift}`);
}

function trigger404Glitch() {
  // Randomly redirect to a funny 404 page for 3 seconds
  const funny404s = [
    'https://http.cat/404',
    'https://http.dog/404',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404'
  ];
  
  const random404 = funny404s[Math.floor(Math.random() * funny404s.length)];
  
  // Store current URL
  const currentUrl = window.location.href;
  
  // Redirect
  window.location.href = random404;
  
  // Return after 3 seconds
  setTimeout(() => {
    window.location.href = currentUrl;
  }, 3000);
}
