-- ============================================
-- MediBot - Complete User Profile Schema
-- ============================================
-- Includes: User Details + Medical History + Consultations
-- ============================================

-- -------------------------------------------
-- 1. USERS TABLE - Complete Profile
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Personal Details
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    blood_group VARCHAR(5),
    
    -- Physical Attributes
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    bmi NUMERIC(4,2),
    
    -- Medical Profile
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    chronic_conditions TEXT,
    family_medical_history TEXT,
    
    -- Lifestyle
    smoking_status VARCHAR(20),
    alcohol_consumption VARCHAR(20),
    exercise_frequency VARCHAR(20),
    diet_type VARCHAR(20),
    
    -- Account Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_height CHECK (height_cm IS NULL OR (height_cm > 50 AND height_cm < 300)),
    CONSTRAINT check_weight CHECK (weight_kg IS NULL OR (weight_kg > 1 AND weight_kg < 500))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- -------------------------------------------
-- 2. MEDICAL CONDITIONS TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS medical_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    condition_name VARCHAR(255) NOT NULL,
    icd10_code VARCHAR(20),
    diagnosis_date DATE,
    severity VARCHAR(20) CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Critical')),
    status VARCHAR(20) CHECK (status IN ('Active', 'Resolved', 'Chronic', 'In Treatment')),
    notes TEXT,
    treating_doctor VARCHAR(255),
    hospital_clinic VARCHAR(255),
    medications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medical_conditions_user ON medical_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_conditions_status ON medical_conditions(status);

-- -------------------------------------------
-- 3. ALLERGIES TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS user_allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allergy_name VARCHAR(255) NOT NULL,
    allergy_type VARCHAR(50) CHECK (allergy_type IN ('Food', 'Medication', 'Environmental', 'Insect', 'Latex', 'Other')),
    severity VARCHAR(20) CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Life-threatening')),
    reaction_description TEXT,
    diagnosed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_allergies_user ON user_allergies(user_id);

-- -------------------------------------------
-- 4. MEDICATIONS TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS user_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE,
    end_date DATE,
    prescribed_by VARCHAR(255),
    reason TEXT,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_medications_user ON user_medications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_medications_current ON user_medications(is_current);

