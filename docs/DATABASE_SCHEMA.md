# 🗄️ MediBot Database Schema Documentation

## Overview

This document provides comprehensive documentation for the MediBot PostgreSQL database schema. The database is designed to support an AI-powered healthcare chatbot with HIPAA-compliant audit logging, professional disease-symptom mapping, and user health tracking.

---

## 📊 Database Statistics

| Metric | Value |
|--------|-------|
| **Database Name** | medibot |
| **DBMS** | PostgreSQL 15+ |
| **Total Tables** | 12 |
| **Total Views** | 3 |
| **Total Triggers** | 6 |
| **Extensions Used** | 3 (uuid-ossp, pg_trgm, btree_gin) |
| **Custom Types** | 6 (ENUMs) |

---

## 🏗️ Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MediBot Database Schema                          │
└─────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────────┐
                                    │   ADMIN_USERS    │
                                    └────────┬─────────┘
                                             │
                                             │ reviews
                                             │
┌──────────────────┐                ┌────────▼─────────┐
│     USERS        │                │  CONSULTATIONS   │
├──────────────────┤                ├──────────────────┤
│ id (PK)          │                │ id (PK)          │
│ email            │                │ user_id (FK)     │
│ password_hash    │                │ symptoms_input   │
│ full_name        │                │ extracted_symptoms│
│ ...              │                │ predicted_diseases│
└────────┬─────────┘                │ doctor_alert     │
         │ 1:N                      └────────┬─────────┘
         │                                   │
         │                                   │ references
         │                                   │
         │                          ┌────────▼─────────┐
         │                          │     DISEASES     │
         │                          ├──────────────────┤
         │                          │ id (PK)          │
         │                          │ name             │
         │                          │ icd10_code       │
         │                          │ category         │
         │                          │ severity         │
         │                          └────────┬─────────┘
         │                                   │
         │                          ┌────────┴─────────┐
         │                          │                  │
         │                          │ N:M              │ N:M
         │                          │                  │
         │                          ▼                  ▼
         │                ┌──────────────────┐ ┌──────────────────┐
         │                │    SYMPTOMS      │ │  HOME_REMEDIES   │
         │                ├──────────────────┤ ├──────────────────┤
         │                │ id (PK)          │ │ id (PK)          │
         │                │ name             │ │ disease_id (FK)  │
         │                │ medical_term     │ │ remedy_text      │
         │                │ category         │ │ effectiveness    │
         │                └────────┬─────────┘ └──────────────────┘
         │                         │
         │                ┌────────▼─────────┐
         │                │ DISEASE_SYMTOMS  │
         │                ├──────────────────┤
         │                │ disease_id (FK)  │
         │                │ symptom_id (FK)  │
         │                │ confidence       │
         │                └──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ HEALTH_METRICS   │       │  NOTIFICATIONS   │       │    API_KEYS      │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ user_id (FK)     │       │ user_id (FK)     │       │ user_id (FK)     │
│ metric_type      │       │ title            │       │ key_hash         │
│ metric_value     │       │ message          │       │ permissions      │
│ unit             │       │ type             │       │ expires_at       │
│ recorded_at      │       │ is_read          │       │ is_active        │
└──────────────────┘       └──────────────────┘       └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│   AUDIT_LOGS     │       │ SYSTEM_SETTINGS  │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ user_id (FK)     │       │ setting_key      │
│ admin_user_id(FK)│       │ setting_value    │
│ action           │       │ setting_type     │
│ entity_type      │       │ is_public        │
│ timestamp        │       │ updated_at       │
└──────────────────┘       └──────────────────┘
```

---

## 📋 Table Specifications

### 1. **users** 🧑‍⚕️

**Purpose:** Stores all registered users with their health profiles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| full_name | VARCHAR(255) | NOT NULL | User's full name |
| phone | VARCHAR(20) | NULL | Contact number |
| date_of_birth | DATE | NULL | Date of birth |
| gender | ENUM | DEFAULT | Male/Female/Other/Prefer not to say |
| blood_group | VARCHAR(5) | NULL | Blood type |
| height_cm | NUMERIC(5,2) | NULL | Height in centimeters |
| weight_kg | NUMERIC(5,2) | NULL | Weight in kilograms |
| medical_history | TEXT | NULL | Pre-existing conditions |
| allergies | TEXT | NULL | Known allergies |
| current_medications | TEXT | NULL | Current medications |
| role | ENUM | DEFAULT 'patient' | patient/doctor/admin/super_admin |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| is_verified | BOOLEAN | DEFAULT FALSE | Email verification status |
| email_verified_at | TIMESTAMP | NULL | Verification timestamp |
| last_login_at | TIMESTAMP | NULL | Last login time |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_users_email` - Email lookups
- `idx_users_role` - Role-based filtering
- `idx_users_is_active` - Active user filtering
- `idx_users_created_at` - Date-based queries

