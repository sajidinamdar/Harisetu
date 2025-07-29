-- HaritSetu Main Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS haritsetu_db;
USE haritsetu_db;

-- Users table (common for all modules)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) NOT NULL UNIQUE,
    address TEXT,
    district VARCHAR(50),
    state VARCHAR(50),
    user_type ENUM('farmer', 'seller', 'buyer', 'expert', 'admin') NOT NULL,
    profile_image VARCHAR(255),
    language_preference ENUM('en', 'mr') DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User authentication table
CREATE TABLE IF NOT EXISTS auth_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =============================================
-- KrushiBazaar Module Tables
-- =============================================

-- Categories table
CREATE TABLE IF NOT EXISTS kb_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_marathi VARCHAR(100),
    description TEXT,
    parent_category_id INT,
    image VARCHAR(255),
    FOREIGN KEY (parent_category_id) REFERENCES kb_categories(category_id) ON DELETE SET NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS kb_products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    name_marathi VARCHAR(150),
    description TEXT,
    description_marathi TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    quantity INT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    is_organic BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('available', 'out_of_stock', 'discontinued') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES kb_categories(category_id) ON DELETE SET NULL
);

-- Product images table
CREATE TABLE IF NOT EXISTS kb_product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES kb_products(product_id) ON DELETE CASCADE
);

-- Government subsidies table
CREATE TABLE IF NOT EXISTS kb_subsidies (
    subsidy_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    title_marathi VARCHAR(150),
    description TEXT,
    description_marathi TEXT,
    eligibility_criteria TEXT,
    application_process TEXT,
    start_date DATE,
    end_date DATE,
    issuing_authority VARCHAR(100),
    document_required TEXT,
    contact_info TEXT,
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product-subsidy relationship table
CREATE TABLE IF NOT EXISTS kb_product_subsidies (
    product_id INT NOT NULL,
    subsidy_id INT NOT NULL,
    PRIMARY KEY (product_id, subsidy_id),
    FOREIGN KEY (product_id) REFERENCES kb_products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (subsidy_id) REFERENCES kb_subsidies(subsidy_id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS kb_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    contact_phone VARCHAR(15) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash_on_delivery', 'online_payment', 'bank_transfer') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    tracking_number VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS kb_order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES kb_orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES kb_products(product_id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE IF NOT EXISTS kb_cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES kb_products(product_id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, product_id)
);

-- =============================================
-- AgriScan Module Tables
-- =============================================

-- Plant diseases table
CREATE TABLE IF NOT EXISTS as_diseases (
    disease_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_marathi VARCHAR(150),
    description TEXT,
    description_marathi TEXT,
    symptoms TEXT,
    symptoms_marathi TEXT,
    causes TEXT,
    causes_marathi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Disease treatments table
CREATE TABLE IF NOT EXISTS as_treatments (
    treatment_id INT AUTO_INCREMENT PRIMARY KEY,
    disease_id INT NOT NULL,
    treatment_type ENUM('chemical', 'organic', 'preventive') NOT NULL,
    title VARCHAR(100) NOT NULL,
    title_marathi VARCHAR(150),
    description TEXT NOT NULL,
    description_marathi TEXT,
    dosage TEXT,
    application_method TEXT,
    precautions TEXT,
    FOREIGN KEY (disease_id) REFERENCES as_diseases(disease_id) ON DELETE CASCADE
);

-- Scan history table
CREATE TABLE IF NOT EXISTS as_scan_history (
    scan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    plant_name VARCHAR(100),
    disease_id INT,
    confidence_score DECIMAL(5, 2),
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (disease_id) REFERENCES as_diseases(disease_id) ON DELETE SET NULL
);

-- =============================================
-- Grievance360 Module Tables
-- =============================================

-- Departments table
CREATE TABLE IF NOT EXISTS g360_departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_marathi VARCHAR(150),
    description TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(15),
    head_officer VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Complaint categories table
CREATE TABLE IF NOT EXISTS g360_complaint_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_marathi VARCHAR(150),
    description TEXT,
    avg_resolution_time INT COMMENT 'Average resolution time in days',
    FOREIGN KEY (department_id) REFERENCES g360_departments(department_id) ON DELETE CASCADE
);

-- Complaints table
CREATE TABLE IF NOT EXISTS g360_complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200),
    district VARCHAR(100),
    state VARCHAR(100),
    status ENUM('pending', 'in_progress', 'resolved', 'rejected', 'escalated') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    reference_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES g360_complaint_categories(category_id) ON DELETE CASCADE
);

