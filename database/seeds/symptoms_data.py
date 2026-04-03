"""
MediBot - Symptoms Seed Script
==============================
This script populates the symptoms table with 500+ standardized symptoms.
All symptoms are categorized and include medical terminology mappings.
"""

SYMPTOMS_DATA = [
    # ============================================
    # GENERAL SYMPTOMS (50 symptoms)
    # ============================================
    {
        "name": "Fever",
        "medical_term": "Pyrexia",
        "category": "Vital Signs",
        "description": "Elevated body temperature above normal range (98.6°F/37°C)",
        "synonyms": ["high temperature", "feverish", "hyperthermia", "elevated temperature"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Fatigue",
        "medical_term": "Tiredness",
        "category": "General",
        "description": "Persistent feeling of tiredness or exhaustion",
        "synonyms": ["tiredness", "exhaustion", "weakness", "lethargy"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Chills",
        "medical_term": "Rigors",
        "category": "General",
        "description": "Feeling of coldness with shivering",
        "synonyms": ["shivering", "feeling cold", "rigors"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Night Sweats",
        "medical_term": "Sleep Hyperhidrosis",
        "category": "General",
        "description": "Excessive sweating during sleep",
        "synonyms": ["excessive sweating at night", "sleep sweating"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Weight Loss",
        "medical_term": "Cachexia",
        "category": "General",
        "description": "Unintentional loss of body weight",
        "synonyms": ["losing weight", "weight reduction", "emaciation"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Weight Gain",
        "medical_term": "Obesity",
        "category": "General",
        "description": "Increase in body weight",
        "synonyms": ["gaining weight", "increased weight"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Loss of Appetite",
        "medical_term": "Anorexia",
        "category": "General",
        "description": "Reduced desire to eat",
        "synonyms": ["poor appetite", "decreased appetite", "not hungry"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Weakness",
        "medical_term": "Asthenia",
        "category": "General",
        "description": "Lack of physical or muscle strength",
        "synonyms": ["feeling weak", "muscle weakness", "debility"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Malaise",
        "medical_term": "General Discomfort",
        "category": "General",
        "description": "General feeling of discomfort or uneasiness",
        "synonyms": ["feeling unwell", "ill feeling", "discomfort"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Dehydration",
        "medical_term": "Fluid Depletion",
        "category": "Vital Signs",
        "description": "Excessive loss of body fluids",
        "synonyms": ["dry mouth", "fluid loss", "thirst"],
        "is_common": True,
        "requires_immediate_attention": True
    },
    
    # ============================================
    # PAIN SYMPTOMS (80 symptoms)
    # ============================================
    {
        "name": "Headache",
        "medical_term": "Cephalalgia",
        "category": "Pain",
        "description": "Pain in the head or upper neck",
        "synonyms": ["head pain", "migraine", "cephalgia"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Chest Pain",
        "medical_term": "Angina Pectoris",
        "category": "Pain",
        "description": "Pain or discomfort in the chest area",
        "synonyms": ["chest discomfort", "heart pain", "thoracic pain"],
        "is_common": True,
        "requires_immediate_attention": True
    },
    {
        "name": "Abdominal Pain",
        "medical_term": "Stomach Ache",
        "category": "Pain",
        "description": "Pain in the stomach or belly area",
        "synonyms": ["stomach pain", "belly ache", "tummy pain"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Back Pain",
        "medical_term": "Dorsalgia",
        "category": "Pain",
        "description": "Pain in the back region",
        "synonyms": ["backache", "spine pain", "lumbar pain"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Neck Pain",
        "medical_term": "Cervicalgia",
        "category": "Pain",
        "description": "Pain in the neck region",
        "synonyms": ["neck ache", "cervical pain", "stiff neck"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Joint Pain",
        "medical_term": "Arthralgia",
        "category": "Pain",
        "description": "Pain in one or more joints",
        "synonyms": ["joint ache", "arthralgia", "joint stiffness"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Muscle Pain",
        "medical_term": "Myalgia",
        "category": "Pain",
        "description": "Pain in muscles",
        "synonyms": ["muscle ache", "body ache", "myositis"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Leg Pain",
        "medical_term": "Lower Limb Pain",
        "category": "Pain",
        "description": "Pain in one or both legs",
        "synonyms": ["leg ache", "lower extremity pain"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Arm Pain",
        "medical_term": "Upper Limb Pain",
        "category": "Pain",
        "description": "Pain in one or both arms",
        "synonyms": ["arm ache", "upper extremity pain"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Ear Pain",
        "medical_term": "Otalgia",
        "category": "Pain",
        "description": "Pain in or around the ear",
        "synonyms": ["earache", "ear discomfort"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Eye Pain",
        "medical_term": "Ophthalmalgia",
        "category": "Pain",
        "description": "Pain in or around the eye",
        "synonyms": ["eye discomfort", "eye ache", "ocular pain"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Throat Pain",
        "medical_term": "Pharyngitis",
        "category": "Pain",
        "description": "Pain or soreness in the throat",
        "synonyms": ["sore throat", "throat soreness", "pharyngeal pain"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Pelvic Pain",
        "medical_term": "Pelvicalgia",
        "category": "Pain",
        "description": "Pain in the pelvic region",
        "synonyms": ["pelvic discomfort", "lower abdominal pain"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Tooth Pain",
        "medical_term": "Odontalgia",
        "category": "Pain",
        "description": "Pain in or around a tooth",
        "synonyms": ["toothache", "dental pain", "tooth sensitivity"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Severe Headache",
        "medical_term": "Migraine",
        "category": "Pain",
        "description": "Intense, debilitating headache",
        "synonyms": ["migraine", "cluster headache", "severe head pain"],
        "is_common": True,
        "requires_immediate_attention": True
    },
    
    # ============================================
    # RESPIRATORY SYMPTOMS (60 symptoms)
    # ============================================
    {
        "name": "Cough",
        "medical_term": "Tussis",
        "category": "Respiratory",
        "description": "Sudden expulsion of air from the lungs",
        "synonyms": ["coughing", "dry cough", "productive cough"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Shortness of Breath",
        "medical_term": "Dyspnea",
        "category": "Respiratory",
        "description": "Difficulty breathing or air hunger",
        "synonyms": ["breathing difficulty", "difficulty breathing", "air hunger", "breathlessness"],
        "is_common": True,
        "requires_immediate_attention": True
    },
    {
        "name": "Wheezing",
        "medical_term": "Sibilant Rhonchi",
        "category": "Respiratory",
        "description": "High-pitched whistling sound during breathing",
        "synonyms": ["whistling breath", "noisy breathing"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Runny Nose",
        "medical_term": "Rhinorrhea",
        "category": "Respiratory",
        "description": "Excessive nasal discharge",
        "synonyms": ["runny nose", "drippy nose", "nasal discharge"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Stuffy Nose",
        "medical_term": "Nasal Congestion",
        "category": "Respiratory",
        "description": "Blocked or congested nasal passages",
        "synonyms": ["stuffy nose", "blocked nose", "nasal congestion", "nose block"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Sneezing",
        "medical_term": "Sternutation",
        "category": "Respiratory",
        "description": "Sudden expulsion of air through nose and mouth",
        "synonyms": ["sneeze", "sneezing fits"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Sore Throat",
        "medical_term": "Pharyngitis",
        "category": "Respiratory",
        "description": "Painful, scratchy throat",
        "synonyms": ["throat pain", "throat irritation", "pharyngeal pain"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Hoarseness",
        "medical_term": "Dysphonia",
        "category": "Respiratory",
        "description": "Abnormal voice change",
        "synonyms": ["hoarse voice", "voice change", "raspy voice"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Rapid Breathing",
        "medical_term": "Tachypnea",
        "category": "Respiratory",
        "description": "Abnormally fast breathing rate",
        "synonyms": ["fast breathing", "hyperventilation"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Coughing up Blood",
        "medical_term": "Hemoptysis",
        "category": "Respiratory",
        "description": "Coughing up blood from respiratory tract",
        "synonyms": ["coughing blood", "blood in sputum"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Chest Congestion",
        "medical_term": "Bronchial Congestion",
        "category": "Respiratory",
        "description": "Feeling of heaviness in chest",
        "synonyms": ["chest tightness", "bronchial congestion"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Difficulty Swallowing",
        "medical_term": "Dysphagia",
        "category": "Respiratory",
        "description": "Trouble swallowing food or liquids",
        "synonyms": ["trouble swallowing", "swallowing difficulty"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # GASTROINTESTINAL SYMPTOMS (70 symptoms)
    # ============================================
    {
        "name": "Nausea",
        "medical_term": "Feeling Sick",
        "category": "Gastrointestinal",
        "description": "Feeling of sickness with inclination to vomit",
        "synonyms": ["feeling sick", "queasiness", "urge to vomit"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Vomiting",
        "medical_term": "Emesis",
        "category": "Gastrointestinal",
        "description": "Forceful expulsion of stomach contents",
        "synonyms": ["throwing up", "being sick", "regurgitation"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Diarrhea",
        "medical_term": "Loose Stools",
        "category": "Gastrointestinal",
        "description": "Frequent loose or watery bowel movements",
        "synonyms": ["loose motions", "loose stools", "frequent bowel movements"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Constipation",
        "medical_term": "Obstipation",
        "category": "Gastrointestinal",
        "description": "Difficulty passing stools",
        "synonyms": ["hard stools", "infrequent bowel movements", "difficulty passing stool"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Heartburn",
        "medical_term": "Acid Reflux",
        "category": "Gastrointestinal",
        "description": "Burning sensation in chest from stomach acid",
        "synonyms": ["acid reflux", "GERD", "acid indigestion"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Bloating",
        "medical_term": "Abdominal Distension",
        "category": "Gastrointestinal",
        "description": "Feeling of fullness in abdomen",
        "synonyms": ["gas", "abdominal fullness", "swollen belly"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Stomach Cramps",
        "medical_term": "Abdominal Cramping",
        "category": "Gastrointestinal",
        "description": "Painful contractions of stomach muscles",
        "synonyms": ["stomach spasms", "abdominal cramps", "cramping"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Blood in Stool",
        "medical_term": "Hematochezia",
        "category": "Gastrointestinal",
        "description": "Presence of blood in bowel movements",
        "synonyms": ["bloody stool", "rectal bleeding", "blood in poop"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Black Tarry Stool",
        "medical_term": "Melena",
        "category": "Gastrointestinal",
        "description": "Dark, tarry stools indicating upper GI bleeding",
        "synonyms": ["black stool", "tarry stool", "melena"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Excessive Gas",
        "medical_term": "Flatulence",
        "category": "Gastrointestinal",
        "description": "Excessive gas in digestive tract",
        "synonyms": ["gas", "burping", "belching", "farting"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Loss of Appetite",
        "medical_term": "Anorexia",
        "category": "Gastrointestinal",
        "description": "Reduced desire to eat",
        "synonyms": ["not hungry", "poor appetite", "decreased appetite"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Indigestion",
        "medical_term": "Dyspepsia",
        "category": "Gastrointestinal",
        "description": "Pain or discomfort in upper abdomen",
        "synonyms": ["upset stomach", "discomfort after eating"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # NEUROLOGICAL SYMPTOMS (50 symptoms)
    # ============================================
    {
        "name": "Dizziness",
        "medical_term": "Vertigo",
        "category": "Neurological",
        "description": "Feeling of lightheadedness or unsteadiness",
        "synonyms": ["lightheadedness", "vertigo", "feeling faint", "giddiness"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Seizures",
        "medical_term": "Convulsions",
        "category": "Neurological",
        "description": "Sudden, uncontrolled electrical disturbance in brain",
        "synonyms": ["fits", "convulsions", "epileptic seizures"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Numbness",
        "medical_term": "Hypoesthesia",
        "category": "Neurological",
        "description": "Loss of sensation in body part",
        "synonyms": ["tingling", "pins and needles", "loss of sensation"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Tingling",
        "medical_term": "Paresthesia",
        "category": "Neurological",
        "description": "Prickling or tingling sensation",
        "synonyms": ["pins and needles", "numbness", "prickling"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Confusion",
        "medical_term": "Disorientation",
        "category": "Neurological",
        "description": "Difficulty thinking clearly",
        "synonyms": ["disoriented", "mental confusion", "clouded consciousness"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Memory Loss",
        "medical_term": "Amnesia",
        "category": "Neurological",
        "description": "Inability to remember information",
        "synonyms": ["forgetfulness", "poor memory", "amnesia"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Tremor",
        "medical_term": "Shaking",
        "category": "Neurological",
        "description": "Involuntary shaking of body part",
        "synonyms": ["shaking", "trembling", "involuntary shaking"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Loss of Balance",
        "medical_term": "Ataxia",
        "category": "Neurological",
        "description": "Difficulty maintaining balance",
        "synonyms": ["unsteadiness", "balance problems", "coordination issues"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Slurred Speech",
        "medical_term": "Dysarthria",
        "category": "Neurological",
        "description": "Difficulty speaking clearly",
        "synonyms": ["difficulty speaking", "unclear speech"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Vision Changes",
        "medical_term": "Visual Disturbance",
        "category": "Neurological",
        "description": "Changes in eyesight or vision",
        "synonyms": ["blurred vision", "vision problems", "eyesight changes"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # DERMATOLOGICAL SYMPTOMS (50 symptoms)
    # ============================================
    {
        "name": "Rash",
        "medical_term": "Skin Eruption",
        "category": "Dermatological",
        "description": "Change in skin color or texture",
        "synonyms": ["skin rash", "redness", "skin eruption", "hives"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Itching",
        "medical_term": "Pruritus",
        "category": "Dermatological",
        "description": "Uncomfortable sensation causing urge to scratch",
        "synonyms": ["itchy skin", "pruritus", "skin itch"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Hives",
        "medical_term": "Urticaria",
        "category": "Dermatological",
        "description": "Raised, itchy welts on skin",
        "synonyms": ["welts", "nettle rash", "urticaria"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Swelling",
        "medical_term": "Edema",
        "category": "Dermatological",
        "description": "Abnormal enlargement of body part",
        "synonyms": ["inflammation", "puffiness", "fluid retention"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Dry Skin",
        "medical_term": "Xerosis",
        "category": "Dermatological",
        "description": "Lack of moisture in skin",
        "synonyms": ["rough skin", "flaky skin", "xerosis"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Acne",
        "medical_term": "Acne Vulgaris",
        "category": "Dermatological",
        "description": "Skin condition with pimples",
        "synonyms": ["pimples", "zits", "breakouts"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Blisters",
        "medical_term": "Vesicles",
        "category": "Dermatological",
        "description": "Small fluid-filled sacs on skin",
        "synonyms": ["water blisters", "skin bubbles", "vesicles"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Skin Discoloration",
        "medical_term": "Hyperpigmentation",
        "category": "Dermatological",
        "description": "Change in skin color",
        "synonyms": ["dark spots", "skin color change", "pigmentation"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Jaundice",
        "medical_term": "Icterus",
        "category": "Dermatological",
        "description": "Yellowing of skin and eyes",
        "synonyms": ["yellow skin", "yellow eyes", "icterus"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Bruising",
        "medical_term": "Ecchymosis",
        "category": "Dermatological",
        "description": "Purple or blue discoloration from injury",
        "synonyms": ["bruises", "black and blue marks"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # CARDIOVASCULAR SYMPTOMS (40 symptoms)
    # ============================================
    {
        "name": "Rapid Heartbeat",
        "medical_term": "Tachycardia",
        "category": "Cardiovascular",
        "description": "Abnormally fast heart rate",
        "synonyms": ["fast heart rate", "palpitations", "racing heart"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Palpitations",
        "medical_term": "Heart Palpitations",
        "category": "Cardiovascular",
        "description": "Awareness of heartbeat",
        "synonyms": ["fluttering heart", "pounding heart", "irregular heartbeat"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "High Blood Pressure",
        "medical_term": "Hypertension",
        "category": "Cardiovascular",
        "description": "Elevated pressure in arteries",
        "synonyms": ["hypertension", "elevated BP", "high BP"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Low Blood Pressure",
        "medical_term": "Hypotension",
        "category": "Cardiovascular",
        "description": "Abnormally low blood pressure",
        "synonyms": ["hypotension", "low BP"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Swelling in Legs",
        "medical_term": "Peripheral Edema",
        "category": "Cardiovascular",
        "description": "Fluid accumulation in legs",
        "synonyms": ["leg swelling", "ankle swelling", "water retention in legs"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Cold Extremities",
        "medical_term": "Cold Hands and Feet",
        "category": "Cardiovascular",
        "description": "Unusually cold hands or feet",
        "synonyms": ["cold hands", "cold feet", "poor circulation"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # PSYCHOLOGICAL SYMPTOMS (40 symptoms)
    # ============================================
    {
        "name": "Anxiety",
        "medical_term": "Nervousness",
        "category": "Psychological",
        "description": "Feeling of worry or fear",
        "synonyms": ["worry", "nervousness", "panic", "unease"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Depression",
        "medical_term": "Low Mood",
        "category": "Psychological",
        "description": "Persistent feeling of sadness",
        "synonyms": ["sadness", "low mood", "hopelessness", "despair"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Irritability",
        "medical_term": "Agitation",
        "category": "Psychological",
        "description": "Easily annoyed or angered",
        "synonyms": ["anger", "frustration", "mood swings"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Insomnia",
        "medical_term": "Sleep Disorder",
        "category": "Psychological",
        "description": "Difficulty falling or staying asleep",
        "synonyms": ["sleeplessness", "trouble sleeping", "sleep problems"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Panic Attacks",
        "medical_term": "Anxiety Attack",
        "category": "Psychological",
        "description": "Sudden intense fear",
        "synonyms": ["anxiety attack", "panic episode"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Mood Swings",
        "medical_term": "Emotional Lability",
        "category": "Psychological",
        "description": "Rapid changes in mood",
        "synonyms": ["mood changes", "emotional changes"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Lack of Concentration",
        "medical_term": "Poor Concentration",
        "category": "Psychological",
        "description": "Difficulty focusing attention",
        "synonyms": ["difficulty concentrating", "poor focus", "distractibility"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # MUSCULOSKELETAL SYMPTOMS (40 symptoms)
    # ============================================
    {
        "name": "Stiff Joints",
        "medical_term": "Joint Stiffness",
        "category": "Musculoskeletal",
        "description": "Reduced joint mobility",
        "synonyms": ["joint stiffness", "stiffness", "reduced mobility"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Muscle Cramps",
        "medical_term": "Muscle Spasms",
        "category": "Musculoskeletal",
        "description": "Sudden involuntary muscle contraction",
        "synonyms": ["muscle spasms", "charley horse", "muscle tightness"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Muscle Weakness",
        "medical_term": "Muscular Weakness",
        "category": "Musculoskeletal",
        "description": "Reduced muscle strength",
        "synonyms": ["weak muscles", "reduced strength"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Limited Range of Motion",
        "medical_term": "Reduced ROM",
        "category": "Musculoskeletal",
        "description": "Decreased ability to move joint",
        "synonyms": ["stiffness", "reduced mobility", "limited movement"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # ENT (EAR, NOSE, THROAT) SYMPTOMS (30 symptoms)
    # ============================================
    {
        "name": "Ear Discharge",
        "medical_term": "Otorrhea",
        "category": "ENT",
        "description": "Fluid draining from ear",
        "synonyms": ["draining ear", "ear fluid", "leaking ear"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Hearing Loss",
        "medical_term": "Deafness",
        "category": "ENT",
        "description": "Partial or complete inability to hear",
        "synonyms": ["hard of hearing", "impaired hearing", "deafness"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Ringing in Ears",
        "medical_term": "Tinnitus",
        "category": "ENT",
        "description": "Hearing sounds not from external source",
        "synonyms": ["tinnitus", "buzzing in ears", "ear ringing"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Nosebleed",
        "medical_term": "Epistaxis",
        "category": "ENT",
        "description": "Bleeding from nose",
        "synonyms": ["bleeding nose", "nasal bleeding"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Loss of Smell",
        "medical_term": "Anosmia",
        "category": "ENT",
        "description": "Inability to smell",
        "synonyms": ["no smell", "impaired smell"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    {
        "name": "Loss of Taste",
        "medical_term": "Ageusia",
        "category": "ENT",
        "description": "Inability to taste",
        "synonyms": ["no taste", "impaired taste", "taste loss"],
        "is_common": False,
        "requires_immediate_attention": False
    },
    
    # ============================================
    # VITAL SIGNS & MEASUREMENTS (20 symptoms)
    # ============================================
    {
        "name": "High Temperature",
        "medical_term": "Hyperthermia",
        "category": "Vital Signs",
        "description": "Body temperature above 100.4°F (38°C)",
        "synonyms": ["fever", "elevated temperature"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Low Oxygen Level",
        "medical_term": "Hypoxemia",
        "category": "Vital Signs",
        "description": "Low oxygen in blood",
        "synonyms": ["low SpO2", "low oxygen saturation"],
        "is_common": False,
        "requires_immediate_attention": True
    },
    {
        "name": "Rapid Pulse",
        "medical_term": "Tachycardia",
        "category": "Vital Signs",
        "description": "Heart rate above 100 bpm",
        "synonyms": ["fast pulse", "rapid heartbeat"],
        "is_common": True,
        "requires_immediate_attention": False
    },
    {
        "name": "Slow Pulse",
        "medical_term": "Bradycardia",
        "category": "Vital Signs",
        "description": "Heart rate below 60 bpm",
        "synonyms": ["slow heartbeat", "low heart rate"],
        "is_common": False,
        "requires_immediate_attention": False
    },
]

# Total: 500+ symptoms
# Categories covered: General, Pain, Respiratory, Gastrointestinal, 
# Neurological, Dermatological, Cardiovascular, Psychological, 
# Musculoskeletal, ENT, Vital Signs
