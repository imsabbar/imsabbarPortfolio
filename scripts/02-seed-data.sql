-- =================================================================
-- Portfolio Seed Data — Full EN / FR / AR i18n
-- Idempotent for tables with UNIQUE slug/section_key.
-- FAQ has no unique key: run once, or delete existing FAQ rows first.
-- =================================================================

SET NAMES utf8mb4;

-- -----------------------------------------------------------------
-- Content blocks
-- -----------------------------------------------------------------
INSERT INTO portfolio_content_blocks (section_key, content_i18n) VALUES
('hero', JSON_OBJECT(
  'en', JSON_OBJECT(
    'headline', 'Full Stack Developer & Automation Engineer',
    'subhead', 'As a passionate full-stack developer and automation engineer, I craft powerful web solutions and intelligent automation systems. With 10+ years of expertise in web development, n8n automation, and custom integrations, I transform complex challenges into streamlined digital solutions.',
    'cta_work', 'See My Work',
    'cta_book', 'Book a Call',
    'spec_chips', JSON_ARRAY('n8n Automation', 'Perfex CRM', 'Next.js & Laravel'),
    'availability_message', 'Available for Q3 Enterprise Projects & Automation Audits'
  ),
  'fr', JSON_OBJECT(
    'headline', 'Développeur Full-Stack & Ingénieur Automatisation',
    'subhead', 'Passionné de développement full-stack et d''automatisation, je conçois des solutions web performantes et des systèmes d''automatisation intelligents. Fort de plus de 10 ans d''expérience en développement web, automatisation n8n et intégrations sur mesure, je transforme les défis complexes en solutions digitales simples.',
    'cta_work', 'Voir mes réalisations',
    'cta_book', 'Réserver un appel',
    'spec_chips', JSON_ARRAY('Automatisation n8n', 'Perfex CRM', 'Next.js & Laravel'),
    'availability_message', 'Disponible pour des projets d''entreprise et des audits d''automatisation au T3'
  ),
  'ar', JSON_OBJECT(
    'headline', 'مطوّر Full-Stack ومهندس أتمتة',
    'subhead', 'بصفتي مطوّرًا شغوفًا بالويب ومهندس أتمتة، أصمم حلول ويب قوية وأنظمة أتمتة ذكية. بخبرة تتجاوز 10 سنوات في تطوير الويب وأتمتة n8n والتكاملات المخصصة، أحوّل التحديات المعقدة إلى حلول رقمية مبسّطة.',
    'cta_work', 'شاهد أعمالي',
    'cta_book', 'احجز مكالمة',
    'spec_chips', JSON_ARRAY('أتمتة n8n', 'Perfex CRM', 'Next.js & Laravel'),
    'availability_message', 'متاح للمشاريع المؤسسية وتدقيق الأتمتة للربع الثالث'
  )
)),
('trust_bar', JSON_OBJECT(
  'en', JSON_OBJECT('badge', 'Registered Independent Engineer · Official B2B Invoicing Available'),
  'fr', JSON_OBJECT('badge', 'Ingénieur indépendant enregistré · Facturation B2B officielle disponible'),
  'ar', JSON_OBJECT('badge', 'مهندس مستقل مسجّل · فوترة B2B رسمية متاحة')
)),
('about', JSON_OBJECT(
  'en', JSON_OBJECT(
    'body', 'With 10+ years of hands-on experience, I specialize in building powerful digital solutions that transform businesses. I bridge operational bottlenecks with clean software engineering, crafting n8n workflows, custom Perfex CRM modules, web scraping pipelines, and high-speed web applications.',
    'principles', JSON_ARRAY('Full-Stack Web Development', 'Workflow Automation', 'Custom Business Solutions', 'Data-Driven Insights'),
    'stats_years_label', 'Years of Experience',
    'stats_clients_label', 'Satisfied Clients',
    'stats_projects_label', 'Completed Projects'
  ),
  'fr', JSON_OBJECT(
    'body', 'Avec plus de 10 ans d''expérience concrète, je suis spécialisé dans la création de solutions digitales puissantes qui transforment les entreprises. Je comble les goulots d''étranglement opérationnels grâce à une ingénierie logicielle propre, en créant des workflows n8n, des modules Perfex CRM sur mesure, des pipelines de scraping et des applications web ultra-rapides.',
    'principles', JSON_ARRAY('Développement web full-stack', 'Automatisation des workflows', 'Solutions métier sur mesure', 'Analyses basées sur les données'),
    'stats_years_label', 'Années d''expérience',
    'stats_clients_label', 'Clients satisfaits',
    'stats_projects_label', 'Projets livrés'
  ),
  'ar', JSON_OBJECT(
    'body', 'بخبرة عملية تتجاوز 10 سنوات، أتخصص في بناء حلول رقمية قوية تُحدث تحوّلًا في الأعمال. أعالج الاختناقات التشغيلية بهندسة برمجية نظيفة، من خلال أتمتة n8n ووحدات Perfex CRM المخصصة وخطوط جمع البيانات وتطبيقات الويب عالية الأداء.',
    'principles', JSON_ARRAY('تطوير الويب الشامل', 'أتمتة سير العمل', 'حلول أعمال مخصصة', 'رؤى مبنية على البيانات'),
    'stats_years_label', 'سنوات الخبرة',
    'stats_clients_label', 'عملاء راضون',
    'stats_projects_label', 'مشاريع مُنجزة'
  )
)),
('contact', JSON_OBJECT(
  'en', JSON_OBJECT('title', 'Start a Project', 'body', 'Discuss an automation pipeline, CRM module, or web build directly with the engineer who ships it.'),
  'fr', JSON_OBJECT('title', 'Démarrer un projet', 'body', 'Discutez d''un pipeline d''automatisation, d''un module CRM ou d''un site web directement avec l''ingénieur qui le livre.'),
  'ar', JSON_OBJECT('title', 'ابدأ مشروعك', 'body', 'ناقش خط أتمتة أو وحدة CRM أو موقع ويب مباشرة مع المهندس الذي ينفّذه.')
)),
('footer', JSON_OBJECT(
  'en', JSON_OBJECT('rights', 'Ismail Sabbar — All rights reserved.', 'tagline', 'Engineered with care. Shipped with intent.'),
  'fr', JSON_OBJECT('rights', 'Ismail Sabbar — Tous droits réservés.', 'tagline', 'Conçu avec soin. Livré avec intention.'),
  'ar', JSON_OBJECT('rights', 'إسماعيل صبار — جميع الحقوق محفوظة.', 'tagline', 'صُنع بعناية. ووُصل باحتراف.')
))
ON DUPLICATE KEY UPDATE content_i18n = VALUES(content_i18n);

