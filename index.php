<?php
    // Start session for CSRF protection
    session_start();

    // Enable error reporting only in localhost
    if ($_SERVER['HTTP_HOST'] === 'localhost') {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }


    require_once __DIR__ . '/vendor/autoload.php';  // Load Composer autoload file to read .env config file

    if ($_SERVER['HTTP_HOST'] === 'localhost') 
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '.env.local');

    else 
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '.env.production');

    $dotenv->load();

    require_once 'assets/includes/helpers.inc.php'; 

    // Generate CSRF token for forms
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

?>




<!DOCTYPE html>
<html lang="en">
    <head>
        <title>ISMAIL SABBAR - Portfolio | Full Stack Developer & Automation Engineer</title>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="title" content="Ismail Sabbar - Portfolio | Full Stack Developer & Automation Engineer">
        <meta name="description" content="Ismail Sabbar (imsabbar) – Full Stack Developer & Automation Engineer. Expert in web development (Laravel, React, PHP), n8n automation workflows, custom CRM modules, WordPress plugin development, web scraping, API integrations, and data analysis. 10+ years of experience delivering end-to-end digital solutions.">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <meta name="robots" content="index, follow">
        <meta name="language" content="English">
        <meta name="author" content="Ismail Sabbar">
        <meta name="keywords" content="Ismail Sabbar, إسماعيل صبار, sabbar portfolio, imsabbar profile, full stack developer, automation engineer, n8n automation, workflow automation, CRM developer, Perfex CRM, WordPress plugin development, Laravel developer, PHP developer, React developer, web scraping, API integration, data analysis, automation specialist, custom CRM modules, business automation, freelance developer">
        
        <!-- reCAPTCHA v3 Site Key - Get from .env file -->
        <meta name="recaptcha-site-key" content="<?php echo $_ENV['RECAPTCHA_SITE_KEY'] ?? ''; ?>">
        
        <meta property="og:title" content="Ismail Sabbar - Portfolio | Full Stack Developer & Automation Engineer">
        <meta property="og:description" content="Full Stack Developer & Automation Engineer specializing in web development, n8n automation, CRM modules, WordPress plugins, and API integrations. 10+ years of experience building scalable solutions.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://imsabbar.com">
        <meta property="og:image" content="https://imsabbar.com/assets/images/imsabbarProfile.jpeg">
        
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Ismail Sabbar - Portfolio | Full Stack Developer & Automation Engineer">
        <meta name="twitter:description" content="Expert in web development, n8n automation workflows, custom CRM modules, WordPress plugin development, and business process automation.">
        <meta name="twitter:image" content="https://imsabbar.com/assets/images/imsabbarProfile.jpeg">


        <!-- robots meta tag-->
        <link rel="canonical" href="https://imsabbar.com" /> 

        <!-- for logo-->
        <link rel="icon" type="image/x-icon" href="assets/images/imsabbarFav.ico">
        <link rel="shortcut icon" type="image/x-icon" href="assets/images/imsabbarFav.ico">
        <link rel="apple-touch-icon" href="assets/images/imsabbarFav.ico">


        
        <!-- Styling links - Optimized loading strategy -->
        <!-- Critical CSS loaded immediately -->
        <link rel="stylesheet" href="assets/css/loading.css">
        <link rel="stylesheet" href="assets/css/style.css">
        
        <!-- Non-critical CSS loaded with media print trick for async loading -->
        <link rel="stylesheet" href="assets/css/about.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="assets/css/skills.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="assets/css/portfolio.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="assets/css/services.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="assets/css/contact.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="assets/css/scroll.css" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="assets/css/about.css">
            <link rel="stylesheet" href="assets/css/skills.css">
            <link rel="stylesheet" href="assets/css/portfolio.css">
            <link rel="stylesheet" href="assets/css/services.css">
            <link rel="stylesheet" href="assets/css/contact.css">
            <link rel="stylesheet" href="assets/css/scroll.css">
        </noscript>
        <link rel="stylesheet" href="assets/css/intersectionObserverTest.css">

        <!-- FontAwesome - Kit only (removed duplicate CDN) -->
        <script src="https://kit.fontawesome.com/e1b17f703d.js" crossorigin="anonymous" async></script>

        <!-- Optimized Google Fonts - Only Kaushan Script + Poppins -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    


        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8DFY74MBHG"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8DFY74MBHG');
        </script>
    </head>
    
    
    <body>
        <!-- Background Bubbles -->
        <div class="page-bg-bubbles">
            <div class="bg-bubble"></div>
            <div class="bg-bubble"></div>
            <div class="bg-bubble"></div>
            <div class="bg-bubble"></div>
            <div class="bg-bubble"></div>
            <div class="bg-bubble"></div>
            <div class="bg-bubble"></div>
            <div class="bg-bubble"></div>
        </div>

        <!-- for loading page -->
        <section id="loading">
            <div class="spinner">
                <span id="loadingText">Loading</span>
                <div class="spinner-sector spinner-sector-red"></div>
                <div class="spinner-sector spinner-sector-blue"></div>
                <div class="spinner-sector spinner-sector-green"></div>
                <div class="spinner-sector spinner-sector-fourth"></div>
            </div>
        </section>




        <!-- The Header -->
        <header id="header">
            <div class="container">
                <a href="<?php echo proper_url(); ?>" class="logo">
                    <h2>
                        <span>Im</span>
                        <span>Sabbar</span>
                    </h2>
                </a>
                
                <div class="header-menu">
                    <nav class="nav-links">
                        <ul>
                            <li><a href="#home" id="home-nav" class="active">Home</a></li>
                            <li><a href="#about" id="about-nav">About</a></li>
                            <li><a href="#skills" id="skills-nav">Skills</a></li>
                            <li><a href="#portfolio" id="portfolio-nav">Portfolio</a></li>
                            <li><a href="#services" id="services-nav">Services</a></li>
                            <li><a href="#contact" id="contact-nav">Contact</a></li>
                        </ul>
                        
                        <!-- Mobile Controls - Added for mobile menu -->
                        <div class="mobile-controls">
                            <!-- Language Switcher for Mobile -->
                            <div class="language">
                                <button class="language-toggle" aria-label="Language selector" aria-expanded="false">
                                    <span class="selected-lang">EN</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                    </svg>
                                </button>
                                <ul class="language-dropdown">
                                    <li><a href="#" data-lang="en">🇬🇧 English</a></li>
                                    <li><a href="#" data-lang="fr">🇫🇷 Français</a></li>
                                    <li><a href="#" data-lang="ar">🇲🇦 العربية</a></li>
                                </ul>
                            </div>
                            
                            <!-- Theme Toggle for Mobile -->
                            <button class="theme-toggle" aria-label="Toggle dark mode">
                                <svg class="sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                                <svg class="moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            </button>
                        </div>
                    </nav>
                    
                    <div class="header-controls">
                        <!-- Language Switcher -->
                        <div class="language">
                            <button class="language-toggle" aria-label="Language selector" aria-expanded="false">
                                <span class="selected-lang">EN</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg>
                            </button>
                            <ul class="language-dropdown">
                                <li><a href="#" data-lang="en">🇬🇧 English</a></li>
                                <li><a href="#" data-lang="fr">🇫🇷 Français</a></li>
                                <li><a href="#" data-lang="ar">🇲🇦 العربية</a></li>
                            </ul>
                        </div>

                        <!-- Dark/Light Mode Toggle -->
                        <button class="theme-toggle" aria-label="Toggle dark mode">
                            <svg class="sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <svg class="moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </button>
                    </div>

                    <button class="hamburger" aria-label="Menu" aria-expanded="false">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Navigation Overlay -->
        <div class="nav-overlay"></div>

        <!-- The Home section -->
        <section id="home" class="section">
            <div class="content-left-bar">
                <div class="social-links">
                    <a class="social-link linkedin" href="https://www.linkedin.com/in/sabbarismail/" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                    <a class="social-link github" href="https://github.com/imsabbar" target="_blank" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                    <a class="social-link youtube" href="https://www.youtube.com/@imsabbar" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                    <a class="social-link facebook" href="https://facebook.com/imsabbar" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                    <a class="social-link instagram" href="https://instagram.com/im_sabbar" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a class="social-link telegram" href="https://t.me/imsabbar" target="_blank" aria-label="Telegram"><i class="fab fa-telegram"></i></a>
                    <a class="social-link whatsapp" href="https://wa.me/212681510095" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <a class="social-link mail" href="mailto:contact@imsabbar.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
                </div>
            </div>

            <div class="container">
                <div class="hero-content">
                    <div class="hero-text">
                        <h3 class="greeting">Greetings and welcome to my PORTFOLIO!</h3>
                        <h1 class="name">Ismail Sabbar</h1>
                        <h2 class="title">Full Stack Developer & Automation Engineer</h2>
                        <p class="description">As a passionate full-stack developer and automation engineer, I craft powerful web solutions and intelligent automation systems. With 10+ years of expertise in web development, n8n automation, and custom integrations, I transform complex challenges into streamlined digital solutions.</p>
                        
                        <div class="cta-buttons">   
                            <a href="mailto:contact@imsabbar.com" class="btn btn-primary" target="_blank">Hire Me</a>
                            <a class="btn btn-secondary" href="assets/files/imsabbar MEN V25.9.pdf" download target="_blank">Download My Resume <i class="fa-solid fa-download"></i></a>
                        </div>
                        <p class="tagline">Your Vision is My Expertise</p>
                    </div>

                    <div class="hero-image">
                        <div class="floating-bubble" aria-hidden="true"></div>
                        <div class="floating-bubble" aria-hidden="true"></div>
                        <div class="floating-bubble" aria-hidden="true"></div>
                        <div class="floating-bubble" aria-hidden="true"></div>
                        <div class="floating-bubble" aria-hidden="true"></div>
                        <img src="assets/images/imsabbar-profile_2k_tiny.png" alt="Ismail Sabbar - Full Stack Developer and Data Analyst" loading="eager">
                    </div>
                </div>

                <div class="scroll-down">
                    <a href="#about" class="scroll-down-btn" aria-label="Scroll to next section"><i class="fa-solid fa-chevron-down"></i></a>
                </div>
            </div>

            <div class="content-right-bar">
                <div class="dot-navigation">
                    <a href="#home" class="dot active" aria-label="Home" data-tooltip="Home"></a>
                    <a href="#about" class="dot" aria-label="About" data-tooltip="About"></a>
                    <a href="#skills" class="dot" aria-label="Skills" data-tooltip="Skills"></a>
                    <a href="#portfolio" class="dot" aria-label="Portfolio" data-tooltip="Portfolio"></a>
                    <a href="#services" class="dot" aria-label="Services" data-tooltip="Services"></a>
                    <a href="#contact" class="dot" aria-label="Contact" data-tooltip="Contact"></a>
                </div>
            </div>
        </section>


        


        <!-- The About section -->
        <section id="about">

            <h1 class="about-title">About <span>Me!</span></h1>
            <p class="about-text">Helping brands thrive in the digital world with innovative web solutions, intelligent automation, and data-driven insights that drive real business results.</p>

            <!-- Profile Image Section -->
            <div class="about-profile">
                <div class="profile-wrapper">
                    <img src="assets/images/imsabbar-profile_2K_tiny.png" alt="Ismail Sabbar - Full Stack Developer and Automation Engineer" class="myProfile" loading="lazy">
                </div>
            </div>

            <!-- Content Section -->
            <div class="about-content">
                <h2 class="about-role">Full Stack Developer <span>&</span> Automation Engineer</h2>
                    
                    <p class="description">
                        With 10+ years of hands-on experience, I specialize in building powerful digital solutions that transform businesses. Here's what I bring to the table:
                    </p>
                    
                    <ul class="about-highlights">
                        <li>
                            <i class="fa-solid fa-code"></i>
                            <div>
                                <strong>Full-Stack Web Development</strong>
                                <span>Building responsive, high-performance applications with Laravel, React, and PHP</span>
                            </div>
                        </li>
                        <li>
                            <i class="fa-solid fa-robot"></i>
                            <div>
                                <strong>Workflow Automation</strong>
                                <span>Creating intelligent automation systems with n8n that save time and boost efficiency</span>
                            </div>
                        </li>
                        <li>
                            <i class="fa-solid fa-briefcase"></i>
                            <div>
                                <strong>Custom Business Solutions</strong>
                                <span>CRM modules, WordPress plugins, web scraping, and API integrations tailored to your needs</span>
                            </div>
                        </li>
                        <li>
                            <i class="fa-solid fa-chart-line"></i>
                            <div>
                                <strong>Data-Driven Insights</strong>
                                <span>Transforming raw data into actionable insights through analysis and visualization</span>
                            </div>
                        </li>
                    </ul>
                    
                    <p class="about-cta">
                        Whether you need a complex web platform, automated workflows, or custom business tools, I combine technical excellence with creative problem-solving to transform your vision into reality. <strong>Let's build something extraordinary together.</strong>
                    </p>
            </div>

            <!-- Experience Stats -->
            <div class="experience-stats">
                <div class="stat-box">
                    <i class="icon fa-solid fa-people-group"></i>
                    <h3 class="expValue" data-val="63">00</h3>
                    <p>Satisfied Clients</p>
                </div>
                <div class="stat-box">
                    <i class="icon fa-solid fa-clipboard-check"></i>
                    <h3 class="expValue" data-val="84">00</h3>
                    <p>Completed Projects</p>
                </div>
                <div class="stat-box">
                    <i class="icon fa-solid fa-fire-flame-curved"></i>
                    <h3 class="expValue" data-val="10">00</h3>
                    <p>Years of Experience</p>
                </div>
            </div>
            
        </section>




        <!-- The skills section -->
        <section id="skills">
            <h2 class="skills-title">My <span>Skills</span></h2>
            <p class="skills-text">Empowering Your Digital Journey: A Skillful Toolkit Customized to Fit Your Project's Demands and Aspirations</p>

            <div class="technical-skills">
                <!-- Frontend Technologies -->
                <div class="skill-category-header">
                    <h3 class="category-title">Frontend Technologies</h3>
                </div>
                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/html5.png" alt="HTML 5 Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">HTML5</p>     
                        </div>
                        <div class="skill-progress html5"><span></span></div>
                    </div>
                    <div class="skill-percentage">95%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/css3.png" alt="CSS3 Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">CSS3</p>     
                        </div>
                        <div class="skill-progress css3"><span></span></div>
                    </div>
                    <div class="skill-percentage">90%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/js.png" alt="JavaScript Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">JavaScript</p>     
                        </div>
                        <div class="skill-progress js"><span></span></div>
                    </div>
                    <div class="skill-percentage">100%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/jquery.png" alt="JQuery Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">jQuery</p>     
                        </div>
                        <div class="skill-progress jquery"><span></span></div>
                    </div>
                    <div class="skill-percentage">100%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/react logo.png" alt="React Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">React</p>     
                        </div>
                        <div class="skill-progress react"><span></span></div>
                    </div>
                    <div class="skill-percentage">75%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/ajax.png" alt="Ajax Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">Ajax</p>     
                        </div>
                        <div class="skill-progress ajax"><span></span></div>
                    </div>
                    <div class="skill-percentage">75%</div>
                </div>

                <!-- Backend Technologies -->
                <div class="skill-category-header">
                    <h3 class="category-title">Backend Technologies</h3>
                </div>
                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/php.png" alt="PHP Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">PHP</p>     
                        </div>
                        <div class="skill-progress php"><span></span></div>
                    </div>
                    <div class="skill-percentage">88%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/laravel logo.jpg" alt="Laravel Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">Laravel</p>     
                        </div>
                        <div class="skill-progress laravel"><span></span></div>
                    </div>
                    <div class="skill-percentage">82%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/codeigniter-logo.webp" alt="CodeIgniter Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">CodeIgniter</p>     
                        </div>
                        <div class="skill-progress codeigniter"><span></span></div>
                    </div>
                    <div class="skill-percentage">100%</div>
                </div>

                <!-- Database Technologies -->
                <div class="skill-category-header">
                    <h3 class="category-title">Database Technologies</h3>
                </div>
                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/mysql.png" alt="MySQL Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">MySQL</p>     
                        </div>
                        <div class="skill-progress mysql"><span></span></div>
                    </div>
                    <div class="skill-percentage">100%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/mongo.png" alt="MongoDB Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">MongoDB</p>     
                        </div>
                        <div class="skill-progress mongodb"><span></span></div>
                    </div>
                    <div class="skill-percentage">78%</div>
                </div>

                <!-- CMS & Tools -->
                <div class="skill-category-header">
                    <h3 class="category-title">CMS & Tools</h3>
                </div>
                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/wordpress.png" alt="WordPress Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">WordPress</p>     
                        </div>
                        <div class="skill-progress wordpress"><span></span></div>
                    </div>
                    <div class="skill-percentage">92%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/woocommerce.png" alt="WooCommerce Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">WooCommerce</p>     
                        </div>
                        <div class="skill-progress woocomerce"><span></span></div>
                    </div>
                    <div class="skill-percentage">87%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/perfex-logo.webp" alt="Perfex CRM Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">Perfex CRM</p>     
                        </div>
                        <div class="skill-progress perfex"><span></span></div>
                    </div>
                    <div class="skill-percentage">85%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <i class="fa-solid fa-robot n8n-icon"></i>
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">n8n</p>     
                        </div>
                        <div class="skill-progress n8n"><span></span></div>
                    </div>
                    <div class="skill-percentage">100%</div>
                </div>

                <!-- Version Control -->
                <div class="skill-category-header">
                    <h3 class="category-title">Version Control</h3>
                </div>
                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/git.png" alt="Git Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">Git</p>     
                        </div>
                        <div class="skill-progress git"><span></span></div>
                    </div>
                    <div class="skill-percentage">90%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/github.png" alt="GitHub Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">GitHub</p>     
                        </div>
                        <div class="skill-progress github"><span></span></div>
                    </div>
                    <div class="skill-percentage">88%</div>
                </div>

                <!-- Programming Languages -->
                <div class="skill-category-header">
                    <h3 class="category-title">Programming Languages</h3>
                </div>
                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/python.png" alt="Python Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">Python</p>     
                        </div>
                        <div class="skill-progress python"><span></span></div>
                    </div>
                    <div class="skill-percentage">70%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/java-logo-1.png" alt="Java Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">Java</p>     
                        </div>
                        <div class="skill-progress java"><span></span></div>
                    </div>
                    <div class="skill-percentage">72%</div>
                </div>

                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/R.png" alt="R Language Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">R</p>     
                        </div>
                        <div class="skill-progress R"><span></span></div>
                    </div>
                    <div class="skill-percentage">65%</div>
                </div>

                <!-- Data Analysis Tools -->
                <div class="skill-category-header">
                    <h3 class="category-title">Data Analysis Tools</h3>
                </div>
                <div class="skill">
                    <div class="icon">
                        <img src="./assets/images/jupyter logo.png" alt="Jupyter Notebook Logo" loading="lazy">
                    </div>
                    <div class="info">
                        <div class="skill-info">
                            <p class="subject">Jupyter Notebook</p>     
                        </div>
                        <div class="skill-progress jupyter"><span></span></div>
                    </div>
                    <div class="skill-percentage">68%</div>
                </div>
                </div>
            </div>

        </section>

        


        <!-- The Portfolio section -->
        <section id="portfolio">
            <h2 class="portfolio-title"><span>My</span> Portfolio</h2>
            <p class="portfolio-text">Exploring my diverse, innovative web development projects that fuse creativity with technology's power.</p>

            <!-- project Filter container -->
            <div class="project-filter container">
                <span class="filter-item active-filter" data-filter='all'>All</span>
                <span class="filter-item" data-filter="webDev">Web Developement</span>
                <span class="filter-item" data-filter="data">Data Analyst</span>
                <span class="filter-item" data-filter="design">Graphic Designs</span>
            </div>

            <!-- now creating projects -->
            <div class="project container">

                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/jana_thumbnail.jpg" alt="this is a picture of project" class="project-img" loading="lazy">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.com" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">Janna Puzzle</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/digiprod_thumbnail.jpg" alt="this is a picture of project" class="project-img" loading="lazy">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.com" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">digiProd</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/pso-thumbnail.jpg" alt="this is a picture of project" class="project-img" loading="lazy">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.com" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">PSO</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/marketing_thumbnail.jpg" alt="this is a picture of project" class="project-img" loading="lazy">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.com" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">Marketing Agency</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/unbranded_thumbnail.jpg" alt="this is a picture of project" class="project-img" loading="lazy">
                        
                        <div class="info-hover">
                            <h4 class="field">web design</h4>
                            <a href="https://.imsabbar.com" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">Unbranded Cosmetics</h4>
                        </div>
                    </div>
                </div>



                <!-- data -->
                <div class="project-box data">
                    <div class="project-preview">
                        <img src="assets/images/data2.jpg" alt="this is a picture of project" class="project-img" loading="lazy">
                        
                        <div class="info-hover">
                            <h4 class="field">data project</h4>
                            <a href="https://.imsabbar.com" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">R Data Analyst</h4>
                        </div>
                    </div>
                </div>

                <div class="project-box data">
                    <div class="project-preview">
                        <img src="assets/images/data1.png" alt="this is a picture of project" class="project-img" loading="lazy">
                        
                        <div class="info-hover">
                            <h4 class="field">data project</h4>
                            <a href="https://.imsabbar.com" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">Python Data Analyst</h4>
                        </div>
                    </div>
                </div>





            </div>
        </section>

        

        <!-- The Services section -->
        <section id="services">
            <h2 class="services-title">Services <span>I'm Providing</span></h2>
            <p class="services-text">Expertly Crafting Tailored Solutions for Your Unique Needs: Discover the Comprehensive Services I'm Providing.</p>

            <div class="services-container">

                <!-- Full Stack Development -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-layer-group"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Full Stack Web Development</h3>
                        <p class="service-description">End-to-end web application development with modern frameworks (Laravel, React, PHP). From responsive front-ends to robust back-end systems, delivering complete digital solutions.</p>
                    </div>
                </div>

                <!-- Automation Engineering -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-robot"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Workflow Automation & Integration</h3>
                        <p class="service-description">Expert in n8n automation workflows, connecting APIs, automating repetitive tasks, and integrating business systems. Save time and eliminate manual processes with smart automation solutions.</p>
                    </div>
                </div>

                <!-- CRM Development -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-briefcase"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Custom CRM Development & Modules</h3>
                        <p class="service-description">Build and customize CRM systems (Perfex CRM, custom solutions) with tailored modules, integrations, and workflows to streamline your business operations and boost productivity.</p>
                    </div>
                </div>

                <!-- WordPress Development -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-brands fa-wordpress"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Custom WordPress Plugin Development</h3>
                        <p class="service-description">Design and develop custom WordPress plugins tailored to your specific needs. From e-commerce extensions to custom functionality, I build scalable solutions that integrate seamlessly.</p>
                    </div>
                </div>

                <!-- Web Scraping & Data Extraction -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-spider"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Web Scraping & Data Extraction</h3>
                        <p class="service-description">Automated data extraction from websites using Python (BeautifulSoup, Selenium, Scrapy). Collect, clean, and structure web data for business intelligence and analysis.</p>
                    </div>
                </div>

                <!-- API Development & Integration -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-plug"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">API Development & Integration</h3>
                        <p class="service-description">Build RESTful APIs and integrate third-party services seamlessly. Connect your applications with payment gateways, social media, CRMs, and other essential business tools.</p>
                    </div>
                </div>

                <!-- Data Analysis & Visualization -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-chart-line"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Data Analysis & Visualization</h3>
                        <p class="service-description">Transform raw data into actionable insights with Python (Pandas, NumPy) and create interactive visualizations. Analytics dashboards, reports, and business intelligence solutions.</p>
                    </div>
                </div>

                <!-- Performance & SEO -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-gauge-high"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Performance Optimization & SEO</h3>
                        <p class="service-description">Speed up your website with advanced optimization techniques and improve search engine rankings through technical SEO, semantic markup, and best practices implementation.</p>
                    </div>
                </div>

                <!-- Database Design & Management -->
                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-database"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Database Design & Management</h3>
                        <p class="service-description">Design, optimize, and manage databases (MySQL, MongoDB, PostgreSQL). From schema design to query optimization, ensuring efficient data storage and retrieval for your applications.</p>
                    </div>
                </div>

            </div>
            
        </section>




        <!-- The Contact section -->
        <section id="contact">

            <h2 class="contact-title">Contact <span>Me!</span></h2>
            <p class="contact-text">Your thoughts matter! Whether you have inquiries, feedback, or exciting new projects in mind, I'm all ears. Let's connect and bring your ideas to life!</p>
            
            <div class="container">

                <div class="formdiv">
                    <!-- Form Status Messages -->
                    <div id="formStatusMessages" class="form-status-container"></div>
                    
                    <form id="contactForm" action="assets/includes/contact.inc.php" method="POST" enctype="multipart/form-data">
                        <!-- CSRF Token for security -->
                        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8'); ?>">
                        
                        <!-- reCAPTCHA v3 Token (will be populated by JavaScript) -->
                        <input type="hidden" name="recaptcha_token" id="recaptchaToken">
    
                        <div class="divBox">
                            <div class="inputBox">
                                <label></label>
                                <input type="text" name="customerName" autocomplete="off" required placeholder="Your name *">
                            </div>
                            <div class="inputBox">
                                <label></label>
                                <input type="email" name="customerEmail" autocomplete="off" required placeholder="Email address *">
                            </div>
                        </div>
    
                        <div class="divBox">
                            <div class="inputBox">
                                <label></label>
                                <input type="text" name="customerSubject" autocomplete="off" required placeholder="Subject *">
                            </div>
                            <div class="inputBox">
                                <label></label>
                                <input type="text" name="customerPhone" autocomplete="off" id="customerPhone" required placeholder="+ Phone number" >
                            </div>
                        </div>
                        
                        <div class="divBox">
                            <div class="inputBox last">
                                <label></label>
                                <textarea name="customerMessage" autocomplete="off" required placeholder="Your message.. *" ></textarea>
                            </div>
                        </div>
    
                        <div class="inputBox contact-btn">
                            <button id="contactbtn" type="submit" name="submit">
                                <span class="btn-text">Send Message</span>
                                <span class="btn-loader" style="display: none;">
                                    <i class="fa-solid fa-spinner fa-spin"></i> Sending...
                                </span>
                            </button>
                        </div>
                    </form>
    
                </div>
    
    
                <div class="contactList">
                    <div class="list">
                        <div class="icon">
                            <a href="mailto:contact@imsabbar.com" target="_blank"><i class="fa-regular fa-envelope"></i></a>
                        </div>
                        <div class="info">
                            <h2>Mail me here:</h2>
                            <a href="mailto:contact@imsabbar.com" target="_blank">contact@imsabbar.com</a>
                        </div>
                    </div>
    
                    <div class="list">
                        <div class="icon">
                            <a href="tel:+212681510095"><i class="fa-solid fa-headset"></i></a>
                        </div>
                        <div class="info">
                            <h2>Call me at:</h2>
                            <a href="tel:+1234567890">+212 681510095</a>
                        </div>
                    </div>

                </div>
            </div>


            <div id="popup" class="popup" >
                <img src="images/tick.png" alt="tick icon">
                <h2>Thank You!</h2>
                <p>
                    One of our team will email you shortly, don't hesitate to ask,
                    we will do our best to help you, thanks!
                </p>
                <button type="submit" name="tohome" onclick="closePopup()" >OK</button> 
            </div>
        </section>




        <footer>
            <div class="footer-content">
                <div class="footer-left">
                    Made with <span class="heart">❤️</span> by <span class="me">imsabbar</span>
                </div>
                <div class="footer-right">
                    &copy; <?php echo date('Y'); ?> Ismail Sabbar. All rights reserved.
                </div>
            </div>
        </footer>


        <!-- This is  GO UP -->
        <div id="progress">
            <i id="progress-value" class="fa-solid fa-arrow-up"></i>
        </div>


        <!-- Scripts Files -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" ></script>
        <script type="text/javascript" src="assets/js/loading.js"></script>
        <script type="text/javascript" src="assets/js/script.js"></script>
        <script type="text/javascript" src="assets/js/languageSwitcher.js"></script>
        <script type="text/javascript" src="assets/js/skillsData.js"></script>
        <script type="text/javascript" src="assets/js/projFilter.js"></script>
        <script type="text/javascript" src="assets/js/scrollAnimation.js"></script>
        <script type="text/javascript" src="assets/js/textAnimation.js"></script>
        <script type="text/javascript" src="assets/js/aboutExperience.js"></script>
        <script type="text/javascript" src="assets/js/skillsAnimation.js"></script>
        <script type="text/javascript" src="assets/js/intersectionObserverTest.js"></script>
        <script type="text/javascript" src="assets/js/contactForm.js"></script>
        <script type="text/javascript" src="assets/js/recaptcha.js"></script>

    </body>
</html>
