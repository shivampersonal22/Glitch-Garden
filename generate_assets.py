#!/usr/bin/env python3
"""
Glitch Garden - Store Assets Generator
Generates all required images for Chrome Web Store and Firefox Add-ons
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import random

# Configuration
OUTPUT_DIR = "store-assets"
COLORS = {
    "bg": "#1a1a1a",
    "accent": "#6ee7b7",
    "text": "#e0e0e0",
    "dark": "#252525"
}

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_gradient_background(width, height, color1, color2):
    """Create a gradient background"""
    image = Image.new("RGB", (width, height), color1)
    draw = ImageDraw.Draw(image)
    
    for i in range(height):
        ratio = i / height
        r = int((1 - ratio) * int(color1[1:3], 16) + ratio * int(color2[1:3], 16))
        g = int((1 - ratio) * int(color1[3:5], 16) + ratio * int(color2[3:5], 16))
        b = int((1 - ratio) * int(color1[5:7], 16) + ratio * int(color2[5:7], 16))
        draw.line([(0, i), (width, i)], fill=(r, g, b))
    
    return image

def add_noise(image, intensity=10):
    """Add noise for glitch effect"""
    from PIL import ImageChops
    import random
    
    width, height = image.size
    noise = Image.new("RGB", (width, height))
    noise_draw = ImageDraw.Draw(noise)
    
    for i in range(0, width, 2):
        for j in range(0, height, 2):
            if random.random() < 0.1:
                color = random.choice([
                    COLORS["accent"],
                    "#ff0000",
                    "#00ff00",
                    "#0000ff"
                ])
                noise_draw.rectangle([i, j, i+2, j+2], fill=color)
    
    return ImageChops.screen(image, noise)

def create_logo():
    """Create 300x300 logo"""
    print("Generating logo...")
    
    img = Image.new("RGB", (300, 300), COLORS["bg"])
    draw = ImageDraw.Draw(img)
    
    # Draw garden elements
    # Ground
    draw.rectangle([0, 200, 300, 300], fill="#2a2a2a")
    
    # Flowers
    flower_positions = [(80, 180), (150, 150), (220, 170)]
    for x, y in flower_positions:
        # Stem
        draw.line([(x, y), (x, y+40)], fill="#4ade80", width=3)
        # Flower head
        draw.ellipse([x-15, y-30, x+15, y], fill=COLORS["accent"])
        # Center
        draw.ellipse([x-5, y-20, x+5, y-10], fill="#fbbf24")
    
    # Add glitch text effect
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf", 36)
    except:
        font = ImageFont.load_default()
    
    # Shadow text
    draw.text((55, 35), "GLITCH", fill="#333333", font=font)
    draw.text((57, 37), "GLITCH", fill="#4ade80", font=font)
    
    draw.text((95, 75), "GARDEN", fill="#333333", font=font)
    draw.text((97, 77), "GARDEN", fill=COLORS["accent"], font=font)
    
    # Add noise
    img = add_noise(img, 5)
    
    img.save(f"{OUTPUT_DIR}/logo-300.png")
    print(f"✅ Saved: {OUTPUT_DIR}/logo-300.png")

def create_small_tile():
    """Create 440x280 small promo tile"""
    print("Generating small tile...")
    
    img = create_gradient_background(440, 280, COLORS["bg"], "#2d2d2d")
    draw = ImageDraw.Draw(img)
    
    # Add glitch lines
    for i in range(0, 280, 20):
        if random.random() < 0.3:
            draw.line([(0, i), (440, i)], fill=COLORS["accent"], width=1)
    
    # Add flowers
    for i in range(3):
        x = 100 + i * 120
        y = 150
        # Stem
        draw.line([(x, y), (x, y+40)], fill="#4ade80", width=2)
        # Flower
        draw.ellipse([x-15, y-25, x+15, y+5], fill=COLORS["accent"])
    
    # Add text
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf", 32)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", 16)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    draw.text((30, 30), "Make the web", fill="#888888", font=font_small)
    draw.text((30, 50), "playful again", fill=COLORS["accent"], font=font_large)
    
    img = add_noise(img)
    img.save(f"{OUTPUT_DIR}/tile-small-440x280.png")
    print(f"✅ Saved: {OUTPUT_DIR}/tile-small-440x280.png")

def create_large_tile():
    """Create 1400x560 large promo tile"""
    print("Generating large tile...")
    
    img = create_gradient_background(1400, 560, COLORS["bg"], "#2d2d2d")
    draw = ImageDraw.Draw(img)
    
    # Add glitch patterns
    for i in range(0, 560, 10):
        if random.random() < 0.1:
            offset = random.randint(-5, 5)
            draw.line([(0, i+offset), (1400, i+offset)], fill=COLORS["accent"], width=1)
    
    # Draw garden
    for i in range(5):
        x = 200 + i * 250
        # Flower group
        for j in range(3):
            fx = x + j * 30
            fy = 300 + j * 20
            draw.ellipse([fx-20, fy-30, fx+20, fy], fill=COLORS["accent"])
            draw.line([(fx, fy), (fx, fy+50)], fill="#4ade80", width=3)
    
    # Main text
    try:
        font_huge = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf", 72)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", 24)
    except:
        font_huge = ImageFont.load_default()
        font_medium = ImageFont.load_default()
    
    draw.text((800, 150), "Glitch", fill="#888888", font=font_huge)
    draw.text((800, 220), "Garden", fill=COLORS["accent"], font=font_huge)
    
    features = [
        "✨ Adjustable glitch intensity",
        "🌱 Your garden grows as you browse",
        "📖 Community recipes",
        "🎨 8+ playful effects"
    ]
    
    y = 320
    for feature in features:
        draw.text((800, y), feature, fill="#cccccc", font=font_medium)
        y += 40
    
    img.save(f"{OUTPUT_DIR}/tile-large-1400x560.png")
    print(f"✅ Saved: {OUTPUT_DIR}/tile-large-1400x560.png")

def create_screenshots():
    """Create 3 screenshots at 1280x800"""
    print("Generating screenshots...")
    
    # Screenshot 1: Popup
    img1 = create_gradient_background(1280, 800, COLORS["bg"], "#2d2d2d")
    draw = ImageDraw.Draw(img1)
    
    # Draw mock popup
    draw.rectangle([400, 200, 880, 600], fill=COLORS["dark"], outline=COLORS["accent"], width=2)
    draw.text((500, 250), "🌱 Glitch Garden", fill=COLORS["accent"], font=ImageFont.load_default())
    draw.text((500, 300), "Intensity: 50%", fill="#ffffff", font=ImageFont.load_default())
    draw.text((500, 350), "✓ Wiggle", fill=COLORS["accent"], font=ImageFont.load_default())
    draw.text((500, 380), "✓ Pixel", fill=COLORS["accent"], font=ImageFont.load_default())
    draw.text((500, 410), "✓ Float", fill=COLORS["accent"], font=ImageFont.load_default())
    
    img1.save(f"{OUTPUT_DIR}/screenshot-1-popup-1280x800.png")
    print(f"✅ Saved: {OUTPUT_DIR}/screenshot-1-popup-1280x800.png")
    
    # Screenshot 2: Garden
    img2 = create_gradient_background(1280, 800, COLORS["bg"], "#2d2d2d")
    draw = ImageDraw.Draw(img2)
    
    # Draw garden grid
    for i in range(3):
        for j in range(3):
            x = 300 + j * 200
            y = 150 + i * 150
            draw.ellipse([x-30, y-40, x+30, y+10], fill=COLORS["accent"])
            draw.line([(x, y), (x, y+50)], fill="#4ade80", width=3)
    
    draw.text((500, 600), "Your garden grows as you browse", fill="#ffffff", font=ImageFont.load_default())
    
    img2.save(f"{OUTPUT_DIR}/screenshot-2-garden-1280x800.png")
    print(f"✅ Saved: {OUTPUT_DIR}/screenshot-2-garden-1280x800.png")
    
    # Screenshot 3: Recipes
    img3 = create_gradient_background(1280, 800, COLORS["bg"], "#2d2d2d")
    draw = ImageDraw.Draw(img3)
    
    # Draw recipe cards
    recipes = ["Chaos Mode", "Relax Mode", "Focus Mode"]
    for i, recipe in enumerate(recipes):
        x = 200 + i * 300
        draw.rectangle([x, 200, x+250, 400], fill=COLORS["dark"], outline=COLORS["accent"], width=2)
        draw.text((x+30, 250), recipe, fill=COLORS["accent"], font=ImageFont.load_default())
        draw.text((x+30, 300), "🔥 1.2k uses", fill="#ffffff", font=ImageFont.load_default())
    
    draw.text((500, 500), "Community recipes — apply with one click", fill="#ffffff", font=ImageFont.load_default())
    
    img3.save(f"{OUTPUT_DIR}/screenshot-3-recipes-1280x800.png")
    print(f"✅ Saved: {OUTPUT_DIR}/screenshot-3-recipes-1280x800.png")

def create_icons():
    """Create extension icons (16, 48, 128)"""
    print("Generating icons...")
    
    sizes = [16, 48, 128]
    
    for size in sizes:
        img = Image.new("RGB", (size, size), COLORS["bg"])
        draw = ImageDraw.Draw(img)
        
        # Simple flower icon
        center = size // 2
        radius = size // 3
        
        # Flower petals
        draw.ellipse([center-radius, center-radius-2, center+radius, center+radius-2], fill=COLORS["accent"])
        draw.ellipse([center-radius-2, center-radius, center+radius-2, center+radius], fill=COLORS["accent"])
        draw.ellipse([center-radius+2, center-radius, center+radius+2, center+radius], fill=COLORS["accent"])
        
        # Center
        draw.ellipse([center-3, center-3, center+3, center+3], fill="#fbbf24")
        
        # Stem
        draw.line([(center, center+2), (center, center+radius)], fill="#4ade80", width=max(1, size//32))
        
        img.save(f"icons/icon{size}.png")
        print(f"✅ Saved: icons/icon{size}.png")

if __name__ == "__main__":
    print("\n🎨 Glitch Garden - Asset Generator\n")
    
    # Create icons first (needed for extension)
    os.makedirs("icons", exist_ok=True)
    create_icons()
    
    # Create store assets
    create_logo()
    create_small_tile()
    create_large_tile()
    create_screenshots()
    
    print("\n✅ All assets generated successfully!")
    print(f"📁 Check the '{OUTPUT_DIR}' folder and 'icons' folder")