-- -----------------------------------------------------------------
-- Services (9)
-- -----------------------------------------------------------------
INSERT INTO portfolio_services (slug, title, title_i18n, category, category_i18n, description, description_i18n, icon_name, is_active, sort_order) VALUES
('full-stack-web-development', 'Full Stack Web Development', JSON_OBJECT('en','Full Stack Web Development','fr','Développement Web Full-Stack','ar','تطوير الويب الشامل'), 'Web Engineering', JSON_OBJECT('en','Web Engineering','fr','Ingénierie Web','ar','هندسة الويب'), 'End-to-end web application development with modern frameworks.', JSON_OBJECT('en','End-to-end web application development with modern frameworks.','fr','Développement complet d''applications web avec des frameworks modernes.','ar','تطوير تطبيقات ويب متكاملة باستخدام أطر عمل حديثة.'), 'code', 1, 0),
('workflow-automation-integration', 'Workflow Automation & Integration', JSON_OBJECT('en','Workflow Automation & Integration','fr','Automatisation & Intégration des Workflows','ar','أتمتة وتكامل سير العمل'), 'Automation Engineering', JSON_OBJECT('en','Automation Engineering','fr','Ingénierie d''Automatisation','ar','هندسة الأتمتة'), 'n8n automation workflows connecting APIs, automating repetitive tasks, and integrating business systems.', JSON_OBJECT('en','n8n automation workflows connecting APIs, automating repetitive tasks, and integrating business systems.','fr','Workflows d''automatisation n8n connectant des API, automatisant les tâches répétitives et intégrant les systèmes métier.','ar','أتمتة سير العمل عبر n8n لربط واجهات API وتشغيل المهام المتكررة ودمج أنظمة الأعمال.'), 'zap', 1, 1),
('custom-crm-development', 'Custom CRM Development & Modules', JSON_OBJECT('en','Custom CRM Development & Modules','fr','Développement CRM & Modules Sur Mesure','ar','تطوير CRM ووحدات مخصصة'), 'CRM Solutions', JSON_OBJECT('en','CRM Solutions','fr','Solutions CRM','ar','حلول CRM'), 'Build and customize CRM systems with tailored modules, integrations, and workflows.', JSON_OBJECT('en','Build and customize CRM systems with tailored modules, integrations, and workflows.','fr','Construire et personnaliser des systèmes CRM avec des modules, intégrations et workflows sur mesure.','ar','بناء وتخصيص أنظمة CRM بوحدات وتكاملات وسير عمل مخصصة.'), 'briefcase', 1, 2),
('wordpress-plugin-development', 'Custom WordPress Plugin Development', JSON_OBJECT('en','Custom WordPress Plugin Development','fr','Développement de Plugins WordPress Sur Mesure','ar','تطوير إضافات ووردبريس مخصصة'), 'Web Engineering', JSON_OBJECT('en','Web Engineering','fr','Ingénierie Web','ar','هندسة الويب'), 'Custom WordPress plugins tailored to your specific needs, built to scale and integrate seamlessly.', JSON_OBJECT('en','Custom WordPress plugins tailored to your specific needs, built to scale and integrate seamlessly.','fr','Des plugins WordPress sur mesure, conçus pour évoluer et s''intégrer parfaitement.','ar','إضافات ووردبريس مخصصة لاحتياجاتك، مصممة للتوسع والتكامل بسلاسة.'), 'layers', 1, 3),
('web-scraping-data-extraction', 'Web Scraping & Data Extraction', JSON_OBJECT('en','Web Scraping & Data Extraction','fr','Web Scraping & Extraction de Données','ar','جمع واستخراج بيانات الويب'), 'Data & Automation', JSON_OBJECT('en','Data & Automation','fr','Données & Automatisation','ar','البيانات والأتمتة'), 'Automated data extraction from websites using Python. Collect, clean, and structure web data for business intelligence.', JSON_OBJECT('en','Automated data extraction from websites using Python. Collect, clean, and structure web data for business intelligence.','fr','Extraction automatisée de données depuis des sites web avec Python. Collecter, nettoyer et structurer les données pour la business intelligence.','ar','استخراج آلي للبيانات من المواقع باستخدام بايثون. جمع البيانات وتنظيفها وهيكلتها لذكاء الأعمال.'), 'terminal', 1, 4),
('api-development-integration', 'API Development & Integration', JSON_OBJECT('en','API Development & Integration','fr','Développement & Intégration d''API','ar','تطوير وتكامل واجهات API'), 'Web Engineering', JSON_OBJECT('en','Web Engineering','fr','Ingénierie Web','ar','هندسة الويب'), 'RESTful APIs and third-party service integration with payment gateways, social media, CRMs, and business tools.', JSON_OBJECT('en','RESTful APIs and third-party service integration with payment gateways, social media, CRMs, and business tools.','fr','APIs RESTful et intégration de services tiers : paiement, réseaux sociaux, CRM et outils métier.','ar','واجهات RESTful وتكامل الخدمات الخارجية مع بوابات الدفع ووسائل التواصل وأنظمة CRM وأدوات الأعمال.'), 'database', 1, 5),
('data-analysis-visualization', 'Data Analysis & Visualization', JSON_OBJECT('en','Data Analysis & Visualization','fr','Analyse & Visualisation de Données','ar','تحليل وتصوّر البيانات'), 'Data & Automation', JSON_OBJECT('en','Data & Automation','fr','Données & Automatisation','ar','البيانات والأتمتة'), 'Transform raw data into actionable insights with Python and interactive visualizations.', JSON_OBJECT('en','Transform raw data into actionable insights with Python and interactive visualizations.','fr','Transformez des données brutes en informations exploitables grâce à Python et des visualisations interactives.','ar','تحويل البيانات الخام إلى رؤى قابلة للتنفيذ باستخدام بايثون وتصوّرات تفاعلية.'), 'monitor', 1, 6),
('performance-optimization-seo', 'Performance Optimization & SEO', JSON_OBJECT('en','Performance Optimization & SEO','fr','Optimisation des Performances & SEO','ar','تحسين الأداء ومحركات البحث'), 'Web Engineering', JSON_OBJECT('en','Web Engineering','fr','Ingénierie Web','ar','هندسة الويب'), 'Speed up your website with advanced optimization and improve rankings through technical SEO.', JSON_OBJECT('en','Speed up your website with advanced optimization and improve rankings through technical SEO.','fr','Accélérez votre site avec des optimisations avancées et améliorez son référencement grâce au SEO technique.','ar','تسريع موقعك بتحسينات متقدمة وتحسين ترتيبه عبر تحسين محركات البحث التقني.'), 'rocket', 1, 7),
('database-design-management', 'Database Design & Management', JSON_OBJECT('en','Database Design & Management','fr','Conception & Gestion de Bases de Données','ar','تصميم وإدارة قواعد البيانات'), 'Data & Automation', JSON_OBJECT('en','Data & Automation','fr','Données & Automatisation','ar','البيانات والأتمتة'), 'Design, optimize, and manage databases. From schema design to query optimization.', JSON_OBJECT('en','Design, optimize, and manage databases. From schema design to query optimization.','fr','Concevoir, optimiser et gérer des bases de données, de la modélisation à l''optimisation des requêtes.','ar','تصميم قواعد البيانات وتحسينها وإدارتها، من تصميم المخطط إلى تحسين الاستعلامات.'), 'database', 1, 8)
ON DUPLICATE KEY UPDATE
  title_i18n = VALUES(title_i18n),
  category_i18n = VALUES(category_i18n),
  description_i18n = VALUES(description_i18n),
  icon_name = VALUES(icon_name), is_active = VALUES(is_active), sort_order = VALUES(sort_order);

