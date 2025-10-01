# Icon Files Setup Guide

## Required Icon Files

To complete the SEO setup, you need to create the following icon files and place them in the `/public/` directory:

### 1. favicon.ico (Already Exists ✅)
- **Size**: 16x16, 32x32, 48x48 (multi-size ICO)
- **Location**: `/public/favicon.ico`
- **Usage**: Browser tab icon

### 2. icon-192.png (Required)
- **Size**: 192x192 pixels
- **Format**: PNG with transparency
- **Location**: `/public/icon-192.png`
- **Usage**: Android home screen, PWA icon

### 3. icon-512.png (Required)
- **Size**: 512x512 pixels
- **Format**: PNG with transparency
- **Location**: `/public/icon-512.png`
- **Usage**: Android splash screen, PWA icon

### 4. apple-icon.png (Required)
- **Size**: 180x180 pixels
- **Format**: PNG (no transparency needed for Apple)
- **Location**: `/public/apple-icon.png`
- **Usage**: iOS home screen icon

### 5. og-default.png (Required)
- **Size**: 1200x630 pixels
- **Format**: PNG or JPG
- **Location**: `/public/og-default.png`
- **Usage**: Social media sharing fallback (Open Graph)
- **Content**: Should include your logo and tagline

### 6. logo.png (Required)
- **Size**: At least 600x60 pixels (maintain aspect ratio)
- **Format**: PNG with transparency
- **Location**: `/public/logo.png`
- **Usage**: Structured data (Schema.org), email templates

## Quick Creation Guide

### Using Design Tools

#### Option 1: Figma/Adobe Illustrator
1. Create your logo/brand icon
2. Export at the required sizes above
3. Ensure transparent backgrounds (except apple-icon)
4. Use your brand colors

#### Option 2: Online Icon Generator
Use tools like:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)
- [App Icon Generator](https://www.appicon.co/)

Upload your logo and download all sizes.

#### Option 3: Command Line (ImageMagick)
```bash
# Install ImageMagick first
brew install imagemagick  # macOS
apt-get install imagemagick  # Linux

# Convert your logo to different sizes
convert your-logo.png -resize 192x192 icon-192.png
convert your-logo.png -resize 512x512 icon-512.png
convert your-logo.png -resize 180x180 apple-icon.png
convert your-logo.png -resize 1200x630 og-default.png
```

## Recommended Design Specs

### Color Scheme
Use occurs.org brand colors:
- Primary: Black (#000000)
- Accent: Red (#DC2626 or similar)
- Background: White (#FFFFFF)

### Icon Design Tips
1. **Simple**: Icons should be recognizable at small sizes
2. **Centered**: Leave padding around edges (safe zone: 10%)
3. **Contrast**: Ensure good contrast for visibility
4. **Maskable**: For PWA, important content should be in center 80%
5. **Brand Consistent**: Match your website's visual identity

### Open Graph Image (og-default.png)
Should include:
- occurs.org logo/wordmark
- Tagline: "The Digital Chronicle"
- Background that matches your brand
- Text should be readable at thumbnail size

## Verification

After adding icons, verify they work:

1. **Favicon**: Check browser tab
2. **PWA Icons**: 
   - Chrome DevTools > Application > Manifest
   - Look for "Icons" section
3. **Open Graph**: 
   - Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
4. **Apple Icon**: 
   - Test on iOS device
   - Add to home screen

## Example Structure

```
public/
├── favicon.ico          ✅ (Already exists)
├── icon-192.png         ⚠️ (Need to create)
├── icon-512.png         ⚠️ (Need to create)
├── apple-icon.png       ⚠️ (Need to create)
├── og-default.png       ⚠️ (Need to create)
├── logo.png             ⚠️ (Need to create)
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

## Temporary Fallback

Until you create these files, the website will:
- Use existing favicon.ico for browser tabs
- Show default browser icons for PWA
- Use article images for Open Graph (or show broken image if none)

The website will function, but SEO and user experience will be improved once proper icons are in place.

## Need Help?

If you need assistance creating these icons:
1. Hire a designer on Fiverr/Upwork
2. Use AI tools like DALL-E or Midjourney
3. Use free online generators
4. Ask your team's designer

---

**Priority**: High - These icons improve branding, SEO, and user experience.

