# 🌱 Glitch Garden

**Make the web playful again.** Glitch Garden adds delightful, adjustable "glitches" to your browsing experience while growing a digital garden as you browse.

![Glitch Garden Logo](store-assets/logo-300.png)

## What It Does

Glitch Garden transforms ordinary websites into playful, interactive experiences. Think of it as a sandbox for web playfulness — you control how much "glitch" you want, from subtle animations to full chaos mode.

### Core Features

- **🎮 Glitch Intensity Slider** — Turn it up for more chaos, down for subtle effects
- **🌱 Living Garden** — Your garden grows flowers based on how much you browse with glitches on
- **📖 Community Recipes** — Save and share your favorite glitch combinations
- **🎨 8 Playful Effects** — Wiggle, pixel filters, word swaps, rotation, color shifts, wobble, float, and 404 pranks
- **♿ Accessibility First** — Dyslexia font, high contrast, and reduced motion modes built in
- **🔒 Privacy Focused** — All data stored locally. No tracking. No cloud. No login required.

## How to Install

### Chrome / Edge / Brave
1. Download the latest `glitch-garden.zip` from [Releases](https://github.com/yourusername/glitch-garden/releases)
2. Unzip the file
3. Go to `chrome://extensions`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked"
6. Select the unzipped folder

### Firefox
1. Download the latest `glitch-garden.xpi` from [Releases](https://github.com/yourusername/glitch-garden/releases)
2. Go to `about:addons`
3. Click the gear icon → "Install Add-on From File"
4. Select the downloaded `.xpi` file

## Features in Detail

### Glitch Effects
| Effect | Minimum Intensity | Free/Pro |
|--------|------------------|----------|
| Wiggle | 10% | Free |
| Float | 20% | Free |
| Pixel Filter | 25% | Free |
| Wobble | 30% | Free |
| Color Shift | 40% | Free |
| Word Swap | 50% | Pro |
| Rotate | 75% | Free |
| 404 Pranks | 80% | Pro |

### Garden System
- Every 30 minutes of browsing with glitches on = 1 new flower
- Different glitch types grow different flower varieties
- Water your garden daily for bonus growth
- Harvest flowers for special seeds

### Community Recipes
- Save your favorite effect combinations
- Browse trending recipes from other users
- Apply any recipe with one click
- Create and share your own recipes

## Permissions Explained

| Permission | Why We Need It |
|------------|----------------|
| `storage` | Save your settings, garden data, and recipes locally |
| `tabs` | Track active tab for playtime calculation |
| `activeTab` | Apply glitch effects to the current page |
| `scripting` | Inject glitch effects into web pages |
| `<all_urls>` | Apply effects to any website you visit |
| `alarms` | Auto-save recipes and garden data periodically |

## File Structure
glitch-garden/
├── manifest.json # Extension config
├── background.js # Service worker
├── content.js # Page glitch injector
├── popup/ # Main popup interface
│ ├── popup.html
│ ├── popup.js
│ └── popup.css
├── options/ # Settings page
│ ├── options.html
│ ├── options.js
│ └── options.css
├── newtab/ # Garden visualization
│ ├── newtab.html
│ ├── newtab.js
│ └── newtab.css
├── recipes/ # Community recipes
│ ├── recipes.html
│ ├── recipes.js
│ └── recipes.css
└── icons/ # Extension icons
├── icon16.png
├── icon48.png
└── icon128.png

text

## Roadmap

### Version 1.0 (Current)
- ✅ Core glitch effects (wiggle, pixel, color, rotate, wobble, float)
- ✅ Garden visualization
- ✅ Recipe saving
- ✅ Accessibility options

### Version 1.1 (Next)
- 🚧 AI-powered word swaps (OpenRouter integration)
- 🚧 Recipe sharing via URL
- 🚧 More garden themes
- 🚧 Export/import garden

### Version 1.2 (Planned)
- 🚀 Community recipe voting
- 🚀 Garden sharing
- 🚀 Custom effect creation
- 🚀 Dark/light theme toggle

## Support This Project

If you find Glitch Garden useful, consider buying me a coffee!

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/yourusername)

## License

MIT License — feel free to modify, share, and remix!

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