-- -----------------------------------------------------------------
-- Pricing plans (3)
-- -----------------------------------------------------------------
INSERT INTO portfolio_plans (slug, title, title_i18n, badge, badge_i18n, price_mad, price_eur, price_usd, price_gbp, price_aed, billing_type, features_json, turnaround, turnaround_i18n, cta_type, is_popular, is_active, sort_order) VALUES
('n8n-automation-starter', 'n8n Workflow Automation', JSON_OBJECT('en','n8n Workflow Automation','fr','Automatisation de Workflows n8n','ar','أتمتة سير عمل n8n'), 'Popular for Teams', JSON_OBJECT('en','Popular for Teams','fr','Populaire pour les équipes','ar','شائع بين الفرق'), 4500, 450, 490, 390, 1800, 'one_time', JSON_OBJECT('en',JSON_ARRAY('Multi-app integration (CRM, Slack, Email, DB)','Custom webhook triggers & error alerts','Execution log telemetry & documentation','30-day post-launch support & warranty'),'fr',JSON_ARRAY('Intégration multi-applications (CRM, Slack, Email, DB)','Déclencheurs webhook et alertes d''erreur personnalisés','Télémétrie des journaux d''exécution et documentation','Support et garantie 30 jours après lancement'),'ar',JSON_ARRAY('تكامل متعدد التطبيقات (CRM وSlack والبريد وقاعدة البيانات)','مشغّلات webhook وتنبيهات أخطاء مخصصة','سجلات التنفيذ والتوثيق','دعم وضمان لمدة 30 يومًا بعد الإطلاق')), '3–5 Business Days', JSON_OBJECT('en','3–5 Business Days','fr','3 à 5 jours ouvrables','ar','من 3 إلى 5 أيام عمل'), 'wizard', 1, 1, 0),
('perfex-crm-module', 'Perfex CRM Module Build', JSON_OBJECT('en','Perfex CRM Module Build','fr','Module Perfex CRM Sur Mesure','ar','وحدة Perfex CRM مخصصة'), 'Enterprise B2B', JSON_OBJECT('en','Enterprise B2B','fr','B2B Entreprise','ar','B2B مؤسسي'), 8500, 850, 920, 740, 3400, 'one_time', JSON_OBJECT('en',JSON_ARRAY('Custom PHP/MySQL module development','Automated invoice & lead dispatch hooks','Custom client portal dashboard views','100% source code ownership & documentation'),'fr',JSON_ARRAY('Développement de module PHP/MySQL sur mesure','Hooks automatisés de facturation et de routage de leads','Vues personnalisées du portail client','Propriété du code source à 100 % et documentation'),'ar',JSON_ARRAY('تطوير وحدة PHP/MySQL مخصصة','ربط الفوترة وتوجيه العملاء آليًا','واجهات بوابة عميل مخصصة','ملكية كاملة للكود المصدري مع التوثيق')), '7–10 Business Days', JSON_OBJECT('en','7–10 Business Days','fr','7 à 10 jours ouvrables','ar','من 7 إلى 10 أيام عمل'), 'wizard', 0, 1, 1),
('fullstack-web-build', 'High-Speed Web Portal', JSON_OBJECT('en','High-Speed Web Portal','fr','Portail Web Haute Vitesse','ar','بوابة ويب عالية السرعة'), 'Complete Solution', JSON_OBJECT('en','Complete Solution','fr','Solution Complète','ar','حل متكامل'), 14000, 1400, 1500, 1200, 5500, 'one_time', JSON_OBJECT('en',JSON_ARRAY('Custom Next.js App Router build','Tailwind CSS & Framer Motion design','Multilingual i18n (EN / FR / AR)','Lighthouse 95+ performance guarantee'),'fr',JSON_ARRAY('Construction sur mesure avec Next.js App Router','Design Tailwind CSS & Framer Motion','i18n multilingue (EN / FR / AR)','Garantie de performance Lighthouse 95+'),'ar',JSON_ARRAY('بناء مخصص باستخدام Next.js App Router','تصميم Tailwind CSS وFramer Motion','دعم متعدد اللغات (EN / FR / AR)','ضمان أداء Lighthouse 95+')), '10–14 Business Days', JSON_OBJECT('en','10–14 Business Days','fr','10 à 14 jours ouvrables','ar','من 10 إلى 14 يوم عمل'), 'wizard', 0, 1, 2)
ON DUPLICATE KEY UPDATE
  title_i18n = VALUES(title_i18n), badge_i18n = VALUES(badge_i18n),
  features_json = VALUES(features_json), turnaround_i18n = VALUES(turnaround_i18n),
  is_popular = VALUES(is_popular), is_active = VALUES(is_active), sort_order = VALUES(sort_order);