**Constraints:**
- Email format validation
- Height range: 50-300 cm
- Weight range: 1-500 kg
- Age minimum: 1 year

---

### 2. **diseases** 🦠

**Purpose:** Comprehensive disease database with ICD-10 codes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique disease identifier |
| name | VARCHAR(255) | NOT NULL | Common disease name |
| medical_name | VARCHAR(255) | NULL | Medical/scientific name |
| icd10_code | VARCHAR(20) | NULL | ICD-10 classification code |
| category | ENUM | DEFAULT 'General' | Disease category (14 types) |
| severity | ENUM | DEFAULT 'Mild' | Mild/Moderate/Severe/Critical |
| description | TEXT | NULL | Detailed description |
| causes | TEXT | NULL | Known causes |
| risk_factors | TEXT | NULL | Risk factors |
| complications | TEXT | NULL | Possible complications |
| when_to_see_doctor | TEXT | NULL | Guidance for medical consultation |
| is_common | BOOLEAN | DEFAULT FALSE | Is this a common disease |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_diseases_name` - Name lookups
- `idx_diseases_icd10` - ICD-10 code lookups
- `idx_diseases_category` - Category filtering
- `idx_diseases_severity` - Severity filtering
- `idx_diseases_name_search` - Full-text search

**Sample Data:**
```sql
INSERT INTO diseases (name, medical_name, icd10_code, category, severity, description)
VALUES 
('Common Cold', 'Acute Nasopharyngitis', 'J00', 'Respiratory', 'Mild', 'Viral infection of upper respiratory tract'),
('Influenza', 'Flu', 'J11.1', 'Respiratory', 'Moderate', 'Viral infection causing fever and body aches'),
('Diabetes Type 2', 'T2DM', 'E11', 'Endocrine', 'Severe', 'Chronic metabolic disorder affecting blood sugar');
```

---

### 3. **symptoms** 🤒

**Purpose:** Standardized symptom terminology database

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique symptom identifier |
| name | VARCHAR(255) | NOT NULL | Common symptom name |
| medical_term | VARCHAR(255) | NULL | Medical terminology |
| category | ENUM | DEFAULT 'General' | Symptom category (11 types) |
| description | TEXT | NULL | Detailed description |
| synonyms | JSONB | DEFAULT [] | Alternative names array |
| is_common | BOOLEAN | DEFAULT FALSE | Is this a common symptom |
| requires_immediate_attention | BOOLEAN | DEFAULT FALSE | Emergency symptom flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Sample Data:**
```sql
INSERT INTO symptoms (name, medical_term, category, synonyms, requires_immediate_attention)
VALUES 
('Fever', 'Pyrexia', 'Vital Signs', '["high temperature", "feverish"]', FALSE),
('Chest Pain', 'Angina', 'Pain', '["chest discomfort", "heart pain"]', TRUE),
('Headache', 'Cephalalgia', 'Pain', '["head pain", "migraine"]', FALSE),
('Shortness of Breath', 'Dyspnea', 'Respiratory', '["breathing difficulty", "air hunger"]', TRUE);
```

---

### 4. **disease_symptoms** 🔗

**Purpose:** Many-to-many mapping between diseases and symptoms

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique mapping identifier |
| disease_id | UUID | FK → diseases.id | Reference to disease |
| symptom_id | UUID | FK → symptoms.id | Reference to symptom |
| confidence_weight | NUMERIC(3,2) | 0.00-1.00 | How strongly symptom indicates disease |
| is_primary_symptom | BOOLEAN | DEFAULT FALSE | Is this a primary symptom |
| frequency | VARCHAR(50) | DEFAULT 'Common' | Common/Occasional/Rare |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Constraints:**
- UNIQUE (disease_id, symptom_id) - Prevent duplicates
- CHECK confidence_weight BETWEEN 0.00 AND 1.00

**Sample Data:**
```sql
INSERT INTO disease_symptoms (disease_id, symptom_id, confidence_weight, is_primary_symptom, frequency)
VALUES 
('disease-uuid-1', 'symptom-uuid-fever', 0.85, TRUE, 'Very Common'),
('disease-uuid-1', 'symptom-uuid-cough', 0.75, FALSE, 'Common'),
('disease-uuid-2', 'symptom-uuid-chest-pain', 0.95, TRUE, 'Very Common');
```

---

### 5. **home_remedies** 🌿

**Purpose:** Evidence-based home remedies for diseases

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique remedy identifier |
| disease_id | UUID | FK → diseases.id | Reference to disease |
| remedy_text | TEXT | NOT NULL | Remedy description |
| effectiveness_rating | NUMERIC(2,1) | 1.0-5.0 | Effectiveness score |
| evidence_level | VARCHAR(50) | DEFAULT 'Traditional' | Scientific/Traditional/Anecdotal |
| contraindications | TEXT | NULL | When NOT to use |
| preparation_method | TEXT | NULL | How to prepare |
| dosage_instructions | TEXT | NULL | Usage instructions |
| side_effects | TEXT | NULL | Possible side effects |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Sample Data:**
```sql
INSERT INTO home_remedies (disease_id, remedy_text, effectiveness_rating, evidence_level)
VALUES 
('disease-uuid-cold', 'Warm salt water gargle for sore throat', 4.2, 'Scientific'),
('disease-uuid-cold', 'Steam inhalation for nasal congestion', 4.5, 'Scientific'),
('disease-uuid-cold', 'Vitamin C rich foods like oranges and lemons', 3.8, 'Traditional');
```

---

### 6. **consultations** 💬

**Purpose:** User consultation history with AI chatbot

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique consultation identifier |
| user_id | UUID | FK → users.id | Reference to user |
| symptoms_input | TEXT | NOT NULL | Raw user symptom description |
| extracted_symptoms | JSONB | DEFAULT [] | Structured symptom data |
| predicted_diseases | JSONB | DEFAULT [] | AI predictions with confidence |
| primary_prediction | UUID | FK → diseases.id | Primary predicted disease |
| confidence_score | NUMERIC(3,2) | 0.00-1.00 | Overall confidence |
| advice_given | TEXT | NULL | Medical advice provided |
| home_remedies_suggested | JSONB | DEFAULT [] | Suggested remedies |
| doctor_alert | BOOLEAN | DEFAULT FALSE | Doctor consultation flag |
| alert_reason | TEXT | NULL | Reason for alert |
| status | ENUM | DEFAULT 'completed' | Consultation status |
| session_id | VARCHAR(100) | NULL | Session identifier |
| ip_address | INET | NULL | User IP address |
| user_agent | TEXT | NULL | Browser/app info |
| response_time_ms | INTEGER | NULL | API response time |
| created_at | TIMESTAMP | DEFAULT NOW() | Consultation timestamp |
| reviewed_at | TIMESTAMP | NULL | Review timestamp |
| reviewed_by | UUID | FK → admin_users.id | Reviewer |

**Sample Data:**
```json
{
  "symptoms_input": "I have fever and headache since 2 days",
  "extracted_symptoms": ["fever", "headache"],
  "predicted_diseases": [
    {"name": "Common Cold", "confidence": 0.85},
    {"name": "Viral Fever", "confidence": 0.72}
  ],
  "advice_given": "Rest, hydration, paracetamol for fever",
  "doctor_alert": false
}
```

---

### 7. **audit_logs** 📝

**Purpose:** HIPAA-compliant audit trail

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique log identifier |
| user_id | UUID | FK → users.id | User who performed action |
| admin_user_id | UUID | FK → admin_users.id | Admin user (if applicable) |
| action | VARCHAR(100) | NOT NULL | CREATE/READ/UPDATE/DELETE/LOGIN/LOGOUT |
| entity_type | VARCHAR(100) | NOT NULL | Table/entity affected |
| entity_id | UUID | NULL | Record ID |
| old_values | JSONB | NULL | Previous state (UPDATE/DELETE) |
| new_values | JSONB | NULL | New state (CREATE/UPDATE) |
| ip_address | INET | NULL | IP address |
| user_agent | TEXT | NULL | Client info |
| timestamp | TIMESTAMP | DEFAULT NOW() | Action timestamp |

---

### 8. **admin_users** 👨‍💼

**Purpose:** Admin panel user management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique admin identifier |
| username | VARCHAR(100) | UNIQUE NOT NULL | Admin username |
| email | VARCHAR(255) | UNIQUE NOT NULL | Admin email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| full_name | VARCHAR(255) | NOT NULL | Full name |
| role | VARCHAR(50) | DEFAULT 'moderator' | Role name |
| permissions | JSONB | DEFAULT {} | Permission set |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| last_login_at | TIMESTAMP | NULL | Last login time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Default Admin:**
```
Username: admin
Email: admin@medibot.com
Password: Admin@123 (CHANGE IMMEDIATELY!)
Role: super_admin
Permissions: {"all": true}
```

---

### 9. **health_metrics** 📊

**Purpose:** User health tracking over time

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique metric identifier |
| user_id | UUID | FK → users.id | Reference to user |
| metric_type | VARCHAR(50) | NOT NULL | weight/blood_pressure/temperature/etc. |
| metric_value | NUMERIC(10,2) | NOT NULL | Measured value |
| unit | VARCHAR(20) | NOT NULL | kg/mmHg/°F/etc. |
| notes | TEXT | NULL | Additional notes |
| recorded_at | TIMESTAMP | DEFAULT NOW() | Measurement time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Supported Metric Types:**
- weight (kg)
- height (cm)
- temperature (°F/°C)
- blood_pressure_systolic (mmHg)
- blood_pressure_diastolic (mmHg)
- heart_rate (bpm)
- blood_sugar (mg/dL)
- oxygen_saturation (%)
- bmi (kg/m²)

---

### 10. **notifications** 🔔

**Purpose:** User notifications and reminders

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique notification identifier |
| user_id | UUID | FK → users.id | Reference to user |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| type | VARCHAR(50) | DEFAULT 'info' | info/warning/alert/reminder/critical |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| action_url | VARCHAR(500) | NULL | Action link |
| scheduled_for | TIMESTAMP | NULL | Scheduled delivery time |
| sent_at | TIMESTAMP | NULL | Actual send time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

---

### 11. **api_keys** 🔑

**Purpose:** Third-party integration API keys

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique key identifier |
| user_id | UUID | FK → users.id | Key owner |
| key_hash | VARCHAR(255) | NOT NULL | Hashed API key |
| name | VARCHAR(100) | NULL | Key name/description |
| permissions | JSONB | DEFAULT {} | Key permissions |
| expires_at | TIMESTAMP | NULL | Expiration time |
| last_used_at | TIMESTAMP | NULL | Last usage time |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

---

### 12. **system_settings** ⚙️

**Purpose:** Application configuration

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique setting identifier |
| setting_key | VARCHAR(100) | UNIQUE NOT NULL | Setting name |
| setting_value | TEXT | NOT NULL | Setting value |
| setting_type | VARCHAR(20) | DEFAULT 'string' | string/number/boolean/json |
| description | TEXT | NULL | Setting description |
| is_public | BOOLEAN | DEFAULT FALSE | Public/admin-only |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| updated_by | UUID | FK → admin_users.id | Who updated |

**Default Settings:**
```sql
setting_key                  | setting_value      | type
-----------------------------|--------------------|--------
app_name                     | MediBot            | string
app_version                  | 1.0.0              | string
maintenance_mode             | false              | boolean
max_consultations_per_day    | 50                 | number
doctor_alert_threshold       | 0.80               | number
session_timeout_minutes      | 60                 | number
enable_voice_input           | true               | boolean
enable_multi_language        | true               | boolean
supported_languages          | ["en", "ur"]       | json
```

---

## 📊 Database Views

### 1. **disease_summary**

Provides quick disease statistics

```sql
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
```

**Usage:**
```sql
SELECT * FROM disease_summary WHERE is_common = TRUE;
```

---

### 2. **user_consultation_stats**

User consultation analytics

```sql
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
```

---

### 3. **symptom_frequency_analysis**

Most frequently occurring symptoms

```sql
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
```

---

## 🔁 Triggers & Functions

### 1. **update_updated_at_column()**

Automatically updates `updated_at` timestamp on record modification

**Applied to:**
- users
- diseases
- symptoms
- home_remedies

```sql
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. **log_audit_event()**

