"""Test each API key individually"""
import google.generativeai as genai

keys = [
    "AIzaSyDb8ffjGGcriAbkBuYlcg0zQqT0FyBTW60",
    "AIzaSyCQGDF-lWN4-zFhr0EgXSsWytxeyL6KeAA",
    "AIzaSyDGTlU6UKsqys1NTwBziSd8n-9qI5TqWHY",
    "AIzaSyDwVnvMrOfABlCtrATQbl4dABbgEJokpQc",
    "AIzaSyDexw1HXBtP336Sv6-wtDYSozH9KhK67VU"
]

print("="*60)
print("Testing Each API Key")
print("="*60)
print()

for i, key in enumerate(keys):
    print(f"Key #{i+1}: {key[:30]}...")
    try:
        genai.configure(api_key=key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content('Hi')
        print(f"✅ WORKING! Response: {response.text[:50]}")
    except Exception as e:
        error_msg = str(e)
        if 'quota' in error_msg.lower() or '429' in error_msg:
            print(f"❌ QUOTA EXCEEDED")
        else:
            print(f"❌ ERROR: {error_msg[:50]}")
    print()

print("="*60)