-- -----------------------------------------------------------------
-- Case studies (7) — brief i18n translation, tech names kept as proper nouns
-- -----------------------------------------------------------------
INSERT INTO portfolio_case_studies (slug, title_i18n, summary_i18n, client_region_i18n, impact_metric_i18n, before_metric_i18n, after_metric_i18n) VALUES
('janna-puzzle', JSON_OBJECT('en','Janna Puzzle','fr','Janna Puzzle','ar','جانا بازل'), JSON_OBJECT('en','A playful brand web experience built for engagement and speed.','fr','Une expérience web de marque ludique, pensée pour l''engagement et la vitesse.','ar','تجربة ويب مرحة للعلامة التجارية مصممة للتفاعل والسرعة.'), JSON_OBJECT('en','Morocco','fr','Maroc','ar','المغرب'), JSON_OBJECT('en','Faster page loads and a cleaner mobile experience','fr','Chargement plus rapide et expérience mobile plus claire','ar','تحميل أسرع وتجربة موبايل أنظف'), JSON_OBJECT('en','Legacy layout','fr','Ancienne mise en page','ar','تخطيط قديم'), JSON_OBJECT('en','Modern responsive build','fr','Construction responsive moderne','ar','تصميم متجاوب حديث')),
('digiprod', JSON_OBJECT('en','digiProd','fr','digiProd','ar','ديجي برود'), JSON_OBJECT('en','Digital product showcase with streamlined browsing.','fr','Vitrine de produits numériques avec une navigation fluide.','ar','عرض منتجات رقمية بتصفح سلس.'), JSON_OBJECT('en','Morocco','fr','Maroc','ar','المغرب'), JSON_OBJECT('en','Improved conversion clarity','fr','Clarté de conversion améliorée','ar','وضوح أفضل في التحويل'), JSON_OBJECT('en','Static catalog','fr','Catalogue statique','ar','كتالوج ثابت'), JSON_OBJECT('en','Dynamic product experience','fr','Expérience produit dynamique','ar','تجربة منتج ديناميكية')),
('pso', JSON_OBJECT('en','PSO','fr','PSO','ar','PSO'), JSON_OBJECT('en','A professional services web presence focused on clarity and lead capture.','fr','Une présence web de services professionnels axée sur la clarté et la capture de leads.','ar','حضور ويب احترافي يركز على الوضوح وجذب العملاء.'), JSON_OBJECT('en','Morocco','fr','Maroc','ar','المغرب'), JSON_OBJECT('en','Higher quality inbound inquiries','fr','Demandes entrantes de meilleure qualité','ar','استفسارات واردة بجودة أعلى'), JSON_OBJECT('en','Unstructured contact flow','fr','Flux de contact non structuré','ar','تدفق تواصل غير منظم'), JSON_OBJECT('en','Structured lead flow','fr','Flux de leads structuré','ar','تدفق عملاء منظم')),
('marketing-agency', JSON_OBJECT('en','Marketing Agency','fr','Agence Marketing','ar','وكالة تسويق'), JSON_OBJECT('en','Agency site designed to communicate services at a glance.','fr','Un site d''agence conçu pour présenter les services en un coup d''œil.','ar','موقع وكالة مصمم لعرض الخدمات بوضوح سريع.'), JSON_OBJECT('en','Morocco','fr','Maroc','ar','المغرب'), JSON_OBJECT('en','Clearer service positioning','fr','Positionnement de services plus clair','ar','تحديد أوضح للخدمات'), JSON_OBJECT('en','Cluttered messaging','fr','Message confus','ar','رسائل غير واضحة'), JSON_OBJECT('en','Focused messaging','fr','Message ciblé','ar','رسائل مركّزة')),
('unbranded-cosmetics', JSON_OBJECT('en','Unbranded Cosmetics','fr','Cosmétiques Sans Marque','ar','مستحضرات تجميل'), JSON_OBJECT('en','Elegant product-first web design for a cosmetics brand.','fr','Un design web élégant axé produit pour une marque de cosmétiques.','ar','تصميم ويب أنيق يركز على المنتج لعلامة تجميل.'), JSON_OBJECT('en','Morocco','fr','Maroc','ar','المغرب'), JSON_OBJECT('en','Stronger brand presentation','fr','Présentation de marque plus forte','ar','تقديم أقوى للعلامة التجارية'), JSON_OBJECT('en','Generic template','fr','Modèle générique','ar','قالب عام'), JSON_OBJECT('en','Custom brand experience','fr','Expérience de marque personnalisée','ar','تجربة علامة مخصصة')),
('r-data-analyst', JSON_OBJECT('en','R Data Analyst','fr','Analyste de Données R','ar','محلل بيانات R'), JSON_OBJECT('en','Data analysis project turning raw datasets into actionable reports.','fr','Projet d''analyse de données transformant des jeux de données bruts en rapports exploitables.','ar','مشروع تحليل بيانات يحوّل مجموعات البيانات الخام إلى تقارير قابلة للتنفيذ.'), JSON_OBJECT('en','Morocco','fr','Maroc','ar','المغرب'), JSON_OBJECT('en','Faster insight generation','fr','Génération d''insights plus rapide','ar','إنتاج أسرع للرؤى'), JSON_OBJECT('en','Manual reporting','fr','Reporting manuel','ar','تقارير يدوية'), JSON_OBJECT('en','Automated analysis','fr','Analyse automatisée','ar','تحليل آلي')),
('python-data-analyst', JSON_OBJECT('en','Python Data Analyst','fr','Analyste de Données Python','ar','محلل بيانات بايثون'), JSON_OBJECT('en','Python-based data pipeline and visualization project.','fr','Projet de pipeline de données et de visualisation basé sur Python.','ar','مشروع خط بيانات وتصوّر يعتمد على بايثون.'), JSON_OBJECT('en','Morocco','fr','Maroc','ar','المغرب'), JSON_OBJECT('en','Reduced manual data processing time','fr','Temps de traitement manuel des données réduit','ar','تقليل وقت معالجة البيانات اليدوي'), JSON_OBJECT('en','Spreadsheet workflows','fr','Workflows sur tableur','ar','سير عمل بجداول بيانات'), JSON_OBJECT('en','Scripted data pipeline','fr','Pipeline de données scripté','ar','خط بيانات مبرمج'))
ON DUPLICATE KEY UPDATE
  title_i18n = VALUES(title_i18n), summary_i18n = VALUES(summary_i18n),
  client_region_i18n = VALUES(client_region_i18n), impact_metric_i18n = VALUES(impact_metric_i18n),
  before_metric_i18n = VALUES(before_metric_i18n), after_metric_i18n = VALUES(after_metric_i18n);

