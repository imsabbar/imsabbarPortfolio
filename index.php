<?php
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

?>




<!DOCTYPE html>
<html lang="en">
    <head>
        <title>ISMAIL SABBAR - Portfolio | Full Stack Web Developer & Data Analyst</title>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="title" content="Ismail Sabbar - Portfolio | Full Stack Web Developer, Data Analyst, and Web Scraper">
        <meta name="description" content="Explore the portfolio of Ismail Sabbar (imsabbar) – a Full Stack Web Developer, Data Analyst, and Web Scraper. Expert in web development, data analysis, and automation. Skilled in programming languages, CMS platforms like WordPress with Elementor, and web scraping solutions.">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <meta name="robots" content="index, follow">
        <meta name="language" content="English">
        <meta name="author" content="Ismail Sabbar">
        <meta name="keywords" content="Ismail Sabbar, إسماعيل صبار, sabbar portfolio, ismail portfolio, imsabbar profile, full stack developer, web scraping expert, automation specialist, WordPress developer, Laravel expert, SEO consultant, digital solutions, software engineer, web development services, full stack web developer freelancer">
        
        <meta property="og:title" content="Ismail Sabbar - Portfolio | Full Stack Web Developer & Data Analyst">
        <meta property="og:description" content="Discover the work of Ismail Sabbar (imsabbar) – a Full Stack Web Developer, Data Analyst, and Web Scraper. Specializing in custom web development, data processing, and automation.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://imsabbar.space">
        <meta property="og:image" content="https://imsabbar.space/assets/images/imsabbarProfile.jpeg">
        
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Ismail Sabbar - Portfolio | Full Stack Web Developer & Data Analyst">
        <meta name="twitter:description" content="Explore the portfolio of Ismail Sabbar (imsabbar), a skilled Full Stack Web Developer, Data Analyst, and Web Scraper.">
        <meta name="twitter:image" content="https://imsabbar.space/assets/images/imsabbarProfile.jpeg">


        <!-- robots meta tag-->
        <meta href="https://imsabbar.space" rel="canonical" /> 

        <!-- for logo-->
        <link rel="icon" type="image/x-icon" href="assets/images/imsabbarFav.ico">
        <link rel="shortcut icon" type="image/x-icon" href="assets/images/imsabbarFav.ico">
        <link rel="apple-touch-icon" href="assets/images/imsabbarFav.ico">


        
        <!-- Styling links -->
        <link rel="preload" href="assets/css/loading.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="preload" href="assets/css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="stylesheet" href="assets/css/about.css">
        <link rel="stylesheet" href="assets/css/skills.css">
        <link rel="stylesheet" href="assets/css/portfolio.css">
        <link rel="stylesheet" href="assets/css/services.css">
        <link rel="stylesheet" href="assets/css/contact.css">
        <link rel="stylesheet" href="assets/css/scroll.css">
        <link rel="preload" href="assets/css/header.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="stylesheet" href="assets/css/intersectionObserverTest.css">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <script src="https://kit.fontawesome.com/e1b17f703d.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">


        <!-- google fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;1,100;1,300;1,400;1,700&display=swap" rel="stylesheet">
    


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
            <a href="<?php echo proper_url(); ?>" class="logo">
                <h2><span>Im</span>Sabbar<span>.</span></h2>
            </a>
            
            <div class="header-menu">
                <div class="navLinks">
                    <nav>
                        <ul>
                            <li><a href="#home" id="home-nav-click" class="active">Home</a></li>
                            <li><a href="#about" id = "about-nav-click" >About</a>
                            <li><a href="#skills" id = "myCart-nav-click" >Skills</a></li>
                            <li><a href="#portfolio" id = "license-nav-click">Portfolio</a>
                            <li><a href="#services" id = "blog-nav-click" >Services</a></li>
                            <li><a href="#contact" id = "contact-nav-click" >Contact</a>  </li>
                        </ul>        
                    </nav>
                </div>

                <!-- 
                <div class="language">
                    <div class="selected-lang">
                        English
                    </div>

                    <ul>
                        <li>
                            <a href="#">English</a>
                        </li>

                        <li>
                            <a href="#">French</a>
                        </li>

                        <li>
                            <a href="#">Arabic</a>
                        </li>
                    </ul>
                </div> -->

                <button class="hamburger" name="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>




        <!-- The Home section -->
        <section id="home">
            <div class="container">

                <div class="content-left-bar">
                    <div class="social">
                        <a class="social-link linkedin" href="https://www.linkedin.com/in/sabbarismail/" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
                        <a class="social-link github" href="https://github.com/imsabbar" target="_blank"><i class="fa-brands fa-github"></i></a>
                        <a class="social-link youtube" href="https://www.youtube.com/@imsabbar" target="_blank"><i class="fa-brands fa-youtube"></i></a>
                        <a class="social-link facebook" href="https://facebook.com/imsabbar" target="_blank"><i class="fa-brands fa-facebook"></i></a>
                        <a class="social-link instagram" href="https://instagram.com/im_sabbar" target="_blank"><i class="fab fa-instagram"></i></a>
                        <a class="social-link telegram" href="https://t.me/imsabbar" target="_blank"><i class="fab fa-telegram"></i></a>
                        <a class="social-link whatsapp" href="https://wa.me/212681510095" target="_blank" name="whatsapp"><i class="fa-brands fa-whatsapp"></i></a>
                        <a class="social-link mail" href="mailto:hello@imsabbar.space"><i class="fa-solid fa-envelope"></i></a>
                    </div>
                </div>
    
                <div class="content-right-bar">
                    <div class="dot-map">
                        <a href="#home" class="dot activeExpand"><span class="activeColor"></span></a>
                        <a href="#about" class="dot"><span></span></a>
                        <a href="#skills" class="dot"><span></span></a>
                        <a href="#portfolio" class="dot"><span></span></a>
                        <a href="#services" class="dot"><span></span></a>
                        <a href="#contact" class="dot"><span></span></a>
                    </div>
                </div>
    
                <div class="middle-content">
                    <div class="content">
                        
                        <div class="left">
                            <h3 class="greeting">Greetings and welcome to my PORTFOLIO!</h3>
        
                            <h2 class="name">Ismail Sabbar</h2>
                            <h2 class="field">Full Stack WEB Developer - Data Analyst</span></h2>
                            <!-- <h1 class="field">Data Analyst</h1> -->
        
                            <p class="description">As a passionate freelance web developer, I create captivating web experiences. With 7 years of full-stack expertise, I'm dedicated to achieving digital excellence in every unique project journey.</p>
                            
                            <div class="actions">   
                                <a href="mailto:hello@imsabbar.space" class="hire" target="_blank">Hire Me</a>
                                <a class="resume" href="assets/files/imsabbarspace-MEN.pdf" download target="_blank">Download My Resume <i class="fa-solid fa-download"></i></a>
                                <h2 class="quote">Your Vision is My Expertise</h2>
                            </div>
                        </div>


                        <div class="right">
                            <div class="home-profile">
                                <img src="assets/images/myprofile.jpeg" alt="">
                            </div>
                        </div>
                    </div>
                </div>


                <div class="scroll-down">
                    <a href="#about" class="down-icon"><i class="fa-solid fa-chevron-down"></i></a>
                </div>
            </div>
        </section>



        <!-- The About section -->
        <section id="about">

            <h1 class="about-title">About <span>Me!</span></h1>
            <p class="about-text">Helping brands thrive in the dynamic digital world with innovative and captivating web experiences that leave a lasting impact.</p>


            <div class="container">

                
                <div class="right">
        
                    <h2>Full Stack WEB Developer <span>& </span><br>Data Analyst</h2>
                    
                    <p class="description">
                        With a passion and purpose for coding, I am a Full Stack Web Developer specializing in crafting dynamic and interactive websites that captivate users. With an eye for design and a flair for creativity, I breathe life into your digital vision, ensuring seamless user experiences that leave a lasting impact. My expertise lies in engineering dynamic websites that adapt and engage across various devices and screen sizes, catering to your audience's needs. By adding my proficiency in web analytics and SEO optimization, your online presence will thrive in the competitive digital landscape. Let's embark on an exciting web development journey, where creativity and technical prowess converge to create exceptional online experiences.
                    </p>
    
    
                    <div class="experience">
                        <div class="tab">
                            <i class="icon fa-solid fa-people-group"></i>
                            <h3 class="expValue" data-val="63">00</h3>
                            <p>Satistified Clients</p>
                        </div>
                        <div class="tab">
                            <i class="icon fa-solid fa-clipboard-check"></i>
                            <h3 class="expValue" data-val="84">00</h3>
                            <p>Completed Projects</p>
                        </div>
                        
                        <div class="tab">
                            <i class="icon fa-solid fa-fire-flame-curved"></i>
                            <h3 class="expValue" data-val="07">00</h3>
                            <p>Years of Experience</p>
                        </div>
                    </div>
                </div>
                
                <div class="left">
                    <img src="assets/images/mypic0000.png" alt="my profile picture" class="myProfile">
                </div>

            </div>
            
        </section>




        <!-- The skills section -->
        <section id="skills">
            <h2 class="skills-title">My <span>Skills</span></h2>
            <p class="skills-text">Empowering Your Digital Journey: A Skillful Toolkit Customized to Fit Your Project's Demands and Aspirations</p>

            <div class="technical-skills">

                <div class="left">

                    <div class="container">
    
                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/html5.png" alt="HTML 5 Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">HTML5</p>     
                                </div>
    
                                <div class="skill-progress html5"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/css3.png" alt="CSS3 Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">CSS3</p>     
                                </div>
    
                                <div class="skill-progress css3"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/js.png" alt="JavaScript Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">JavaScript</p>     
                                </div>
    
                                <div class="skill-progress js"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/jquery.png" alt="JQuery Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">JQuery</p>     
                                </div>
    
                                <div class="skill-progress jquery"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/ajax.png" alt="Ajax Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">Ajax</p>     
                                </div>
    
                                <div class="skill-progress ajax"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/php.png" alt="PHP Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">PHP</p>     
                                </div>
    
                                <div class="skill-progress php"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/mysql.png" alt="MySQL Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">MySQL</p>     
                                </div>
    
                                <div class="skill-progress mysql"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/mongo.png" alt="mongodb Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">MongoDB</p>     
                                </div>
    
                                <div class="skill-progress mongodb"><span></span></div>
                            </div>
                        </div>

                        <div class="skill">
                            <div class="icon">
                                <img src="./assets/images/laravel logo.jpg" alt="laravel Logo">
                            </div>
    
                            <div class="info">
                                <div class="skill-info">
                                    <p class="subject">Laravel</p>     
                                </div>
    
                                <div class="skill-progress laravel"><span></span></div>
                            </div>
                        </div>
                    </div>
                </div>
    



                <div class="right">

                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/wordpress.png" alt="Wordpress Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">Wordpress</p>     
                            </div>

                            <div class="skill-progress wordpress"><span></span></div>
                        </div>
                    </div>

                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/woocommerce.png" alt="woocomerce Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">Woocomerce</p>     
                            </div>

                            <div class="skill-progress woocomerce"><span></span></div>
                        </div>
                    </div>

                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/git.png" alt="GIT Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">GIT</p>     
                            </div>

                            <div class="skill-progress git"><span></span></div>
                        </div>
                    </div>

                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/github.png" alt="Github Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">Github</p>     
                            </div>

                            <div class="skill-progress github"><span></span></div>
                        </div>
                    </div>

                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/react logo.png" alt="react Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">React</p>     
                            </div>

                            <div class="skill-progress react"><span></span></div>
                        </div>
                    </div>

                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/python.png" alt="Python Logo" >
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">Python</p>     
                            </div>

                            <div class="skill-progress python"><span></span></div>
                        </div>
                    </div>

                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/java-logo-1.png" alt="Java Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">Java POO</p>     
                            </div>

                            <div class="skill-progress java"><span></span></div>
                        </div>
                    </div>


                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/R.png" alt="R language Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">R</p>     
                            </div>

                            <div class="skill-progress R"><span></span></div>
                        </div>
                    </div>


                    <div class="skill">
                        <div class="icon">
                            <img src="./assets/images/jupyter logo.png" alt="jupyter notebook tool Logo">
                        </div>

                        <div class="info">
                            <div class="skill-info">
                                <p class="subject">Jupyter Notebook</p>     
                            </div>

                            <div class="skill-progress jupyter"><span></span></div>
                        </div>
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
                        <img src="assets/images/jana_thumbnail.jpg" alt="this is a picture of project" class="project-img">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.space" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">Janna Puzzle</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/digiprod_thumbnail.jpg" alt="this is a picture of project" class="project-img">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.space" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">digiProd</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/pso-thumbnail.jpg" alt="this is a picture of project" class="project-img">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.space" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">PSO</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/marketing_thumbnail.jpg" alt="this is a picture of project" class="project-img">
                        
                        <div class="info-hover">
                            <h4 class="field">Web Developement</h4>
                            <a href="https://.imsabbar.space" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">Marketing Agency</h4>
                        </div>
                    </div>
                </div>


                <div class="project-box webDev">
                    <div class="project-preview">
                        <img src="assets/images/unbranded_thumbnail.jpg" alt="this is a picture of project" class="project-img">
                        
                        <div class="info-hover">
                            <h4 class="field">web design</h4>
                            <a href="https://.imsabbar.space" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">Unbranded Cosmetics</h4>
                        </div>
                    </div>
                </div>



                <!-- data -->
                <div class="project-box data">
                    <div class="project-preview">
                        <img src="assets/images/data2.jpg" alt="this is a picture of project" class="project-img">
                        
                        <div class="info-hover">
                            <h4 class="field">data project</h4>
                            <a href="https://.imsabbar.space" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
                            <h4 class="project-name">R Data Analyst</h4>
                        </div>
                    </div>
                </div>

                <div class="project-box data">
                    <div class="project-preview">
                        <img src="assets/images/data1.png" alt="this is a picture of project" class="project-img">
                        
                        <div class="info-hover">
                            <h4 class="field">data project</h4>
                            <a href="https://.imsabbar.space" class="link" target="_blank"><i class="icon fa-solid fa-eye"></i></a>
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

                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-mobile-button"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Responsive Design</h3>
                        <p class="service-description">Create websites that seamlessly adapt to various devices and screen sizes, ensuring a consistent and user-friendly experience.</p>
                    </div>
                </div>

                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-code"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Front-End Development</h3>
                        <p class="service-description">Leverage expertise in HTML5, CSS3, and JavaScript to craft engaging and interactive user interfaces.</p>
                    </div>
                </div>

                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-server"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Back-End Development</h3>
                        <p class="service-description">Building the engine that powers your website or application, ensuring seamless data management and dynamic functionality.</p>
                    </div>
                </div>


                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-laptop-code"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Web Performance Optimization</h3>
                        <p class="service-description">Enhance website speed and efficiency using techniques like caching, image optimization, and minimizing load times.</p>
                    </div>
                </div>

                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-file-code"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Clean Code</h3>
                        <p class="service-description">Develop well-structured, organized, and easily maintainable code adhering to industry best practices.</p>
                    </div>
                </div>

                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-gauge"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Basic SEO Optimization</h3>
                        <p class="service-description">Optimize websites for search engines through proper HTML semantics, meta tags, and keyword placement to improve visibility and rankings.</p>
                    </div>
                </div>



                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-brands fa-python"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Web Scraping</h3>
                        <p class="service-description">Building the engine that powers your website or application, ensuring seamless data management and dynamic functionality.</p>
                    </div>
                </div>


                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-chart-pie"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Data Visualization</h3>
                        <p class="service-description">Create compelling visual representations of data using Python libraries, transforming complex information into clear insights.</p>
                    </div>
                </div>



                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-blog"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Guest Blogging</h3>
                        <p class="service-description">Develop engaging and informative guest blog posts, showcasing the ability to write compelling content that resonates with audiences.</p>
                    </div>
                </div>


                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-magnifying-glass-chart"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Marketing Analytics and Reporting</h3>
                        <p class="service-description">Analyze website traffic, user behavior, and marketing campaigns, delivering actionable insights through data-driven reports.</p>
                    </div>
                </div>


                <div class="service-box">
                    <div class="service-icon"><i class="icon fa-solid fa-gear"></i></div>

                    <div class="service-content">
                        <h3 class="service-title">Hosting Services</h3>
                        <p class="service-description">Seamlessly manage and host your website for optimal performance, security, and accessibility. Focus on your content while I handle the technical details.</p>
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
                    <form action="includes/contact.inc.php" method = "project" enctype="multipart/form-data">
    
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
    
                        <div class="inputBox btn">
                            <button id="contactbtn" type="submit" name="submit" >Send Message</button>
                        </div>
                    </form>
    
                </div>
    
    
                <div class="contactList">
                    <div class="list">
                        <div class="icon">
                            <a href="mailto:hello@imsabbar.space" target="_blank"><i class="fa-regular fa-envelope"></i></a>
                        </div>
                        <div class="info">
                            <h2>Mail me here:</h2>
                            <a href="mailto:hello@imsabbar.online" target="_blank">hello@imsabbar.space</a>
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
            <a href="#home">Made with LOVE by &nbsp;<span class="me">imsabbar</span></a>
        </footer>


        <!-- This is  GO UP -->
        <div id="progress">
            <i id="progress-value" class="fa-solid fa-arrow-up"></i>
        </div>


        <!-- Scripts Files -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" ></script>
        <script type="text/javascript" src="assets/js/loading.js"></script>
        <script type="text/javascript" src="assets/js/script.js"></script>
        <script type="text/javascript" src="assets/js/projFilter.js"></script>
        <script type="text/javascript" src="assets/js/scrollAnimation.js"></script>
        <script type="text/javascript" src="assets/js/textAnimation.js"></script>
        <script type="text/javascript" src="assets/js/aboutExperience.js"></script>
        <script type="text/javascript" src="assets/js/intersectionObserverTest.js"></script>

    </body>
</html>
