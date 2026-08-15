-- Ismail Sabbar Portfolio — fresh Hostinger database install
-- WARNING: This deletes the existing portfolio_* tables and their data.
-- Back up the database first. Run with the target database selected.

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

DROP TABLE IF EXISTS portfolio_users;
DROP TABLE IF EXISTS portfolio_leads;
DROP TABLE IF EXISTS portfolio_settings;
DROP TABLE IF EXISTS portfolio_content_blocks;
DROP TABLE IF EXISTS portfolio_faq;
DROP TABLE IF EXISTS portfolio_client_logos;
DROP TABLE IF EXISTS portfolio_testimonials;
DROP TABLE IF EXISTS portfolio_case_studies;
DROP TABLE IF EXISTS portfolio_tech_stack;
DROP TABLE IF EXISTS portfolio_services;
DROP TABLE IF EXISTS portfolio_plans;

CREATE TABLE portfolio_plans (
  id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(100) UNIQUE NOT NULL, title VARCHAR(255) NOT NULL,
  title_i18n JSON, badge VARCHAR(100), badge_i18n JSON,
  price_mad DECIMAL(10,2) NOT NULL, price_eur DECIMAL(10,2) NOT NULL, price_usd DECIMAL(10,2) NOT NULL,
  price_gbp DECIMAL(10,2) NOT NULL, price_aed DECIMAL(10,2) NOT NULL,
  billing_type ENUM('one_time','hourly','monthly') DEFAULT 'one_time', features_json JSON NOT NULL,
  turnaround VARCHAR(100) NOT NULL, turnaround_i18n JSON,
  cta_type ENUM('wizard','booking','whatsapp') DEFAULT 'wizard', is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_services (
  id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(100) UNIQUE NOT NULL, title VARCHAR(255) NOT NULL,
  title_i18n JSON, category VARCHAR(100) NOT NULL, category_i18n JSON, description TEXT NOT NULL,
  description_i18n JSON, icon_name VARCHAR(100) NOT NULL, is_active BOOLEAN DEFAULT TRUE, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category), INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_tech_stack (
  id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, name_i18n JSON, category VARCHAR(100) NOT NULL,
  category_i18n JSON, proficiency INT NOT NULL CHECK (proficiency BETWEEN 1 AND 100), icon VARCHAR(255) NOT NULL,
  is_featured BOOLEAN DEFAULT TRUE, is_active BOOLEAN DEFAULT TRUE, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_featured_sort (is_featured, sort_order), INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_case_studies (
  id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(100) UNIQUE NOT NULL, title VARCHAR(255) NOT NULL,
  title_i18n JSON, summary TEXT NOT NULL, summary_i18n JSON, client_name VARCHAR(255), client_region VARCHAR(100),
  client_region_i18n JSON, impact_metric VARCHAR(255), impact_metric_i18n JSON, before_metric VARCHAR(255),
  before_metric_i18n JSON, after_metric VARCHAR(255), after_metric_i18n JSON, improvement_percent INT,
  demo_url VARCHAR(500), github_url VARCHAR(500), image_url VARCHAR(500), xray_specs_json JSON, n8n_nodes_json JSON,
  body_i18n JSON, is_featured BOOLEAN DEFAULT TRUE, is_active BOOLEAN DEFAULT TRUE, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_featured_sort (is_featured, sort_order), INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY, client_name VARCHAR(255) NOT NULL, client_name_i18n JSON,
  company VARCHAR(255), company_i18n JSON, country VARCHAR(100), country_i18n JSON, quote TEXT NOT NULL,
  quote_i18n JSON, rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5), is_b2b_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_client_logos (
  id INT AUTO_INCREMENT PRIMARY KEY, company_name VARCHAR(255) NOT NULL, company_name_i18n JSON,
  logo_url VARCHAR(500) NOT NULL, website_url VARCHAR(500), is_active BOOLEAN DEFAULT TRUE, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_faq (
  id INT AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL, question_i18n JSON, answer TEXT NOT NULL,
  answer_i18n JSON, category VARCHAR(100), category_i18n JSON, is_active BOOLEAN DEFAULT TRUE, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_content_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY, section_key VARCHAR(100) UNIQUE NOT NULL, content_i18n JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_section_key (section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_settings (
  setting_key VARCHAR(100) PRIMARY KEY, setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio_leads (
  id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), phone VARCHAR(100),
  company VARCHAR(255), country VARCHAR(100), currency VARCHAR(10) DEFAULT 'USD', service_interest VARCHAR(100),
  estimated_budget DECIMAL(10,2), timeline VARCHAR(100), calculated_roi_savings TEXT, message TEXT,
  attachment_path VARCHAR(500), source_page VARCHAR(255), source_type ENUM('form','booking','whatsapp') DEFAULT 'form',
  ip_hash VARCHAR(64), user_agent VARCHAR(255), locale VARCHAR(5) NOT NULL DEFAULT 'en', consent_at TIMESTAMP NULL,
  privacy_policy_version VARCHAR(40) NOT NULL DEFAULT '2026-08-13', attachment_original_name VARCHAR(255),
  attachment_mime VARCHAR(100), attachment_size INT UNSIGNED, status ENUM('new','contacted','qualified','converted','archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL, internal_notes TEXT NULL, INDEX idx_status_date (status, created_at), INDEX idx_source_type (source_type),
  INDEX idx_ip_hash_created (ip_hash, created_at), INDEX idx_leads_locale_date (locale, created_at), INDEX idx_leads_email (email),
  INDEX idx_leads_company (company), INDEX idx_leads_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO portfolio_settings (setting_key, setting_value) VALUES
('availability_status','online'),
('availability_message','Available for Q3 Enterprise Projects & Automation Audits'),
('ice_registration_number','003294812000045'),
('sla_notice','Official B2B Invoicing & Contracted Service Level Agreements Available'),
('contact_email','contact@imsabbar.com'), ('contact_phone','+212681510095'), ('scheduling_link',''),
('resume_en_filename','imsabbar_MEN_V25.9.pdf'), ('resume_fr_filename','imsabbar_MFR_V25.9.pdf'),
('resume_ar_filename','imsabbar_MEN_V25.9.pdf'),
('social_links_json',JSON_OBJECT('linkedin','https://www.linkedin.com/in/sabbarismail/','github','https://github.com/imsabbar','youtube','https://www.youtube.com/@imsabbar','telegram','https://t.me/imsabbar','whatsapp','https://wa.me/212681510095','email','mailto:contact@imsabbar.com')),
('stats_years_value','12+'), ('stats_clients_value','85+'), ('stats_projects_value','200+');

SET FOREIGN_KEY_CHECKS = 1;

-- Verification
SHOW TABLES;
SHOW COLUMNS FROM portfolio_leads;
SHOW COLUMNS FROM portfolio_faq;
SHOW COLUMNS FROM portfolio_client_logos;