-- -------------------------------------------
-- 5. VITAL SIGNS TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS vital_signs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Vital Measurements
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature_fahrenheit NUMERIC(4,2),
    oxygen_saturation NUMERIC(4,2),
    respiratory_rate INTEGER,
    
    -- Blood Sugar (if applicable)
    blood_sugar_mg_dl INTEGER,
    
    -- Measurements
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    bmi NUMERIC(4,2),
    
    -- Metadata
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vital_signs_user ON vital_signs(user_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_recorded ON vital_signs(recorded_at);

-- -------------------------------------------
-- 6. CONSULTATIONS TABLE - Chat History
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Consultation Details
    symptoms_input TEXT NOT NULL,
    extracted_symptoms JSONB,
    predicted_diseases JSONB,
    primary_diagnosis VARCHAR(255),
    confidence_score NUMERIC(3,2),
    
    -- AI Response
    advice_given TEXT,
    home_remedies JSONB,
    recommended_tests JSONB,
    specialist_referral VARCHAR(255),
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Alerts
    doctor_alert BOOLEAN DEFAULT FALSE,
    alert_reason TEXT,
    emergency_level VARCHAR(20) CHECK (emergency_level IN ('None', 'Low', 'Medium', 'High', 'Critical')),
    
    -- Session Info
    session_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    response_time_ms INTEGER,
    
    -- Status
    status VARCHAR(20) CHECK (status IN ('Completed', 'In Progress', 'Requires Attention', 'Escalated')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created ON consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

-- -------------------------------------------
-- 7. SYMPTOMS TRACKER TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS symptom_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptom_name VARCHAR(255) NOT NULL,
    severity INTEGER CHECK (severity >= 1 AND severity <= 10),
    duration VARCHAR(100),
    frequency VARCHAR(100),
    triggers TEXT,
    associated_symptoms JSONB,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_symptom_tracker_user ON symptom_tracker(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_tracker_recorded ON symptom_tracker(recorded_at);

-- -------------------------------------------
-- 8. LAB TESTS TABLE
-- --------------------------------===========
CREATE TABLE IF NOT EXISTS lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(100),
    lab_name VARCHAR(255),
    test_date DATE,
    results JSONB,
    reference_ranges JSONB,
    abnormal_flags JSONB,
    prescribed_by VARCHAR(255),
    notes TEXT,
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lab_tests_user ON lab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_date ON lab_tests(test_date);

-- -------------------------------------------
-- 9. VACCINATIONS TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS vaccinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(255) NOT NULL,
    dose_number INTEGER,
    total_doses INTEGER,
    administration_date DATE,
    next_due_date DATE,
    administered_by VARCHAR(255),
    location VARCHAR(255),
    batch_number VARCHAR(100),
    side_effects TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vaccinations_user ON vaccinations(user_id);

-- -------------------------------------------
-- 10. HEALTH GOALS TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS health_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(255) NOT NULL,
    goal_type VARCHAR(50) CHECK (goal_type IN ('Weight Loss', 'Weight Gain', 'Fitness', 'Nutrition', 'Mental Health', 'Chronic Management', 'Other')),
    target_value NUMERIC(10,2),
    current_value NUMERIC(10,2),
    unit VARCHAR(20),
    start_date DATE,
    target_date DATE,
    status VARCHAR(20) CHECK (status IN ('Active', 'Completed', 'Paused', 'Abandoned')),
    progress_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_goals_user ON health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_health_goals_status ON health_goals(status);

-- -------------------------------------------
-- 11. FAMILY MEDICAL HISTORY TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS family_medical_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relative_type VARCHAR(50) CHECK (relative_type IN ('Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other')),
    condition_name VARCHAR(255) NOT NULL,
    age_of_onset INTEGER,
    current_age INTEGER,
    is_deceased BOOLEAN DEFAULT FALSE,
    age_at_death INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_family_history_user ON family_medical_history(user_id);

-- -------------------------------------------
-- 12. DOCUMENTS & REPORTS TABLE
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) CHECK (document_type IN ('Lab Report', 'Prescription', 'Medical Certificate', 'Insurance', 'ID', 'Other')),
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(20),
    upload_date DATE,
    related_condition VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON user_documents(user_id);

-- ============================================
-- VIEWS FOR EASY ACCESS
-- ============================================

-- Complete User Profile View
CREATE OR REPLACE VIEW user_complete_profile AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.phone,
    u.date_of_birth,
    u.gender,
    u.blood_group,
    u.height_cm,
    u.weight_kg,
    u.bmi,
    u.medical_history,
    u.allergies,
    u.current_medications,
    u.is_active,
    u.created_at,
    u.last_login_at,
    COUNT(DISTINCT mc.id) as medical_conditions_count,
    COUNT(DISTINCT ua.id) as allergies_count,
    COUNT(DISTINCT um.id) as medications_count,
    COUNT(DISTINCT c.id) as consultations_count,
    COUNT(DISTINCT vs.id) as vital_signs_count
FROM users u
LEFT JOIN medical_conditions mc ON u.id = mc.user_id
LEFT JOIN user_allergies ua ON u.id = ua.user_id
LEFT JOIN user_medications um ON u.id = um.user_id
LEFT JOIN consultations c ON u.id = c.user_id
LEFT JOIN vital_signs vs ON u.id = vs.user_id
GROUP BY u.id;

-- Recent Consultations View
CREATE OR REPLACE VIEW recent_consultations AS
SELECT 
    c.id,
    c.user_id,
    u.email,
    u.full_name,
    c.symptoms_input,
    c.primary_diagnosis,
    c.confidence_score,
    c.doctor_alert,
    c.status,
    c.created_at
FROM consultations c
JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC
LIMIT 100;

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Insert a sample user
INSERT INTO users (email, password_hash, full_name, phone, date_of_birth, gender, blood_group, height_cm, weight_kg, medical_history, allergies, current_medications)
VALUES (
    'john.doe@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS3MebAJu',
    'John Doe',
    '+1234567890',
    '1990-05-15',
    'Male',
    'O+',
    175.5,
    70.5,
    'No major chronic conditions',
    'Penicillin, Peanuts',
    'Multivitamin daily'
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================
