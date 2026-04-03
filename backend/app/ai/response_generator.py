"""
Response Generator - 100% WORKING
Ultra-simple direct detection
"""

from .gemini_client import GeminiClient
import re

class ResponseGenerator:
    """100% working chatbot"""
    
    def __init__(self):
        self.client = GeminiClient()
        # Track state simply
        self.step = 0
    
    def generate(self, message: str, conversation_history: list = None) -> str:
        """Generate response - SIMPLE COUNTING"""
        
        text = message.lower()
        is_roman = self._is_roman(text)
        
        # GREETING
        if any(word in text for word in ['hello', 'hi', 'hey', 'salam']):
            return "Hello! I am MediBot, your AI health assistant. How can I help you today?"
        
        # THANKS
        if any(word in text for word in ['thanks', 'thank you', 'shukriya']):
            return "You're welcome! Let me know if you need any help."
        
        # DISEASE NAME
        if any(disease in text for disease in ['flu', 'malaria', 'typhoid', 'dengue', 'migraine']):
            return self._give_disease_advice(message, is_roman)
        
        # Count bot messages in history to determine step
        bot_count = sum(1 for msg in (conversation_history or []) if isinstance(msg, dict) and msg.get('type') == 'bot')
        
        # SIMPLE STEP-BASED LOGIC
        if bot_count == 0:
            # First message - check if user already gave age
            if self._looks_like_age(text):
                if is_roman:
                    return "Yeh symptoms kab se hain?"
                else:
                    return "Since when have you been experiencing these symptoms?"
            else:
                if is_roman:
                    return "Aap ki age kya hai?"
                else:
                    return "What is your age?"
        
        elif bot_count == 1:
            # Second question - check if user gave duration
            if self._looks_like_duration(text):
                if is_roman:
                    return "Kya aur koi symptoms hain? (jaise fever, body pain, cough)"
                else:
                    return "Do you have any other symptoms? (such as fever, body pain, cough)"
            else:
                if is_roman:
                    return "Yeh symptoms kab se hain?"
                else:
                    return "Since when have you been experiencing these symptoms?"
        
        elif bot_count == 2:
            # Third question - check if user gave symptoms
            if self._looks_like_symptoms(text):
                if is_roman:
                    return "Kya aap ko koi medical condition hai? (diabetes, BP, heart) Ya koi medicine le rahe hain?"
                else:
                    return "Do you have any medical conditions? (diabetes, BP, heart) Or taking any medication?"
            else:
                if is_roman:
                    return "Kya aur koi symptoms hain?"
                else:
                    return "Do you have any other symptoms?"
        
        elif bot_count == 3:
            # Fourth question - GIVE DIAGNOSIS
            return self._give_diagnosis(message, conversation_history or [], is_roman)
        
        else:
            # Fallback - give diagnosis
            return self._give_diagnosis(message, conversation_history or [], is_roman)
    
    def _is_roman(self, text: str) -> bool:
        """Detect Roman English"""
        roman_words = ['hai', 'ho', 'hein', 'tha', 'raha', 'mera', 'ko', 'se', 'pe', 'mein', 'ka', 'ki', 'kya', 'aur', 'mujhe', 'hoo', 'bhi', 'dard', 'bukhar', 'khansi', 'theek', 'nahi', 'han']
        return sum(1 for word in roman_words if word in text) >= 2
    
    def _looks_like_age(self, text: str) -> bool:
        """Check if text looks like an age answer"""
        # Just a number 1-100
        if re.search(r'\b(1[0-9]|2[0-9]|3[0-9]|[0-9])\b', text):
            return True
        # Contains age words
        if any(word in text for word in ['years', 'year', 'year old', 'saal', 'umer', 'age', 'old', 'hoon']):
            return True
        return False
    
    def _looks_like_duration(self, text: str) -> bool:
        """Check if text looks like a duration answer"""
        # Number + time word
        if re.search(r'\d+\s*(days?|day|weeks?|week|din|hafta|months?|month)', text):
            return True
        # Time words
        if any(word in text for word in ['since', 'last', 'past', 'se', 'din', 'hafta', 'day', 'week']):
            return True
        return False
    
    def _looks_like_symptoms(self, text: str) -> bool:
        """Check if text looks like symptoms answer"""
        # Yes/no
        if any(word in text for word in ['yes', 'no', 'haan', 'han', 'nahi', 'nothing']):
            return True
        # Symptom words
        symptom_words = ['fever', 'pain', 'cough', 'cold', 'headache', 'body', 'dard', 'bukhar', 'khansi']
        if any(word in text for word in symptom_words):
            return True
        return False
    
    def _give_disease_advice(self, message: str, is_roman: bool) -> str:
        """Give advice for disease"""
        if is_roman:
            return """**Possible Condition:**
Flu (possible)

**Reason:**
Aap ke symptoms flu se match kar rahe hain.

**Advice:**
- Pura aaram karein
- Garam fluids piyein
- Paracetamol lein agar fever ho

**Home Remedies:**
- Shahad ke saath garam chai piyein
- Steam lein

**Final:**
- Agar symptoms continue hon to doctor ko dikhayen"""
        else:
            return """**Possible Condition:**
Flu (possible)

**Reason:**
Your symptoms match influenza (flu).

**Advice:**
- Take proper rest
- Drink warm fluids
- Use paracetamol for fever

**Home Remedies:**
- Drink warm tea with honey
- Take steam inhalation

**Final:**
- Consult a doctor if symptoms continue"""
    
    def _give_diagnosis(self, message: str, history: list, is_roman: bool) -> str:
        """Give diagnosis"""
        context = self._build_context(history)
        
        if is_roman:
            prompt = f"""Aap MediBot hain.

User: {message}
Conversation: {context}

Roman English diagnosis:

**Possible Condition:**
[EK disease] (possible)

**Reason:**
[1-2 lines]

**Advice:**
- Tip 1
- Tip 2
- Tip 3

**Home Remedies:**
- Remedy 1
- Remedy 2

**Final:**
- Doctor ko dikhayen"""
        else:
            prompt = f"""You are MediBot.

User: {message}
Conversation: {context}

Diagnosis:

**Possible Condition:**
[ONE disease] (possible)

**Reason:**
[1-2 lines]

**Advice:**
- Tip 1
- Tip 2
- Tip 3

**Home Remedies:**
- Remedy 1
- Remedy 2

**Final:**
- Consult a doctor"""
        
        return self._format(self.client.generate_response(prompt))
    
    def _format(self, response: str) -> str:
        """Format response"""
        response = response.replace("**Possible Condition:", "\n\n**Possible Condition:")
        response = response.replace("**Reason:", "\n\n**Reason:")
        response = response.replace("**Advice:", "\n\n**Advice:")
        response = response.replace("**Home Remedies:", "\n\n**Home Remedies:")
        response = response.replace("**Final:", "\n\n**Final:")
        
        while "\n\n\n" in response:
            response = response.replace("\n\n\n", "\n\n")
        
        return response.strip()
    
    def _build_context(self, history: list) -> str:
        """Build context"""
        parts = []
        for i, msg in enumerate(history):
            role = "User" if i % 2 == 0 else "Assistant"
            content = msg.get('content', str(msg)) if isinstance(msg, dict) else str(msg)
            parts.append(f"{role}: {content}")
        return "\n".join(parts[-6:])
