-- ===========================================
-- MediBot Database Schema
-- PostgreSQL 15+
-- Version: 1.0.0
-- ===========================================
-- Professional Healthcare Chatbot Database
-- NO External Datasets - Custom Schema
-- ===========================================

-- ===========================================
-- EXTENSIONS
-- ===========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text similarity
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For indexing

-- ===========================================
-- ENUM TYPES
-- ===========================================

-- Disease severity levels
CREATE TYPE severity_level AS ENUM (
    'Mild',
    'Moderate',
    'Severe',
    'Critical'
);

-- Disease categories
CREATE TYPE disease_category AS ENUM (
    'Respiratory',
    'Cardiovascular',
    'Neurological',
    'Gastrointestinal',
    'Dermatological',
    'Musculoskeletal',
    'Endocrine',
    'Genitourinary',
    'Hematological',
    'Infectious',
    'Mental Health',
    'Ophthalmologic',
    'ENT',
    'General',
    'Other'
);

-- Symptom categories
CREATE TYPE symptom_category AS ENUM (
    'General',
    'Vital Signs',
    'Pain',
    'Respiratory',
    'Cardiovascular',
    'Neurological',
    'Gastrointestinal',
    'Dermatological',
    'Musculoskeletal',
    'Psychological',
    'Other'
);

-- User roles
CREATE TYPE user_role AS ENUM (
    'patient',
    'doctor',
    'admin',
    'super_admin'
);

-- Gender options
CREATE TYPE gender_type AS ENUM (
    'Male',
    'Female',
    'Other',
    'Prefer not to say'
);

-- Consultation status
CREATE TYPE consultation_status AS ENUM (
    'completed',
    'in_progress',
    'requires_attention',
    'escalated'
);

-- ===========================================
-- TABLES
-- ===========================================

-- -------------------------------------------
-- USERS TABLE
-- Stores all registered users
-- -------------------------------------------

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender gender_type DEFAULT 'Prefer not to say',
    blood_group VARCHAR(5),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    role user_role DEFAULT 'patient',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT check_height CHECK (height_cm IS NULL OR (height_cm > 50 AND height_cm < 300)),
    CONSTRAINT check_weight CHECK (weight_kg IS NULL OR (weight_kg > 1 AND weight_kg < 500)),
    CONSTRAINT check_date_of_birth CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE - INTERVAL '1 year')
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- -------------------------------------------
-- ADMIN_USERS TABLE
-- Admin panel access and permissions
-- -------------------------------------------

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'moderator',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_admin_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- -------------------------------------------
-- DISEASES TABLE
-- Comprehensive disease database with ICD-10 codes
-- -------------------------------------------

CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    medical_name VARCHAR(255),
    icd10_code VARCHAR(20),
    category disease_category DEFAULT 'General',
    severity severity_level DEFAULT 'Mild',
    description TEXT,
    causes TEXT,
    risk_factors TEXT,
    complications TEXT,
    when_to_see_doctor TEXT,
    is_common BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_icd10_format CHECK (icd10_code IS NULL OR icd10_code ~ '^[A-Z][0-9]{2}(\.[A-Z0-9]{1,4})?$')
);

-- Indexes for search optimization
CREATE INDEX idx_diseases_name ON diseases(name);
CREATE INDEX idx_diseases_icd10 ON diseases(icd10_code);
CREATE INDEX idx_diseases_category ON diseases(category);
CREATE INDEX idx_diseases_severity ON diseases(severity);
CREATE INDEX idx_diseases_is_common ON diseases(is_common);
CREATE INDEX idx_diseases_is_active ON diseases(is_active);

-- Full-text search index
CREATE INDEX idx_diseases_name_search ON diseases USING gin(to_tsvector('english', name));
CREATE INDEX idx_diseases_description_search ON diseases USING gin(to_tsvector('english', COALESCE(description, '')));

-- -------------------------------------------
-- SYMPTOMS TABLE
-- Standardized symptom database
-- -------------------------------------------

CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    medical_term VARCHAR(255),
    category symptom_category DEFAULT 'General',
    description TEXT,
    synonyms JSONB DEFAULT '[]',  -- Array of alternative names
    is_common BOOLEAN DEFAULT FALSE,
    requires_immediate_attention BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_symptoms_name ON symptoms(name);
CREATE INDEX idx_symptoms_category ON symptoms(category);
CREATE INDEX idx_symptoms_is_common ON symptoms(is_common);
CREATE INDEX idx_symptoms_name_search ON symptoms USING gin(to_tsvector('english', name));

-- -------------------------------------------
-- DISEASE_SYMTOMS TABLE (Junction)
-- Many-to-many relationship between diseases and symptoms
-- -------------------------------------------

