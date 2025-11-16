/**
 * Language Switcher Implementation
 * Supports: English (EN), French (FR), Arabic (AR)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Language translations
    const translations = {
        en: {
            // Navigation
            'nav-home': 'Home',
            'nav-about': 'About',
            'nav-skills': 'Skills',
            'nav-portfolio': 'Portfolio',
            'nav-services': 'Services',
            'nav-contact': 'Contact',
            
            // Hero Section
            'hero-greeting': 'Greetings and welcome to my PORTFOLIO!',
            'hero-name': 'Ismail Sabbar',
            'hero-title': 'Full Stack Developer & Automation Engineer',
            'hero-description': 'As a passionate full-stack developer and automation engineer, I craft powerful web solutions and intelligent automation systems. With 10+ years of expertise in web development, n8n automation, and custom integrations, I transform complex challenges into streamlined digital solutions.',
            'hero-cta-hire': 'Hire Me',
            'hero-cta-resume': 'Download My Resume',
            'hero-tagline': 'Your Vision is My Expertise',
            
            // About Section
            'about-title': 'About <span>Me!</span>',
            'about-subtitle': 'Helping brands thrive in the digital world with innovative web solutions, intelligent automation, and data-driven insights that drive real business results.',
            'about-role': 'Full Stack Developer <span>&</span> Automation Engineer',
            'about-description': 'With 10+ years of hands-on experience, I specialize in building powerful digital solutions that transform businesses. Here\'s what I bring to the table:',
            'about-cta': 'Whether you need a complex web platform, automated workflows, or custom business tools, I combine technical excellence with creative problem-solving to transform your vision into reality. <strong>Let\'s build something extraordinary together.</strong>',
            'about-highlight-1-title': 'Full-Stack Web Development',
            'about-highlight-1-desc': 'Building responsive, high-performance applications with Laravel, React, and PHP',
            'about-highlight-2-title': 'Workflow Automation',
            'about-highlight-2-desc': 'Creating intelligent automation systems with n8n that save time and boost efficiency',
            'about-highlight-3-title': 'Custom Business Solutions',
            'about-highlight-3-desc': 'CRM modules, WordPress plugins, web scraping, and API integrations tailored to your needs',
            'about-highlight-4-title': 'Data-Driven Insights',
            'about-highlight-4-desc': 'Transforming raw data into actionable insights through analysis and visualization',
            'stat-clients': 'Satisfied Clients',
            'stat-projects': 'Completed Projects',
            'stat-experience': 'Years of Experience',
            
            // Skills Section
            'skills-title': 'My <span>Skills</span>',
            'skills-subtitle': 'Empowering Your Digital Journey: A Skillful Toolkit Customized to Fit Your Project\'s Demands and Aspirations',
            
            // Portfolio Section
            'portfolio-title': '<span>My</span> Portfolio',
            'portfolio-subtitle': 'Exploring my diverse, innovative web development projects that fuse creativity with technology\'s power.',
            'portfolio-filter-all': 'All',
            'portfolio-filter-webdev': 'Web Development',
            'portfolio-filter-data': 'Data Analyst',
            'portfolio-filter-design': 'Graphic Designs',
            
            // Services Section
            'services-title': 'Services <span>I\'m Providing</span>',
            'services-subtitle': 'Expertly Crafting Tailored Solutions for Your Unique Needs: Discover the Comprehensive Services I\'m Providing.',
            'service-1-title': 'Full Stack Web Development',
            'service-1-desc': 'End-to-end web application development with modern frameworks (Laravel, React, PHP). From responsive front-ends to robust back-end systems, delivering complete digital solutions.',
            'service-2-title': 'Workflow Automation & Integration',
            'service-2-desc': 'Expert in n8n automation workflows, connecting APIs, automating repetitive tasks, and integrating business systems. Save time and eliminate manual processes with smart automation solutions.',
            'service-3-title': 'Custom CRM Development & Modules',
            'service-3-desc': 'Build and customize CRM systems (Perfex CRM, custom solutions) with tailored modules, integrations, and workflows to streamline your business operations and boost productivity.',
            'service-4-title': 'Custom WordPress Plugin Development',
            'service-4-desc': 'Design and develop custom WordPress plugins tailored to your specific needs. From e-commerce extensions to custom functionality, I build scalable solutions that integrate seamlessly.',
            'service-5-title': 'Web Scraping & Data Extraction',
            'service-5-desc': 'Automated data extraction from websites using Python (BeautifulSoup, Selenium, Scrapy). Collect, clean, and structure web data for business intelligence and analysis.',
            'service-6-title': 'API Development & Integration',
            'service-6-desc': 'Build RESTful APIs and integrate third-party services seamlessly. Connect your applications with payment gateways, social media, CRMs, and other essential business tools.',
            'service-7-title': 'Data Analysis & Visualization',
            'service-7-desc': 'Transform raw data into actionable insights with Python (Pandas, NumPy) and create interactive visualizations. Analytics dashboards, reports, and business intelligence solutions.',
            'service-8-title': 'Performance Optimization & SEO',
            'service-8-desc': 'Speed up your website with advanced optimization techniques and improve search engine rankings through technical SEO, semantic markup, and best practices implementation.',
            'service-9-title': 'Database Design & Management',
            'service-9-desc': 'Design, optimize, and manage databases (MySQL, MongoDB, PostgreSQL). From schema design to query optimization, ensuring efficient data storage and retrieval for your applications.',
            
            // Footer
            'footer-made': 'Made with',
            'footer-by': 'by',
            'footer-rights': 'All rights reserved.',
            
            // Loading
            'loading-text': 'Loading',
            
            // Contact Section
            'contact-title': 'Contact <span>Me!</span>',
            'contact-subtitle': 'Your thoughts matter! Whether you have inquiries, feedback, or exciting new projects in mind, I\'m all ears. Let\'s connect and bring your ideas to life!',
            'contact-name-placeholder': 'Your name *',
            'contact-email-placeholder': 'Email address *',
            'contact-subject-placeholder': 'Subject *',
            'contact-phone-placeholder': '+ Phone number',
            'contact-message-placeholder': 'Your message.. *',
            'contact-btn': 'Send Message',
            'contact-mail-label': 'Mail me here:',
            'contact-call-label': 'Call me at:'
        },
        fr: {
            // Navigation
            'nav-home': 'Accueil',
            'nav-about': 'À propos',
            'nav-skills': 'Compétences',
            'nav-portfolio': 'Portfolio',
            'nav-services': 'Services',
            'nav-contact': 'Contact',
            
            // Hero Section
            'hero-greeting': 'Salutations et bienvenue dans mon PORTFOLIO!',
            'hero-name': 'Ismail Sabbar',
            'hero-title': 'Développeur Full Stack & Ingénieur Automation',
            'hero-description': 'En tant que développeur full-stack et ingénieur d\'automatisation passionné, je crée des solutions web puissantes et des systèmes d\'automatisation intelligents. Avec 10+ ans d\'expertise en développement web, automatisation n8n et intégrations personnalisées, je transforme les défis complexes en solutions numériques rationalisées.',
            'hero-cta-hire': 'Engagez-moi',
            'hero-cta-resume': 'Télécharger mon CV',
            'hero-tagline': 'Votre Vision est Mon Expertise',
            
            // About Section
            'about-title': 'À propos <span>de Moi!</span>',
            'about-subtitle': 'Aider les marques à prospérer dans le monde numérique avec des solutions web innovantes, une automatisation intelligente et des insights basés sur les données qui génèrent de vrais résultats commerciaux.',
            'about-role': 'Développeur Full Stack <span>&</span> Ingénieur Automation',
            'about-description': 'Avec 10+ ans d\'expérience pratique, je me spécialise dans la création de solutions numériques puissantes qui transforment les entreprises. Voici ce que j\'apporte :',
            'about-cta': 'Que vous ayez besoin d\'une plateforme web complexe, de workflows automatisés ou d\'outils métier personnalisés, j\'allie excellence technique et résolution créative de problèmes pour transformer votre vision en réalité. <strong>Construisons ensemble quelque chose d\'extraordinaire.</strong>',
            'about-highlight-1-title': 'Développement Web Full-Stack',
            'about-highlight-1-desc': 'Création d\'applications réactives et performantes avec Laravel, React et PHP',
            'about-highlight-2-title': 'Automatisation de Workflows',
            'about-highlight-2-desc': 'Création de systèmes d\'automatisation intelligents avec n8n qui économisent du temps et augmentent l\'efficacité',
            'about-highlight-3-title': 'Solutions Métier Personnalisées',
            'about-highlight-3-desc': 'Modules CRM, plugins WordPress, web scraping et intégrations API adaptés à vos besoins',
            'about-highlight-4-title': 'Insights Basés sur les Données',
            'about-highlight-4-desc': 'Transformer les données brutes en insights exploitables grâce à l\'analyse et à la visualisation',
            'stat-clients': 'Clients Satisfaits',
            'stat-projects': 'Projets Réalisés',
            'stat-experience': 'Années d\'Expérience',
            
            // Skills Section
            'skills-title': 'Mes <span>Compétences</span>',
            'skills-subtitle': 'Autonomiser Votre Parcours Numérique : Une Boîte à Outils Compétente Personnalisée pour Répondre aux Exigences et Aspirations de Votre Projet',
            
            // Portfolio Section
            'portfolio-title': '<span>Mon</span> Portfolio',
            'portfolio-subtitle': 'Explorer mes projets de développement web diversifiés et innovants qui fusionnent la créativité avec la puissance de la technologie.',
            'portfolio-filter-all': 'Tous',
            'portfolio-filter-webdev': 'Développement Web',
            'portfolio-filter-data': 'Analyste de Données',
            'portfolio-filter-design': 'Designs Graphiques',
            
            // Services Section
            'services-title': 'Services <span>que Je Fournis</span>',
            'services-subtitle': 'Élaboration Experte de Solutions Sur Mesure pour Vos Besoins Uniques : Découvrez les Services Complets que Je Fournis.',
            'service-1-title': 'Développement Web Full Stack',
            'service-1-desc': 'Développement d\'applications web de bout en bout avec des frameworks modernes (Laravel, React, PHP). Des interfaces réactives aux systèmes back-end robustes, offrant des solutions numériques complètes.',
            'service-2-title': 'Automatisation et Intégration de Workflows',
            'service-2-desc': 'Expert en workflows d\'automatisation n8n, connexion d\'APIs, automatisation de tâches répétitives et intégration de systèmes d\'entreprise. Gagnez du temps et éliminez les processus manuels avec des solutions d\'automatisation intelligentes.',
            'service-3-title': 'Développement CRM Personnalisé & Modules',
            'service-3-desc': 'Construire et personnaliser des systèmes CRM (Perfex CRM, solutions personnalisées) avec des modules sur mesure, des intégrations et des workflows pour rationaliser vos opérations commerciales et augmenter la productivité.',
            'service-4-title': 'Développement de Plugins WordPress Personnalisés',
            'service-4-desc': 'Conception et développement de plugins WordPress personnalisés adaptés à vos besoins spécifiques. Des extensions e-commerce aux fonctionnalités personnalisées, je crée des solutions évolutives qui s\'intègrent parfaitement.',
            'service-5-title': 'Web Scraping & Extraction de Données',
            'service-5-desc': 'Extraction automatisée de données de sites web avec Python (BeautifulSoup, Selenium, Scrapy). Collecter, nettoyer et structurer les données web pour l\'intelligence d\'affaires et l\'analyse.',
            'service-6-title': 'Développement & Intégration d\'API',
            'service-6-desc': 'Créer des APIs RESTful et intégrer des services tiers de manière transparente. Connectez vos applications avec des passerelles de paiement, réseaux sociaux, CRMs et autres outils essentiels.',
            'service-7-title': 'Analyse de Données & Visualisation',
            'service-7-desc': 'Transformer les données brutes en insights exploitables avec Python (Pandas, NumPy) et créer des visualisations interactives. Tableaux de bord analytiques, rapports et solutions de business intelligence.',
            'service-8-title': 'Optimisation des Performances & SEO',
            'service-8-desc': 'Accélérez votre site web avec des techniques d\'optimisation avancées et améliorez le classement dans les moteurs de recherche grâce au SEO technique, au balisage sémantique et aux meilleures pratiques.',
            'service-9-title': 'Conception & Gestion de Bases de Données',
            'service-9-desc': 'Concevoir, optimiser et gérer des bases de données (MySQL, MongoDB, PostgreSQL). De la conception de schémas à l\'optimisation de requêtes, garantissant un stockage et une récupération de données efficaces.',
            
            // Footer
            'footer-made': 'Fait avec',
            'footer-by': 'par',
            'footer-rights': 'Tous droits réservés.',
            
            // Loading
            'loading-text': 'Chargement',
            
            // Contact Section
            'contact-title': 'Contactez <span>Moi!</span>',
            'contact-subtitle': 'Vos pensées comptent! Que vous ayez des questions, des commentaires ou de nouveaux projets passionnants en tête, je suis tout ouïe. Connectons-nous et donnons vie à vos idées!',
            'contact-name-placeholder': 'Votre nom *',
            'contact-email-placeholder': 'Adresse e-mail *',
            'contact-subject-placeholder': 'Sujet *',
            'contact-phone-placeholder': '+ Numéro de téléphone',
            'contact-message-placeholder': 'Votre message.. *',
            'contact-btn': 'Envoyer le Message',
            'contact-mail-label': 'Écrivez-moi ici:',
            'contact-call-label': 'Appelez-moi au:'
        },
        ar: {
            // Navigation
            'nav-home': 'الرئيسية',
            'nav-about': 'عني',
            'nav-skills': 'المهارات',
            'nav-portfolio': 'المعرض',
            'nav-services': 'الخدمات',
            'nav-contact': 'التواصل',
            
            // Hero Section
            'hero-greeting': 'تحياتي ومرحبا بكم في معرض أعمالي!',
            'hero-name': 'إسماعيل صبار',
            'hero-title': 'مطور فول ستاك ومهندس أتمتة',
            'hero-description': 'كمطور فول ستاك ومهندس أتمتة شغوف، أقوم بإنشاء حلول ويب قوية وأنظمة أتمتة ذكية. مع أكثر من 10 سنوات من الخبرة في تطوير الويب وأتمتة n8n والتكاملات المخصصة، أقوم بتحويل التحديات المعقدة إلى حلول رقمية مبسطة.',
            'hero-cta-hire': 'وظفني',
            'hero-cta-resume': 'تحميل سيرتي الذاتية',
            'hero-tagline': 'رؤيتك هي خبرتي',
            
            // About Section
            'about-title': 'نبذة <span>عني!</span>',
            'about-subtitle': 'مساعدة العلامات التجارية على الازدهار في العالم الرقمي من خلال حلول ويب مبتكرة وأتمتة ذكية ورؤى قائمة على البيانات تحقق نتائج تجارية حقيقية.',
            'about-role': 'مطور فول ستاك <span>&</span> مهندس أتمتة',
            'about-description': 'مع أكثر من 10 سنوات من الخبرة العملية، أتخصص في بناء حلول رقمية قوية تحول الأعمال. إليك ما أقدمه:',
            'about-cta': 'سواء كنت بحاجة إلى منصة ويب معقدة، أو سير عمل آلي، أو أدوات أعمال مخصصة، فأنا أجمع بين التميز التقني وحل المشكلات الإبداعي لتحويل رؤيتك إلى واقع. <strong>لنبني شيئاً استثنائياً معاً.</strong>',
            'about-highlight-1-title': 'تطوير الويب الكامل',
            'about-highlight-1-desc': 'بناء تطبيقات متجاوبة وعالية الأداء باستخدام Laravel و React و PHP',
            'about-highlight-2-title': 'أتمتة سير العمل',
            'about-highlight-2-desc': 'إنشاء أنظمة أتمتة ذكية باستخدام n8n توفر الوقت وتعزز الكفاءة',
            'about-highlight-3-title': 'حلول أعمال مخصصة',
            'about-highlight-3-desc': 'وحدات CRM، إضافات WordPress، استخراج بيانات الويب، وتكاملات API مصممة لاحتياجاتك',
            'about-highlight-4-title': 'رؤى قائمة على البيانات',
            'about-highlight-4-desc': 'تحويل البيانات الخام إلى رؤى قابلة للتنفيذ من خلال التحليل والتصور',
            'stat-clients': 'عملاء راضون',
            'stat-projects': 'مشاريع مكتملة',
            'stat-experience': 'سنوات من الخبرة',
            
            // Skills Section
            'skills-title': '<span>مهاراتي</span>',
            'skills-subtitle': 'تمكين رحلتك الرقمية: مجموعة أدوات ماهرة مخصصة لتناسب متطلبات وطموحات مشروعك',
            
            // Portfolio Section
            'portfolio-title': '<span>معرض</span> أعمالي',
            'portfolio-subtitle': 'استكشاف مشاريع تطوير الويب المتنوعة والمبتكرة التي تدمج الإبداع مع قوة التكنولوجيا.',
            'portfolio-filter-all': 'الكل',
            'portfolio-filter-webdev': 'تطوير الويب',
            'portfolio-filter-data': 'محلل البيانات',
            'portfolio-filter-design': 'التصاميم الجرافيكية',
            
            // Services Section
            'services-title': 'الخدمات <span>التي أقدمها</span>',
            'services-subtitle': 'صياغة خبيرة لحلول مخصصة لاحتياجاتك الفريدة: اكتشف الخدمات الشاملة التي أقدمها.',
            'service-1-title': 'تطوير الويب الكامل',
            'service-1-desc': 'تطوير تطبيقات الويب من البداية إلى النهاية باستخدام أطر عمل حديثة (Laravel، React، PHP). من الواجهات الأمامية المتجاوبة إلى أنظمة الخلفية القوية، مع تقديم حلول رقمية كاملة.',
            'service-2-title': 'أتمتة سير العمل والتكامل',
            'service-2-desc': 'خبير في سير عمل أتمتة n8n، وربط واجهات برمجة التطبيقات، وأتمتة المهام المتكررة، وتكامل أنظمة الأعمال. وفر الوقت وألغ العمليات اليدوية بحلول أتمتة ذكية.',
            'service-3-title': 'تطوير CRM المخصص والوحدات',
            'service-3-desc': 'بناء وتخصيص أنظمة CRM (Perfex CRM، حلول مخصصة) مع وحدات مخصصة وتكاملات وسير عمل لتبسيط عمليات عملك وتعزيز الإنتاجية.',
            'service-4-title': 'تطوير إضافات WordPress المخصصة',
            'service-4-desc': 'تصميم وتطوير إضافات WordPress مخصصة تناسب احتياجاتك المحددة. من ملحقات التجارة الإلكترونية إلى الوظائف المخصصة، أقوم ببناء حلول قابلة للتطوير تتكامل بسلاسة.',
            'service-5-title': 'استخراج البيانات من الويب',
            'service-5-desc': 'استخراج البيانات الآلي من المواقع باستخدام Python (BeautifulSoup، Selenium، Scrapy). جمع وتنظيف وهيكلة بيانات الويب لذكاء الأعمال والتحليل.',
            'service-6-title': 'تطوير وتكامل واجهات برمجة التطبيقات',
            'service-6-desc': 'بناء واجهات برمجة تطبيقات RESTful ودمج خدمات الطرف الثالث بسلاسة. اربط تطبيقاتك ببوابات الدفع ووسائل التواصل الاجتماعي وأنظمة CRM والأدوات الأساسية الأخرى.',
            'service-7-title': 'تحليل البيانات والتصور',
            'service-7-desc': 'تحويل البيانات الخام إلى رؤى قابلة للتنفيذ باستخدام Python (Pandas، NumPy) وإنشاء تصورات تفاعلية. لوحات تحكم تحليلية وتقارير وحلول ذكاء الأعمال.',
            'service-8-title': 'تحسين الأداء وتحسين محركات البحث',
            'service-8-desc': 'تسريع موقعك الإلكتروني بتقنيات تحسين متقدمة وتحسين ترتيب محركات البحث من خلال SEO التقني والعلامات الدلالية وتطبيق أفضل الممارسات.',
            'service-9-title': 'تصميم وإدارة قواعد البيانات',
            'service-9-desc': 'تصميم وتحسين وإدارة قواعد البيانات (MySQL، MongoDB، PostgreSQL). من تصميم المخططات إلى تحسين الاستعلامات، مما يضمن تخزين واسترجاع البيانات بكفاءة.',
            
            // Footer
            'footer-made': 'صنع بـ',
            'footer-by': 'بواسطة',
            'footer-rights': 'جميع الحقوق محفوظة.',
            
            // Loading
            'loading-text': 'جار التحميل',
            
            // Contact Section
            'contact-title': 'تواصل <span>معي!</span>',
            'contact-subtitle': 'أفكارك مهمة! سواء كانت لديك استفسارات أو ملاحظات أو مشاريع جديدة مثيرة في ذهنك، أنا كلي آذان صاغية. دعنا نتواصل ونحقق أفكارك!',
            'contact-name-placeholder': 'اسمك *',
            'contact-email-placeholder': 'البريد الإلكتروني *',
            'contact-subject-placeholder': 'الموضوع *',
            'contact-phone-placeholder': '+ رقم الهاتف',
            'contact-message-placeholder': 'رسالتك.. *',
            'contact-btn': 'إرسال الرسالة',
            'contact-mail-label': 'راسلني هنا:',
            'contact-call-label': 'اتصل بي على:'
        }
    };

    // Get language elements
    const languageToggles = document.querySelectorAll('.language-toggle');
    const languageDropdowns = document.querySelectorAll('.language-dropdown');

    // Initialize language from localStorage or default to 'en'
    let currentLang = localStorage.getItem('preferred-language') || 'en';
    updateLanguage(currentLang);

    // Toggle dropdown visibility
    languageToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all dropdowns
            languageDropdowns.forEach(d => d.classList.remove('show'));
            languageToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
            
            // Toggle current dropdown
            if (!isExpanded) {
                dropdown.classList.add('show');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Handle language selection
    languageDropdowns.forEach(dropdown => {
        dropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                
                if (lang && translations[lang]) {
                    currentLang = lang;
                    updateLanguage(lang);
                    localStorage.setItem('preferred-language', lang);
                    
                    // Close dropdowns
                    languageDropdowns.forEach(d => d.classList.remove('show'));
                    languageToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
                    
                    // Add animation feedback
                    document.body.style.opacity = '0.95';
                    setTimeout(() => {
                        document.body.style.opacity = '1';
                    }, 150);
                }
            });
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        languageDropdowns.forEach(d => d.classList.remove('show'));
        languageToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
    });

    /**
     * Update all translatable elements on the page
     */
    function updateLanguage(lang) {
        const langMap = {
            'en': 'EN',
            'fr': 'FR',
            'ar': 'AR'
        };

        // Update language toggle text
        document.querySelectorAll('.selected-lang').forEach(el => {
            el.textContent = langMap[lang] || 'EN';
        });

        // Update document language attribute
        document.documentElement.setAttribute('lang', lang);
        
        // Apply RTL for Arabic
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl');
        }

        // Update all elements with data-lang-key attribute
        const trans = translations[lang];
        if (!trans) return;

        // Navigation
        updateElement('home-nav', trans['nav-home']);
        updateElement('about-nav', trans['nav-about']);
        updateElement('skills-nav', trans['nav-skills']);
        updateElement('portfolio-nav', trans['nav-portfolio']);
        updateElement('services-nav', trans['nav-services']);
        updateElement('contact-nav', trans['nav-contact']);

        // Hero section
        updateElementByClass('greeting', trans['hero-greeting']);
        updateElementByClass('name', trans['hero-name']);
        updateElementByClass('title', trans['hero-title']);
        updateElementBySelector('.hero-text .description', trans['hero-description']);
        updateElementByClass('tagline', trans['hero-tagline']);
        
        // CTA buttons - update text only, not entire HTML (to preserve icons)
        const hireMeBtn = document.querySelector('.btn-primary');
        if (hireMeBtn) hireMeBtn.childNodes[0].textContent = trans['hero-cta-hire'];
        
        // About section
        updateElementByClass('about-title', trans['about-title'], true);
        updateElementByClass('about-text', trans['about-subtitle']);
        updateElementByClass('about-role', trans['about-role'], true);
        updateElementBySelector('.about-content .description', trans['about-description']);
        updateElementByClass('about-cta', trans['about-cta'], true);
        
        // About highlights
        const aboutHighlights = document.querySelectorAll('.about-highlights li');
        aboutHighlights.forEach((highlight, index) => {
            const strong = highlight.querySelector('strong');
            const span = highlight.querySelector('span');
            const num = index + 1;
            
            if (strong && trans[`about-highlight-${num}-title`]) {
                strong.textContent = trans[`about-highlight-${num}-title`];
            }
            if (span && trans[`about-highlight-${num}-desc`]) {
                span.textContent = trans[`about-highlight-${num}-desc`];
            }
        });
        
        // Experience Stats
        const statBoxes = document.querySelectorAll('.experience-stats .stat-box p');
        if (statBoxes.length >= 3) {
            statBoxes[0].textContent = trans['stat-clients'];
            statBoxes[1].textContent = trans['stat-projects'];
            statBoxes[2].textContent = trans['stat-experience'];
        }
        
        // Skills Section
        updateElementByClass('skills-title', trans['skills-title'], true);
        updateElementByClass('skills-text', trans['skills-subtitle']);
        
        // Portfolio Section
        updateElementByClass('portfolio-title', trans['portfolio-title'], true);
        updateElementByClass('portfolio-text', trans['portfolio-subtitle']);
        
        // Portfolio filters
        const filterItems = document.querySelectorAll('.project-filter .filter-item');
        if (filterItems.length >= 4) {
            filterItems[0].textContent = trans['portfolio-filter-all'];
            filterItems[1].textContent = trans['portfolio-filter-webdev'];
            filterItems[2].textContent = trans['portfolio-filter-data'];
            filterItems[3].textContent = trans['portfolio-filter-design'];
        }
        
        // Services Section
        updateElementByClass('services-title', trans['services-title'], true);
        updateElementByClass('services-text', trans['services-subtitle']);
        
        // Service cards
        const serviceBoxes = document.querySelectorAll('.service-box');
        serviceBoxes.forEach((box, index) => {
            const serviceTitle = box.querySelector('.service-title');
            const serviceDesc = box.querySelector('.service-description');
            const serviceNum = index + 1;
            
            if (serviceTitle && trans[`service-${serviceNum}-title`]) {
                serviceTitle.textContent = trans[`service-${serviceNum}-title`];
            }
            if (serviceDesc && trans[`service-${serviceNum}-desc`]) {
                serviceDesc.textContent = trans[`service-${serviceNum}-desc`];
            }
        });

        // Contact section
        updateElementByClass('contact-title', trans['contact-title'], true);
        updateElementByClass('contact-text', trans['contact-subtitle']);
        
        // Contact form placeholders
        const nameInput = document.querySelector('input[name="customerName"]');
        const emailInput = document.querySelector('input[name="customerEmail"]');
        const subjectInput = document.querySelector('input[name="customerSubject"]');
        const phoneInput = document.querySelector('input[name="customerPhone"]');
        const messageInput = document.querySelector('textarea[name="customerMessage"]');
        
        if (nameInput) nameInput.placeholder = trans['contact-name-placeholder'];
        if (emailInput) emailInput.placeholder = trans['contact-email-placeholder'];
        if (subjectInput) subjectInput.placeholder = trans['contact-subject-placeholder'];
        if (phoneInput) phoneInput.placeholder = trans['contact-phone-placeholder'];
        if (messageInput) messageInput.placeholder = trans['contact-message-placeholder'];
        
        // Contact button
        const contactBtn = document.querySelector('#contactbtn .btn-text');
        if (contactBtn) contactBtn.textContent = trans['contact-btn'];
        
        // Footer
        const footerLeft = document.querySelector('.footer-left');
        if (footerLeft) {
            footerLeft.innerHTML = `${trans['footer-made']} <span class="heart">❤️</span> ${trans['footer-by']} <span class="me">imsabbar</span>`;
        }
        
        const footerRight = document.querySelector('.footer-right');
        if (footerRight) {
            const year = new Date().getFullYear();
            footerRight.innerHTML = `&copy; ${year} Ismail Sabbar. ${trans['footer-rights']}`;
        }
        
        // Loading text
        const loadingText = document.querySelector('#loadingText');
        if (loadingText) loadingText.textContent = trans['loading-text'];
        
        // Download Resume button
        const resumeBtn = document.querySelector('.btn-secondary');
        if (resumeBtn) {
            const icon = resumeBtn.querySelector('i');
            if (icon) {
                resumeBtn.innerHTML = `${trans['hero-cta-resume']} `;
                resumeBtn.appendChild(icon);
            } else {
                resumeBtn.textContent = trans['hero-cta-resume'];
            }
        }
    }

    /**
     * Helper functions to update elements
     */
    function updateElement(id, text, allowHTML = false) {
        const element = document.getElementById(id);
        if (element) {
            if (allowHTML) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    }

    function updateElementByClass(className, text, allowHTML = false) {
        const element = document.querySelector('.' + className);
        if (element) {
            if (allowHTML) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    }

    function updateElementBySelector(selector, text, allowHTML = false) {
        const element = document.querySelector(selector);
        if (element) {
            if (allowHTML) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    }
});
