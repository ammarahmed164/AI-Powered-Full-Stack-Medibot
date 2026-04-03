# ============================================
# MediBot Database Seed Scripts
# ============================================
# Python scripts to populate database with
# professional medical data
# NO External Datasets - Custom Created Data
# ============================================

"""
Seed Data Overview:
-------------------
This seed package contains comprehensive medical data:

1. Diseases: 200+ conditions across 14 categories
2. Symptoms: 500+ standardized symptoms
3. Disease-Symptom Mappings: 1500+ relationships
4. Home Remedies: 400+ evidence-based remedies

Data Categories:
----------------
- Respiratory Diseases (Common Cold, Flu, Asthma, etc.)
- Cardiovascular Diseases (Hypertension, Heart Disease, etc.)
- Neurological Disorders (Migraine, Epilepsy, etc.)
- Gastrointestinal Diseases (GERD, IBS, etc.)
- Dermatological Conditions (Eczema, Psoriasis, etc.)
- Endocrine Disorders (Diabetes, Thyroid, etc.)
- Mental Health Conditions (Anxiety, Depression, etc.)
- And 7 more categories...

Data Quality:
-------------
- ICD-10 coded diseases
- Medical terminology mapped
- Evidence-based remedies
- Confidence-weighted symptom mappings
- Severity classifications

Usage:
------
Run seed scripts in order:
1. python seed_symptoms.py
2. python seed_diseases.py
3. python seed_disease_symptoms.py
4. python seed_home_remedies.py

"""
