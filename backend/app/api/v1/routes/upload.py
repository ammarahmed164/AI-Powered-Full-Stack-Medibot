"""
File Upload Routes
===================
Upload and analyze medical reports (images/documents)
With NON-MEDICAL detection
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
import httpx
import base64
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# Use same 5 API keys as chatbot with rotation
GEMINI_KEYS = eval(os.getenv("GEMINI_API_KEYS", '[]'))
GEMINI_API_KEY = GEMINI_KEYS[0] if GEMINI_KEYS else ""
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Allowed file extensions
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'doc', 'docx', 'txt'}

# Medical keywords
MEDICAL_KEYWORDS = [
    'blood', 'test', 'report', 'lab', 'hospital', 'x-ray', 'mri', 'ct', 'scan',
    'ultrasound', 'prescription', 'medicine', 'diagnosis', 'hemoglobin', 'sugar',
    'cholesterol', 'patient', 'doctor', 'clinic', 'medical', 'health', 'disease',
    'fever', 'pain', 'symptom', 'treatment', 'medicine', 'drug', 'dose'
]

# Non-medical keywords
NON_MEDICAL_KEYWORDS = [
    'code', 'programming', 'python', 'javascript', 'java', 'html', 'css',
    'meme', 'funny', 'joke', 'car', 'bike', 'vehicle', 'food', 'recipe',
    'movie', 'song', 'music', 'game', 'sport', 'travel', 'vacation'
]

@router.post("/upload-report")
async def upload_report(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    report_type: str = Form(...)
):
    """Upload medical report and get AI analysis with NON-MEDICAL detection"""
    print(f"\n=== UPLOAD REQUEST RECEIVED ===")
    print(f"File: {file.filename}")
    print(f"User ID: {user_id}")
    print(f"Report Type: {report_type}")
    
    try:
        # Layer 1: File type check
        file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        print(f"File extension: {file_ext}")
        
        if file_ext not in ALLOWED_EXTENSIONS:
            print(f"Invalid file extension: {file_ext}")
            return JSONResponse(content={
                "success": False,
                "error": "Please upload a valid file (image or document).",
                "analysis": "I can only analyze images and documents. Please upload a medical report like blood test, X-ray, or lab report."
            })
        
        # Read file
        print("Reading file...")
        contents = await file.read()
        print(f"File size: {len(contents)} bytes")
        
        # Convert to base64
        print("Converting to base64...")
        file_base64 = base64.b64encode(contents).decode('utf-8')
        print(f"Base64 length: {len(file_base64)}")
        
        # Layer 2 & 3: AI analysis with medical detection
        print("Calling AI analysis...")
        analysis = await analyze_medical_report(file_base64, file.content_type, report_type, file.filename)
        print(f"Analysis received: {len(analysis)} chars")
        
        # Check if non-medical
        if "NON_MEDICAL" in analysis or "not a medical" in analysis.lower():
            print("Non-medical content detected")
            return JSONResponse(content={
                "success": False,
                "error": "Non-medical content detected",
                "analysis": analysis
            })
        
        # Save to database
        print("Saving to database...")
        await save_report_to_db(user_id, report_type, file.filename, analysis)
        
        print("Upload successful!")
        return JSONResponse(content={
            "success": True,
            "analysis": analysis,
            "file_name": file.filename
        })
    
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

async def analyze_medical_report(file_base64: str, content_type: str, report_type: str, filename: str) -> str:
    """Analyze medical report with Gemini AI - includes NON-MEDICAL detection"""
    
    # Smart prompt with detection
    prompt = f"""You are a professional medical analyst. Analyze this {report_type}.

IMPORTANT - FIRST CHECK:
Is this image/document MEDICAL related?

Check for:
- Blood test results
- Medical reports
- X-rays, MRI, CT scans
- Lab reports
- Prescription
- Health documents
- Medical images

If you see:
- Code/programming → Say: "This appears to be code or programming content. I'm a medical assistant and can only analyze medical reports."
- Meme/funny image → Say: "This appears to be a non-medical image. I can only analyze medical reports."
- Car/vehicle → Say: "This appears to be a vehicle image. I can only analyze medical reports."
- Food → Say: "This appears to be food. I can only analyze medical reports."
- Anything non-medical → Politely refuse

If MEDICAL, provide:

**Report Analysis:**

**Key Findings:**
- List all important values/observations

**Normal vs Abnormal:**
- Mark which values are normal (✓)
- Mark which values are abnormal (⚠️)

**Medical Interpretation:**
- What do these results indicate?
- Any potential conditions?

**Recommendations:**
- Should the patient consult a doctor?
- Any follow-up tests needed?
- Lifestyle recommendations?

**Simple Explanation:**
- Explain in very simple words
- Use everyday language
- Avoid medical jargon

IMPORTANT:
- This is for informational purposes only
- Always recommend consulting a real doctor
- Do NOT provide definitive diagnosis
- Use simple language"""

    # Call Gemini API with image
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": content_type,
                        "data": file_base64
                    }
                }
            ]
        }]
    }
    
    async with httpx.AsyncClient() as client:
        print(f"Calling Gemini API...")
        print(f"API Key: {GEMINI_API_KEY[:20]}...")
        print(f"File size: {len(file_base64)} bytes")
        
        try:
            # Try with each API key until one works
            for i, api_key in enumerate(GEMINI_KEYS):
                print(f"Trying API Key #{i+1}: {api_key[:20]}...")
                
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}",
                    headers=headers,
                    json=payload,
                    timeout=60.0
                )
                
                print(f"Gemini API Status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    if "candidates" in result and len(result["candidates"]) > 0:
                        analysis = result["candidates"][0]["content"]["parts"][0]["text"]
                        print(f"Analysis successful with Key #{i+1}: {len(analysis)} chars")
                        return analysis
                    else:
                        print("No candidates in response")
                        return "No analysis available. Please try again."
                elif response.status_code == 429:
                    print(f"Key #{i+1} quota exceeded, trying next key...")
                    continue  # Try next key
                elif response.status_code == 400:
                    print(f"Bad Request: {response.text[:100]}")
                    return f"Invalid request: {response.text[:100]}"
                elif response.status_code == 403:
                    print(f"Permission Denied: {response.text[:100]}")
                    return "API key permission denied. Check API key validity."
                else:
                    print(f"Unexpected status: {response.status_code}")
                    return f"API error: {response.status_code}"
            
            # All keys exhausted
            print("All API keys quota exceeded!")
            return "All API keys quota exceeded. Please try again in 24 hours or add new API keys."
            
        except httpx.TimeoutException as e:
            print(f"Timeout error: {str(e)}")
            return "Request timeout. File might be too large. Try with smaller file."
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            return f"Analysis error: {str(e)}"

async def save_report_to_db(user_id: str, report_type: str, file_name: str, analysis: str):
    """Save report to database"""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    report_data = {
        "user_id": user_id,
        "report_type": report_type,
        "file_name": file_name,
        "analysis_result": analysis
    }
    
    async with httpx.AsyncClient() as client:
        try:
            await client.post(
                f"{SUPABASE_URL}/rest/v1/medical_reports",
                headers=headers,
                json=report_data
            )
        except:
            pass  # Don't fail if DB save fails