Automatically logs all changes to audit_logs table

**Applied to:**
- users
- diseases
- symptoms

```sql
CREATE TRIGGER audit_users_changes 
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_audit_event();
```

---

## 🔐 Security Features

### Row-Level Security (RLS)

Enable RLS for sensitive tables:

```sql
-- Enable RLS on consultations
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own consultations
CREATE POLICY user_consultations_policy ON consultations
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);
```

### Column-Level Encryption

Encrypt sensitive columns:

```sql
-- Enable pgcrypto extension
CREATE EXTENSION pgcrypto;

-- Encrypt phone number
UPDATE users 
SET phone = pgp_sym_encrypt(phone, 'encryption-key');
```

---

## 📈 Indexing Strategy

### B-Tree Indexes (Default)
- Primary keys (automatic)
- Foreign keys
- Frequently queried columns (email, name, etc.)

### GIN Indexes (JSONB & Full-Text)
- `extracted_symptoms` in consultations
- `symptoms` JSONB columns
- Full-text search on disease names

### Partial Indexes

```sql
-- Index only active users
CREATE INDEX idx_users_active_email ON users(email) WHERE is_active = TRUE;

-- Index only doctor alerts
CREATE INDEX idx_consultations_alerts ON consultations(user_id) 
    WHERE doctor_alert = TRUE;
```

