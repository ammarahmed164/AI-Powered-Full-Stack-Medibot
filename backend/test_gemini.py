"""
Test Gemini AI Integration
"""
from app.ai.symptom_analyzer import SymptomAnalyzer
from app.ai.response_generator import ResponseGenerator

print("="*60)
print("Testing Gemini AI Integration")
print("="*60)

try:
    # Initialize analyzers
    print("\n1. Initializing AI analyzers...")
    analyzer = SymptomAnalyzer()
    generator = ResponseGenerator()
    print("   ✅ Analyzers initialized!")
    
    # Test symptom analysis
    print("\n2. Testing symptom analysis...")
    test_message = "I have fever and headache"
    print(f"   Input: {test_message}")
    
    analysis = analyzer.analyze(test_message)
    print(f"   ✅ Analysis complete!")
    print(f"   Diseases: {analysis.get('diseases', [])}")
    print(f"   Advice: {analysis.get('advice', [])[:2]}")
    
    # Test response generation
    print("\n3. Testing response generation...")
    response = generator.generate(test_message)
    print(f"   ✅ Response generated!")
    print(f"\n{'='*60}")
    print("AI RESPONSE:")
    print(f"{'='*60}")
    print(response)
    
    print("\n✅ ALL TESTS PASSED!")
    
except Exception as e:
    print(f"\n❌ TEST FAILED: {str(e)}")
    import traceback
    traceback.print_exc()