-- Complaint attachments table
CREATE TABLE IF NOT EXISTS g360_complaint_attachments (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_name VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES g360_complaints(complaint_id) ON DELETE CASCADE
);

-- Complaint updates table
CREATE TABLE IF NOT EXISTS g360_complaint_updates (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    user_id INT COMMENT 'User who made the update (can be admin or complainant)',
    update_text TEXT NOT NULL,
    status_change ENUM('pending', 'in_progress', 'resolved', 'rejected', 'escalated'),
    is_public BOOLEAN DEFAULT TRUE COMMENT 'Whether update is visible to complainant',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES g360_complaints(complaint_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =============================================
-- AgriConnect Module Tables
-- =============================================

-- Service provider categories table
CREATE TABLE IF NOT EXISTS ac_service_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_marathi VARCHAR(150),
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service providers table
CREATE TABLE IF NOT EXISTS ac_service_providers (
    provider_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    business_name VARCHAR(100) NOT NULL,
    business_name_marathi VARCHAR(150),
    description TEXT,
    description_marathi TEXT,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_phone VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    email VARCHAR(100),
    website VARCHAR(255),
    business_hours TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES ac_service_categories(category_id) ON DELETE CASCADE
);

-- Service provider images table
CREATE TABLE IF NOT EXISTS ac_provider_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (provider_id) REFERENCES ac_service_providers(provider_id) ON DELETE CASCADE
);

-- Service provider reviews table
CREATE TABLE IF NOT EXISTS ac_provider_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES ac_service_providers(provider_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =============================================
-- AgroAlert Module Tables
-- =============================================

-- Weather alerts table
CREATE TABLE IF NOT EXISTS aa_weather_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    alert_type ENUM('rain', 'storm', 'heat', 'cold', 'pest', 'disease', 'other') NOT NULL,
    title VARCHAR(100) NOT NULL,
    title_marathi VARCHAR(150),
    description TEXT NOT NULL,
    description_marathi TEXT,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    affected_districts TEXT COMMENT 'Comma-separated list of districts',
    affected_states TEXT COMMENT 'Comma-separated list of states',
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User alert subscriptions table
CREATE TABLE IF NOT EXISTS aa_user_subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    alert_types TEXT COMMENT 'Comma-separated list of alert types',
    notification_method ENUM('sms', 'email', 'push', 'all') DEFAULT 'all',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Alert delivery history table
CREATE TABLE IF NOT EXISTS aa_alert_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    user_id INT NOT NULL,
    delivery_method ENUM('sms', 'email', 'push') NOT NULL,
    delivery_status ENUM('sent', 'failed', 'delivered', 'read') NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT,
    FOREIGN KEY (alert_id) REFERENCES aa_weather_alerts(alert_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =============================================
-- HaritSetu Chat Module Tables
-- =============================================

-- Chat sessions table
CREATE TABLE IF NOT EXISTS hc_chat_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    session_summary TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS hc_chat_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    sender_type ENUM('user', 'ai') NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES hc_chat_sessions(session_id) ON DELETE CASCADE
);

-- Knowledge base table
CREATE TABLE IF NOT EXISTS hc_knowledge_base (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    title_marathi VARCHAR(250),
    content TEXT NOT NULL,
    content_marathi TEXT,
    category VARCHAR(100),
    tags TEXT COMMENT 'Comma-separated tags',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- AgriDocAI Module Tables
-- =============================================

-- Document templates table
CREATE TABLE IF NOT EXISTS ad_document_templates (
    template_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_marathi VARCHAR(150),
    description TEXT,
    document_type ENUM('application', 'certificate', 'report', 'letter', 'other') NOT NULL,
    template_fields TEXT COMMENT 'JSON structure of required fields',
    template_html TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Generated documents table
CREATE TABLE IF NOT EXISTS ad_generated_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    template_id INT NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    document_data TEXT COMMENT 'JSON data used to generate document',
    file_url VARCHAR(255),
    status ENUM('draft', 'generated', 'signed', 'submitted') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES ad_document_templates(template_id) ON DELETE CASCADE
);

-- =============================================
-- Kisan Mitra Module Tables
-- =============================================

-- Voice queries table
CREATE TABLE IF NOT EXISTS km_voice_queries (
    query_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    audio_url VARCHAR(255),
    transcription TEXT,
    response_text TEXT,
    response_audio_url VARCHAR(255),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Frequently asked queries table
CREATE TABLE IF NOT EXISTS km_faq (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    question_marathi TEXT,
    answer TEXT NOT NULL,
    answer_marathi TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Insert Sample Data
-- =============================================

-- Insert sample users
INSERT INTO users (username, password_hash, full_name, email, phone, address, district, state, user_type, language_preference)
VALUES 
('farmer1', '$2a$10$XQCilOxnXpXGdw9aCWkM8eYeVXnG5hXQKGrGVH5yPWzs9AZH4XWEC', 'Rajesh Patil', 'rajesh@example.com', '9876543210', 'Village Pune', 'Pune', 'Maharashtra', 'farmer', 'mr'),
('seller1', '$2a$10$XQCilOxnXpXGdw9aCWkM8eYeVXnG5hXQKGrGVH5yPWzs9AZH4XWEC', 'Suresh Traders', 'suresh@example.com', '9876543211', 'Market Road, Nashik', 'Nashik', 'Maharashtra', 'seller', 'en'),
('buyer1', '$2a$10$XQCilOxnXpXGdw9aCWkM8eYeVXnG5hXQKGrGVH5yPWzs9AZH4XWEC', 'Amit Kumar', 'amit@example.com', '9876543212', 'Shivaji Nagar, Pune', 'Pune', 'Maharashtra', 'buyer', 'en'),
('expert1', '$2a$10$XQCilOxnXpXGdw9aCWkM8eYeVXnG5hXQKGrGVH5yPWzs9AZH4XWEC', 'Dr. Priya Sharma', 'priya@example.com', '9876543213', 'Agricultural College, Pune', 'Pune', 'Maharashtra', 'expert', 'en'),
('admin1', '$2a$10$XQCilOxnXpXGdw9aCWkM8eYeVXnG5hXQKGrGVH5yPWzs9AZH4XWEC', 'Admin User', 'admin@haritsetu.com', '9876543214', 'HaritSetu Office, Mumbai', 'Mumbai', 'Maharashtra', 'admin', 'en');

-- Insert sample KB categories
INSERT INTO kb_categories (name, name_marathi, description)
VALUES 
('Seeds', 'बियाणे', 'All types of agricultural seeds'),
('Fertilizers', 'खते', 'Chemical and organic fertilizers'),
('Pesticides', 'कीटकनाशके', 'Products for pest control'),
('Tools', 'औजारे', 'Farming tools and equipment'),
('Irrigation', 'सिंचन', 'Irrigation systems and equipment');

-- Insert sample KB subsidies
INSERT INTO kb_subsidies (title, title_marathi, description, eligibility_criteria, issuing_authority)
VALUES 
('Seed Subsidy Scheme', 'बियाणे अनुदान योजना', 'Government provides 50% subsidy on certified seeds', 'Small and marginal farmers with land holding up to 2 hectares', 'Department of Agriculture'),
('Fertilizer Subsidy', 'खत अनुदान', 'Subsidy on chemical fertilizers to ensure farmers get fertilizers at affordable prices', 'All farmers', 'Ministry of Chemicals and Fertilizers'),
('Farm Equipment Subsidy', 'शेती उपकरण अनुदान', 'Subsidy up to 40% on purchase of farm equipment and machinery', 'Farmers with Kisan Credit Card', 'Department of Agricultural Engineering');

-- Insert sample AgriConnect service categories
INSERT INTO ac_service_categories (name, name_marathi, description, icon)
VALUES 
('Equipment Rental', 'उपकरण भाडे', 'Agricultural equipment rental services', 'tractor'),
('Transportation', 'वाहतूक', 'Transportation services for agricultural produce', 'truck'),
('Cold Storage', 'शीत गृह', 'Cold storage facilities for perishable goods', 'snowflake'),
('Soil Testing', 'मृदा परीक्षण', 'Soil testing and analysis services', 'flask'),
('Veterinary Services', 'पशुवैद्यकीय सेवा', 'Healthcare services for livestock', 'stethoscope');

-- Insert sample Grievance360 departments
INSERT INTO g360_departments (name, name_marathi, description, contact_email, contact_phone, head_officer)
VALUES 
('Agriculture Department', 'कृषी विभाग', 'Handles issues related to agriculture and farming', 'agri@example.gov.in', '1800123456', 'Mr. Deshmukh'),
('Irrigation Department', 'सिंचन विभाग', 'Handles issues related to irrigation and water supply', 'irrigation@example.gov.in', '1800123457', 'Mrs. Joshi'),
('Revenue Department', 'महसूल विभाग', 'Handles issues related to land records and revenue', 'revenue@example.gov.in', '1800123458', 'Mr. Patil');

-- Insert sample Grievance360 complaint categories
INSERT INTO g360_complaint_categories (department_id, name, name_marathi, description, avg_resolution_time)
VALUES 
(1, 'Seed Quality', 'बियाणे गुणवत्ता', 'Issues related to seed quality and certification', 7),
(1, 'Fertilizer Availability', 'खते उपलब्धता', 'Issues related to fertilizer availability and distribution', 5),
(2, 'Canal Maintenance', 'कालवा देखभाल', 'Issues related to canal maintenance and repair', 14),
(2, 'Water Supply', 'पाणी पुरवठा', 'Issues related to irrigation water supply', 10),
(3, 'Land Records', 'जमीन नोंदी', 'Issues related to land records and documentation', 21);

-- Insert sample AgriScan diseases
INSERT INTO as_diseases (name, name_marathi, description, symptoms, causes)
VALUES 
('Late Blight', 'लेट ब्लाईट', 'A destructive disease of potatoes and tomatoes', 'Brown lesions on leaves, white fungal growth', 'Caused by the fungus-like oomycete Phytophthora infestans'),
('Powdery Mildew', 'पावडरी मिल्ड्यू', 'A fungal disease affecting a wide range of plants', 'White powdery spots on leaves and stems', 'Caused by many different species of fungi'),
('Bacterial Wilt', 'बॅक्टेरियल विल्ट', 'A bacterial disease affecting solanaceous crops', 'Wilting of plants, browning of vascular tissue', 'Caused by Ralstonia solanacearum bacteria');

-- Insert sample AgroAlert weather alerts
INSERT INTO aa_weather_alerts (alert_type, title, title_marathi, description, description_marathi, severity, start_date, end_date, affected_districts, affected_states, source)
VALUES 
('rain', 'Heavy Rainfall Alert', 'मुसळधार पाऊस सतर्कता', 'Heavy rainfall expected in the region. Take necessary precautions.', 'प्रदेशात मुसळधार पावसाची शक्यता आहे. आवश्यक खबरदारी घ्या.', 'high', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 'Pune, Satara, Kolhapur', 'Maharashtra', 'Meteorological Department'),
('heat', 'Heat Wave Warning', 'उष्णतेची लाट चेतावणी', 'Heat wave conditions expected. Stay hydrated and avoid outdoor activities.', 'उष्णतेच्या लाटेची स्थिती अपेक्षित आहे. हायड्रेटेड रहा आणि बाहेरील क्रियाकलाप टाळा.', 'medium', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 'Nagpur, Amravati, Akola', 'Maharashtra', 'Meteorological Department'),
('pest', 'Locust Swarm Alert', 'टोळधाड सतर्कता', 'Locust swarms spotted moving towards the region. Prepare control measures.', 'टोळधाड प्रदेशाकडे येताना दिसली आहे. नियंत्रण उपाय तयार करा.', 'critical', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Jalgaon, Dhule, Nandurbar', 'Maharashtra', 'Agricultural Department');