---

## 🔄 Database Migrations

Use Alembic for schema migrations:

```bash
# Initialize Alembic
cd backend
alembic init alembic

# Create new migration
alembic revision --autogenerate -m "Add new column"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 💾 Backup & Restore

### Backup

```bash
# Full database backup
pg_dump -U medibot_user -d medibot -f medibot_backup.sql

# Backup specific tables
pg_dump -U medibot_user -d medibot -t users -t consultations -f critical_data.sql

# Compressed backup
pg_dump -U medibot_user -d medibot | gzip > medibot_backup.sql.gz
```

### Restore

```bash
# Restore from backup
psql -U medibot_user -d medibot -f medibot_backup.sql

# Restore compressed backup
gunzip -c medibot_backup.sql.gz | psql -U medibot_user -d medibot
```

### Automated Backups

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * pg_dump -U medibot_user medibot | gzip > /backups/medibot_$(date +\%Y\%m\%d).sql.gz
```

---

## 🔍 Query Optimization

### Common Queries

**1. Find diseases by symptom:**
```sql
SELECT DISTINCT d.name, d.severity, ds.confidence_weight
FROM diseases d
JOIN disease_symptoms ds ON d.id = ds.disease_id
JOIN symptoms s ON ds.symptom_id = s.id
WHERE s.name ILIKE '%fever%'
ORDER BY ds.confidence_weight DESC;
```