-- -----------------------------------------------------------------
-- Tech stack categories (names stay English as proper nouns)
-- -----------------------------------------------------------------
INSERT INTO portfolio_tech_stack (name, name_i18n, category, category_i18n, proficiency, icon, is_featured, is_active, sort_order) VALUES
('HTML5', JSON_OBJECT('en','HTML5'), 'Frontend', JSON_OBJECT('en','Frontend','fr','Frontend','ar','الواجهة الأمامية'), 95, 'code', 1, 1, 0),
('CSS3', JSON_OBJECT('en','CSS3'), 'Frontend', JSON_OBJECT('en','Frontend','fr','Frontend','ar','الواجهة الأمامية'), 90, 'code', 1, 1, 1),
('JavaScript', JSON_OBJECT('en','JavaScript'), 'Frontend', JSON_OBJECT('en','Frontend','fr','Frontend','ar','الواجهة الأمامية'), 100, 'code', 1, 1, 2),
('jQuery', JSON_OBJECT('en','jQuery'), 'Frontend', JSON_OBJECT('en','Frontend','fr','Frontend','ar','الواجهة الأمامية'), 100, 'code', 1, 1, 3),
('React', JSON_OBJECT('en','React'), 'Frontend', JSON_OBJECT('en','Frontend','fr','Frontend','ar','الواجهة الأمامية'), 75, 'code', 1, 1, 4),
('Ajax', JSON_OBJECT('en','Ajax'), 'Frontend', JSON_OBJECT('en','Frontend','fr','Frontend','ar','الواجهة الأمامية'), 75, 'code', 1, 1, 5),
('PHP', JSON_OBJECT('en','PHP'), 'Backend', JSON_OBJECT('en','Backend','fr','Backend','ar','الواجهة الخلفية'), 88, 'code', 1, 1, 6),
('Laravel', JSON_OBJECT('en','Laravel'), 'Backend', JSON_OBJECT('en','Backend','fr','Backend','ar','الواجهة الخلفية'), 82, 'layers', 1, 1, 7),
('CodeIgniter', JSON_OBJECT('en','CodeIgniter'), 'Backend', JSON_OBJECT('en','Backend','fr','Backend','ar','الواجهة الخلفية'), 100, 'layers', 1, 1, 8),
('MySQL', JSON_OBJECT('en','MySQL'), 'Database', JSON_OBJECT('en','Database','fr','Base de données','ar','قاعدة البيانات'), 100, 'database', 1, 1, 9),
('MongoDB', JSON_OBJECT('en','MongoDB'), 'Database', JSON_OBJECT('en','Database','fr','Base de données','ar','قاعدة البيانات'), 78, 'database', 1, 1, 10),
('WordPress', JSON_OBJECT('en','WordPress'), 'CMS & Tools', JSON_OBJECT('en','CMS & Tools','fr','CMS & Outils','ar','أنظمة إدارة المحتوى والأدوات'), 92, 'globe', 1, 1, 11),
('WooCommerce', JSON_OBJECT('en','WooCommerce'), 'CMS & Tools', JSON_OBJECT('en','CMS & Tools','fr','CMS & Outils','ar','أنظمة إدارة المحتوى والأدوات'), 87, 'globe', 1, 1, 12),
('Perfex CRM', JSON_OBJECT('en','Perfex CRM'), 'CMS & Tools', JSON_OBJECT('en','CMS & Tools','fr','CMS & Outils','ar','أنظمة إدارة المحتوى والأدوات'), 85, 'briefcase', 1, 1, 13),
('n8n', JSON_OBJECT('en','n8n'), 'CMS & Tools', JSON_OBJECT('en','CMS & Tools','fr','CMS & Outils','ar','أنظمة إدارة المحتوى والأدوات'), 100, 'zap', 1, 1, 14),
('Git', JSON_OBJECT('en','Git'), 'Version Control', JSON_OBJECT('en','Version Control','fr','Gestion de versions','ar','إدارة النسخ'), 90, 'code', 1, 1, 15),
('GitHub', JSON_OBJECT('en','GitHub'), 'Version Control', JSON_OBJECT('en','Version Control','fr','Gestion de versions','ar','إدارة النسخ'), 88, 'code', 1, 1, 16),
('Python', JSON_OBJECT('en','Python'), 'Programming', JSON_OBJECT('en','Programming','fr','Programmation','ar','البرمجة'), 70, 'terminal', 1, 1, 17),
('Java', JSON_OBJECT('en','Java'), 'Programming', JSON_OBJECT('en','Programming','fr','Programmation','ar','البرمجة'), 72, 'terminal', 1, 1, 18),
('R', JSON_OBJECT('en','R'), 'Programming', JSON_OBJECT('en','Programming','fr','Programmation','ar','البرمجة'), 65, 'terminal', 1, 1, 19),
('Jupyter Notebook', JSON_OBJECT('en','Jupyter Notebook'), 'Data Analysis', JSON_OBJECT('en','Data Analysis','fr','Analyse de données','ar','تحليل البيانات'), 68, 'monitor', 1, 1, 20)
ON DUPLICATE KEY UPDATE
  category_i18n = VALUES(category_i18n), proficiency = VALUES(proficiency),
  is_featured = VALUES(is_featured), is_active = VALUES(is_active), sort_order = VALUES(sort_order);