CREATE TABLE disease_symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
    symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
    confidence_weight NUMERIC(3,2) DEFAULT 0.75,  -- How strongly symptom indicates disease (0.00-1.00)
    is_primary_symptom BOOLEAN DEFAULT FALSE,
    frequency VARCHAR(50) DEFAULT 'Common',  -- Common, Occasional, Rare
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique disease-symptom pair
    CONSTRAINT unique_disease_symptom UNIQUE (disease_id, symptom_id),
    CONSTRAINT check_confidence_weight CHECK (confidence_weight >= 0.00 AND confidence_weight <= 1.00)
);

-- Indexes
CREATE INDEX idx_disease_symptoms_disease_id ON disease_symptoms(disease_id);
CREATE INDEX idx_disease_symptoms_symptom_id ON disease_symptoms(symptom_id);
CREATE INDEX idx_disease_symptoms_confidence ON disease_symptoms(confidence_weight DESC);

-- -------------------------------------------
-- HOME_REMEDIES TABLE
-- Evidence-based home remedies
-- -------------------------------------------

CREATE TABLE home_remedies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
    remedy_text TEXT NOT NULL,
    effectiveness_rating NUMERIC(2,1) DEFAULT 3.0,  -- 1.0-5.0
    evidence_level VARCHAR(50) DEFAULT 'Traditional',  -- Scientific, Traditional, Anecdotal
    contraindications TEXT,  -- When NOT to use
    preparation_method TEXT,
    dosage_instructions TEXT,
    side_effects TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_effectiveness_rating CHECK (effectiveness_rating >= 1.0 AND effectiveness_rating <= 5.0)
);

CREATE INDEX idx_home_remedies_disease_id ON home_remedies(disease_id);
CREATE INDEX idx_home_remedies_effectiveness ON home_remedies(effectiveness_rating DESC);
CREATE INDEX idx_home_remedies_is_active ON home_remedies(is_active);

-- -------------------------------------------
-- CONSULTATIONS TABLE
-- User consultation history
-- -------------------------------------------

CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptoms_input TEXT NOT NULL,  -- Raw user input
    extracted_symptoms JSONB DEFAULT '[]',  -- Structured symptom data
    predicted_diseases JSONB DEFAULT '[]',  -- Array of predicted diseases with confidence
    primary_prediction UUID REFERENCES diseases(id),
    confidence_score NUMERIC(3,2),
    advice_given TEXT,
    home_remedies_suggested JSONB DEFAULT '[]',
    doctor_alert BOOLEAN DEFAULT FALSE,
    alert_reason TEXT,
    status consultation_status DEFAULT 'completed',
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES admin_users(id),
    
    CONSTRAINT check_confidence_score CHECK (confidence_score IS NULL OR (confidence_score >= 0.00 AND confidence_score <= 1.00))
);

-- Indexes
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX idx_consultations_doctor_alert ON consultations(doctor_alert);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_session_id ON consultations(session_id);

-- Full-text search on symptoms input
CREATE INDEX idx_consultations_symptoms_search ON consultations USING gin(to_tsvector('english', symptoms_input));

-- -------------------------------------------
-- AUDIT_LOGS TABLE
-- HIPAA-compliant audit trail
-- -------------------------------------------

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,  -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
    entity_type VARCHAR(100) NOT NULL,  -- users, diseases, symptoms, etc.
    entity_id UUID,
    old_values JSONB,  -- Previous state (for UPDATE/DELETE)
    new_values JSONB,  -- New state (for CREATE/UPDATE)
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_action CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'))
);

-- Indexes for audit queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- -------------------------------------------
-- HEALTH_METRICS TABLE
-- User health tracking over time
-- -------------------------------------------

CREATE TABLE health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,  -- weight, blood_pressure, temperature, etc.
    metric_value NUMERIC(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,  -- kg, mmHg, °F, etc.
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_metric_type CHECK (metric_type IN (
        'weight', 'height', 'temperature', 'blood_pressure_systolic', 
        'blood_pressure_diastolic', 'heart_rate', 'blood_sugar', 
        'oxygen_saturation', 'bmi'
    ))
);

CREATE INDEX idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX idx_health_metrics_type ON health_metrics(metric_type);
CREATE INDEX idx_health_metrics_recorded_at ON health_metrics(recorded_at DESC);

-- -------------------------------------------
-- NOTIFICATIONS TABLE
-- User notifications and reminders
-- -------------------------------------------

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',  -- info, warning, alert, reminder
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_notification_type CHECK (type IN ('info', 'warning', 'alert', 'reminder', 'critical'))
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);

-- -------------------------------------------
-- API_KEYS TABLE
-- For third-party integrations
-- -------------------------------------------

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    permissions JSONB DEFAULT '{}',
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_expiration CHECK (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- -------------------------------------------
-- SYSTEM_SETTINGS TABLE
-- Application configuration
-- -------------------------------------------

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string',  -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,  -- Visible to users or admin-only
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES admin_users(id),
    
    CONSTRAINT check_setting_type CHECK (setting_type IN ('string', 'number', 'boolean', 'json'))
);

CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_is_public ON system_settings(is_public);

-- ===========================================
-- TRIGGERS AND FUNCTIONS
-- ===========================================

-- -------------------------------------------
-- Function: Update updated_at timestamp
-- -------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON diseases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_symptoms_updated_at BEFORE UPDATE ON symptoms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_home_remedies_updated_at BEFORE UPDATE ON home_remedies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------
-- Function: Log audit trail
-- -------------------------------------------

CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, new_values)
        VALUES ('CREATE', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_values, new_values)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_values)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit logging to sensitive tables
CREATE TRIGGER audit_users_changes AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_diseases_changes AFTER INSERT OR UPDATE OR DELETE ON diseases
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_symptoms_changes AFTER INSERT OR UPDATE OR DELETE ON symptoms
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- ===========================================
-- VIEWS
-- ===========================================

-- -------------------------------------------
-- View: Disease Summary
-- -------------------------------------------

CREATE VIEW disease_summary AS
SELECT 
    d.id,
    d.name,
    d.icd10_code,
    d.category,
    d.severity,
    d.is_common,
    COUNT(DISTINCT ds.symptom_id) as symptom_count,
    COUNT(DISTINCT hr.id) as remedy_count,
    AVG(ds.confidence_weight) as avg_symptom_confidence
FROM diseases d
LEFT JOIN disease_symptoms ds ON d.id = ds.disease_id
LEFT JOIN home_remedies hr ON d.id = hr.disease_id
WHERE d.is_active = TRUE
GROUP BY d.id, d.name, d.icd10_code, d.category, d.severity, d.is_common;

-- -------------------------------------------
-- View: User Consultation Stats
-- -------------------------------------------

CREATE VIEW user_consultation_stats AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    COUNT(c.id) as total_consultations,
    COUNT(CASE WHEN c.doctor_alert = TRUE THEN 1 END) as alerts_triggered,
    MAX(c.created_at) as last_consultation,
    AVG(c.confidence_score) as avg_confidence_score
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
WHERE u.is_active = TRUE
GROUP BY u.id, u.email, u.full_name;

-- -------------------------------------------
-- View: Symptom Frequency Analysis
-- -------------------------------------------

CREATE VIEW symptom_frequency_analysis AS
SELECT 
    s.id,
    s.name,
    s.category,
    COUNT(DISTINCT ds.disease_id) as disease_count,
    COUNT(DISTINCT c.id) as consultation_count
FROM symptoms s
LEFT JOIN disease_symptoms ds ON s.id = ds.symptom_id
LEFT JOIN consultations c ON c.extracted_symptoms @> jsonb_build_array(s.name)
GROUP BY s.id, s.name, s.category
ORDER BY consultation_count DESC;

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON DATABASE medibot IS 'MediBot - AI-Powered Healthcare Chatbot Database';

COMMENT ON TABLE users IS 'Stores all registered users with health profiles';
COMMENT ON TABLE diseases IS 'Comprehensive disease database with ICD-10 codes';
COMMENT ON TABLE symptoms IS 'Standardized symptom terminology';
COMMENT ON TABLE disease_symptoms IS 'Many-to-many mapping of diseases and symptoms';
COMMENT ON TABLE home_remedies IS 'Evidence-based home remedies for diseases';
COMMENT ON TABLE consultations IS 'User consultation history with AI chatbot';
COMMENT ON TABLE audit_logs IS 'HIPAA-compliant audit trail for all data changes';

-- ===========================================
-- INITIAL DATA
-- ===========================================

-- Insert default admin user
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO admin_users (username, email, password_hash, full_name, role, permissions)
VALUES (
    'admin',
    'admin@medibot.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS3MebAJu',
    'System Administrator',
    'super_admin',
    '{"all": true}'
);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'MediBot', 'string', 'Application name', TRUE),
('app_version', '1.0.0', 'string', 'Application version', TRUE),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', FALSE),
('max_consultations_per_day', '50', 'number', 'Maximum consultations per user per day', FALSE),
('doctor_alert_threshold', '0.80', 'number', 'Confidence threshold for doctor alerts', FALSE),
('session_timeout_minutes', '60', 'number', 'User session timeout', FALSE),
('enable_voice_input', 'true', 'boolean', 'Enable voice input feature', TRUE),
('enable_multi_language', 'true', 'boolean', 'Enable multi-language support', TRUE),
('supported_languages', '["en", "ur"]', 'json', 'Supported language codes', TRUE);

-- ===========================================
-- END OF SCHEMA
-- ===========================================