**2. Get user consultation history:**
```sql
SELECT 
    c.created_at,
    c.symptoms_input,
    c.predicted_diseases,
    c.advice_given,
    c.doctor_alert
FROM consultations c
WHERE c.user_id = 'user-uuid'
ORDER BY c.created_at DESC
LIMIT 10;
```

**3. Disease search with full-text:**
```sql
SELECT name, icd10_code, description
FROM diseases
WHERE to_tsvector('english', name || ' ' || COALESCE(description, ''))
      @@ to_tsquery('english', 'fever & cold');
```

### Performance Tips

1. **Use EXPLAIN ANALYZE** to identify slow queries
2. **VACUUM ANALYZE** regularly to update statistics
3. **Connection pooling** with PgBouncer
4. **Partition large tables** (consultations by date)

---

## 📊 Sample Data Seeding

Run seed scripts to populate database:

```bash
cd database/seeds
python seed_diseases.py
python seed_symptoms.py
python seed_remedies.py
```

**Expected Data Volume:**
- Diseases: 200+ records
- Symptoms: 500+ records
- Disease-Symptom Mappings: 1500+ records
- Home Remedies: 400+ records

---

## 🧪 Testing Database

### Run Tests

```bash
# Create test database
createdb -U medibot_user medibot_test

# Run schema on test database
psql -U medibot_user -d medibot_test -f schema.sql

# Run tests
cd backend
pytest tests/test_database.py -v
```

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-03-25 | Initial schema release |

---

## 📞 Support

For database-related questions:
- Review this documentation
- Check SQL files in `/database` folder
- Contact Database Lead: Anas Ali (2022F-CS-072@ssuet.edu.pk)

---

**© 2024 MediBot Team. All Rights Reserved.**