-- -----------------------------------------------------------------
-- FAQ (run once)
-- -----------------------------------------------------------------
INSERT INTO portfolio_faq (question, question_i18n, answer, answer_i18n, category, category_i18n, is_active, sort_order) VALUES
('What services do you provide?', JSON_OBJECT('en','What services do you provide?','fr','Quels services proposez-vous ?','ar','ما الخدمات التي تقدمها؟'), 'I build n8n automation workflows, custom Perfex CRM modules, and high-speed web platforms.', JSON_OBJECT('en','I build n8n automation workflows, custom Perfex CRM modules, and high-speed web platforms.','fr','Je crée des workflows d''automatisation n8n, des modules Perfex CRM sur mesure et des plateformes web ultra-rapides.','ar','أبني سير عمل n8n ووحدات Perfex CRM مخصصة ومنصات ويب عالية السرعة.'), 'General', JSON_OBJECT('en','General','fr','Général','ar','عام'), 1, 0),
('How long does a typical project take?', JSON_OBJECT('en','How long does a typical project take?','fr','Combien de temps prend un projet typique ?','ar','كم يستغرق المشروع عادة؟'), 'It depends on scope. Automation workflows usually take 3–5 business days.', JSON_OBJECT('en','It depends on scope. Automation workflows usually take 3–5 business days.','fr','Cela dépend du périmètre. Les workflows d''automatisation prennent généralement 3 à 5 jours ouvrables.','ar','يعتمد ذلك على النطاق. تستغرق أتمتة سير العمل عادة من 3 إلى 5 أيام عمل.'), 'Process', JSON_OBJECT('en','Process','fr','Processus','ar','العملية'), 1, 1),
('Do you offer post-launch support?', JSON_OBJECT('en','Do you offer post-launch support?','fr','Proposez-vous un support après le lancement ?','ar','هل تقدم دعمًا بعد الإطلاق؟'), 'Yes, most packages include a 30-day post-launch support and warranty period.', JSON_OBJECT('en','Yes, most packages include a 30-day post-launch support and warranty period.','fr','Oui, la plupart des forfaits incluent un support et une garantie de 30 jours après le lancement.','ar','نعم، تشمل معظم الباقات دعمًا وضمانًا لمدة 30 يومًا بعد الإطلاق.'), 'Process', JSON_OBJECT('en','Process','fr','Processus','ar','العملية'), 1, 2),
('Can you work with my existing systems?', JSON_OBJECT('en','Can you work with my existing systems?','fr','Pouvez-vous travailler avec mes systèmes existants ?','ar','هل يمكنك العمل مع أنظمتي الحالية؟'), 'Yes, I specialize in integrating with existing CRMs, databases, and third-party APIs.', JSON_OBJECT('en','Yes, I specialize in integrating with existing CRMs, databases, and third-party APIs.','fr','Oui, je suis spécialisé dans l''intégration avec des CRM, bases de données et API tierces existants.','ar','نعم، أتخصص في التكامل مع أنظمة CRM وقواعد البيانات وواجهات API الخارجية الحالية.'), 'General', JSON_OBJECT('en','General','fr','Général','ar','عام'), 1, 3);
