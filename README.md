# HCJK Collection - HTML Website

A clean, professional HTML version of the HCJK Collection photography website, ready for immediate deployment.

## 🚀 Quick Start

### Local Development
```bash
# Navigate to the website directory
cd hcjk-html-website

# Start a local server (Python 3)
python3 -m http.server 8080

# Or with Node.js
npx serve .

# Or with PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Deployment
This website is ready to deploy to any static hosting service:

#### GitHub Pages
1. Push this directory to your GitHub repository
2. Go to Settings > Pages
3. Select source as "Deploy from a branch"
4. Choose main branch and / (root) folder
5. Your site will be available at `https://username.github.io/repository-name`

#### Netlify
1. Drag and drop the folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository

#### Vercel
1. Connect your GitHub repository
2. Vercel will automatically detect it's a static site

#### Cloudflare Pages
1. Create a new project
2. Connect your GitHub repository
3. Build command: `echo "No build required"`
4. Output directory: `.`

## 📁 Project Structure

```
hcjk-html-website/
├── index.html              # Homepage
├── portfolio.html          # Portfolio gallery
├── about.html              # About page
├── contact.html            # Contact form
├── booking.html            # Booking and pricing
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── 404.html               # Error page
├── styles.css              # Consolidated stylesheet
├── scripts.js              # Consolidated JavaScript
├── service-worker.js       # PWA service worker
├── site.webmanifest        # PWA manifest
├── robots.txt              # SEO robots file
└── assets/
    └── images/             # All image assets
        ├── *.webp          # Portfolio images
        ├── *.png           # Logos and icons
        └── *.ico           # Favicon files
```

## 🎨 Features

- **Responsive Design**: Works perfectly on all devices
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **PWA Ready**: Service worker and manifest included
- **Fast Loading**: Optimized images and minimal dependencies
- **Accessibility**: ARIA labels and semantic markup
- **Contact Forms**: Ready to integrate with Formspree or similar services
- **Gallery**: Lightbox functionality for portfolio images

## ⚙️ Configuration

### Google Tag Manager
Update the GTM ID in each HTML file:
```html
https://www.googletagmanager.com/gtm.js?id=GTM-T3NKKV8P
```

### Contact Forms
Update the Formspree endpoint in contact.html and booking.html:
```html
action="https://formspree.io/f/your-form-id"
```

### Social Media Links
Update social media links in the footer and contact sections.

## 🖼️ Images

All images are optimized and stored in `assets/images/`. The website uses modern `.webp` format for better performance with fallbacks.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --color-primary: #1a1a1a;
    --color-secondary: #722f37;
    --color-accent: #f5f5dc;
}
```

### Fonts
Google Fonts are loaded from:
- Playfair Display (headings)
- Lato (body text)
- Great Vibes (decorative)

### Content
All text content can be edited directly in the HTML files.

## 📝 License

© 2024 HCJK Collection. All rights reserved.

## 🤝 Support

For questions about this website or to report issues, please contact HCJK Collection.