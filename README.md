# 🚀 Ismail Sabbar - Portfolio

[![Portfolio](https://img.shields.io/badge/Portfolio-Live-6C63FF?style=for-the-badge&logo=google-chrome&logoColor=white)](https://imsabbar.com)
[![GitHub](https://img.shields.io/badge/GitHub-imsabbar-181717?style=for-the-badge&logo=github)](https://github.com/imsabbar)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/imsabbar)

Modern, responsive portfolio website showcasing full-stack development and automation engineering expertise. Built with PHP, featuring multilingual support (EN/FR/AR), dark mode, smooth animations, and optimized performance.

---

## ✨ Features

### 🎨 **Design & UX**
- **Multilingual Support** - Full translations in English, French, Arabic with RTL support
- **Dark/Light Mode** - Seamless theme switching with persistent preferences
- **Fully Responsive** - Optimized for all devices (360px - 4K)
- **Smooth Animations** - Intersection Observer API & CSS transforms
- **Glassmorphism UI** - Modern backdrop-filter effects
- **Loading Screen** - Professional animated loader with progress

### 🔧 **Technical Highlights**
- **Security First** - CSRF protection, reCAPTCHA v3, input validation, prepared statements
- **Performance Optimized** - 66% page weight reduction, lazy loading (29 images)
- **SEO Ready** - Semantic HTML, meta tags, sitemap.xml, robots.txt
- **Modern Stack** - PHP 7.4+, ES6+, CSS Grid/Flexbox
- **Font Optimization** - Kaushan Script + Poppins (async loading)
- **Custom Error Pages** - Professional 404 & 500 error pages

### 📦 **Sections**
1. **Hero** - Animated typewriter effect with call-to-action
2. **About** - Profile, highlights, experience stats (10+ years)
3. **Services** - 9 core services in responsive grid
4. **Skills** - Animated progress bars (20+ technologies)
5. **Portfolio** - Filterable project showcase
6. **Contact** - AJAX form with validation & status messages

---

## 🛠️ Tech Stack

### **Backend**
- PHP 7.4+ (Session management, form handling)
- Composer (Dependency management)
- PDO (Secure database queries)
- Dotenv (Environment configuration)

### **Frontend**
- HTML5 (Semantic markup)
- CSS3 (Grid, Flexbox, Variables, Animations)
- JavaScript ES6+ (Modules, Intersection Observer, AJAX)
- Font Awesome 6.4+ (Icons)

### **Tools & Libraries**
- jQuery 3.6+ (DOM manipulation)
- Intersection Observer API (Scroll animations)
- Local Storage (Theme persistence)

---

## 📂 Project Structure

```
imsabbarPortfolio/
├── index.php                 # Main application entry
├── .htaccess                # Apache security & HTTPS config
├── .gitignore               # Git ignore rules
├── .env.example             # Environment template
├── 404.html                 # Custom 404 error page
├── 500.html                 # Custom 500 error page
├── composer.json            # PHP dependencies
├── sitemap.xml              # SEO sitemap
├── robots.txt               # Search engine rules
├── assets/
│   ├── css/
│   │   ├── style.css        # Global styles & theme
│   │   ├── about.css        # About section
│   │   ├── contact.css      # Contact form
│   │   ├── header.css       # Navigation
│   │   ├── loading.css      # Loader animation
│   │   ├── portfolio.css    # Portfolio grid
│   │   ├── services.css     # Services cards
│   │   ├── skills.css       # Skills animations
│   │   └── scroll.css       # Scroll effects
│   ├── js/
│   │   ├── script.js        # Core functionality
│   │   ├── languageSwitcher.js # Multilingual support (EN/FR/AR)
│   │   ├── recaptcha.js     # reCAPTCHA v3 integration
│   │   ├── skillsAnimation.js  # Skills section
│   │   ├── loading.js       # Loader controller
│   │   ├── scrollAnimation.js  # Scroll observers
│   │   └── textAnimation.js # Typewriter effect
│   ├── images/              # Optimized assets
│   ├── files/               # Downloadable resources
│   └── includes/
│       └── helpers.inc.php  # PHP utility functions
└── vendor/                  # Composer packages
```

---

## 🚀 Quick Start

### **Prerequisites**
- PHP 7.4 or higher
- Composer
- Web server (Apache/Nginx/XAMPP)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/imsabbar/imsabbarPortfolio.git
cd imsabbarPortfolio
```

2. **Install dependencies**
```bash
composer install
```

3. **Configure environment**
```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local with your settings
# Add database credentials, SMTP settings, etc.
```

4. **Start development server**
```bash
# Using PHP built-in server
php -S localhost:8000

# Or use XAMPP/WAMP and navigate to
# http://localhost/imsabbarPortfolio
```

5. **Access the site**
- Local: `http://localhost:8000`
- XAMPP: `http://localhost/imsabbarPortfolio`

---

## 🔒 Security Features

✅ **CSRF Protection** - Token-based form validation  
✅ **SQL Injection Prevention** - PDO prepared statements  
✅ **Input Validation** - Server-side sanitization  
✅ **XSS Protection** - Output escaping  
✅ **reCAPTCHA v3** - Google spam protection integration
✅ **Spam Detection** - Honeypot & rate limiting  
✅ **Secure Headers** - Apache .htaccess security headers
✅ **Environment Variables** - Sensitive data protection (.env)

---

## 📱 Responsive Breakpoints

| Device | Width | Optimizations |
|--------|-------|---------------|
| Mobile | 360px - 480px | Single column, touch targets |
| Tablet | 481px - 768px | 2-column grids, compact nav |
| Laptop | 769px - 1024px | 3-column grids, full features |
| Desktop | 1025px - 1440px | Optimized spacing |
| Large | 1441px+ | Max-width containers |

---

## 🎨 Theme System

### **Colors**
```css
/* Light Mode */
--primary-color: #6C63FF;
--bg-color: #FFFFFF;
--text-color: #2D3748;

/* Dark Mode */
--primary-color: #8E85FF;
--bg-color: #1A202C;
--text-color: #F7FAFC;
```

### **Toggle Implementation**
- Button in header (desktop & mobile)
- Local storage persistence
- Smooth transition (0.3s cubic-bezier)
- SVG icon animation

---

## ⚡ Performance Optimizations

### **Achieved Improvements**
- 📉 **66% page weight reduction** (optimized images)
- ⚡ **56% faster load time** (async CSS, lazy loading)
- 🖼️ **29 images lazy loaded** (native loading="lazy")
- 🔤 **2 fonts optimized** (display=swap)
- 🗑️ **75 lines dead code removed**

### **Best Practices**
- Critical CSS inlined
- Non-critical CSS loaded async
- JavaScript deferred
- Will-change for animations
- Intersection Observer for scroll effects

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary. All rights reserved © 2025 Ismail Sabbar.

Unauthorized copying, distribution, or use of this code is prohibited without explicit permission.

---

## 📧 Contact

**Ismail Sabbar** - Full Stack Developer & Automation Engineer

- 🌐 Website: [imsabbar.com](https://imsabbar.com)
- 💼 LinkedIn: [linkedin.com/in/imsabbar](https://www.linkedin.com/in/imsabbar)
- 🐙 GitHub: [github.com/imsabbar](https://github.com/imsabbar)
- 📧 Email: contact@imsabbar.com

---

## 🎯 Specializations

**10+ Years of Experience** in:

### **Full Stack Development**
- Laravel, React, PHP, CodeIgniter
- MySQL, MongoDB, PostgreSQL
- RESTful APIs, GraphQL
- Responsive web design & performance optimization

### **Automation Engineering**
- n8n workflow automation (Expert level)
- Perfex CRM module development
- Custom WordPress plugins
- Web scraping & data pipelines
- API integrations & third-party services

### **Additional Skills**
- Git/GitHub version control
- Performance optimization & SEO
- Database design & optimization
- API integration & development

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Ismail Sabbar](https://imsabbar.com)

</div>
