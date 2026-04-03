import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: "Is MediBot a replacement for a doctor?", a: "No. MediBot provides AI-powered health guidance for informational purposes only. Always consult a qualified healthcare professional for medical advice." },
    { q: "How is my data protected?", a: "We use industry-standard encryption and secure servers. Your health data is never shared with third parties without your consent." },
    { q: "Can I delete my account?", a: "Yes, you can request account deletion at any time through your account settings or by contacting support." },
    { q: "Is the service free?", a: "Yes, MediBot is completely free to use for all registered users." },
    { q: "How accurate are the diagnoses?", a: "Our AI uses advanced algorithms and a comprehensive medical database. However, accuracy depends on the information provided and should always be verified by a doctor." }
  ]

  return (
    <div className="info-page">
      <div className="info-bg"><div className="bg-orb orb-1"></div><div className="bg-orb orb-2"></div></div>
      <div className="info-content">
        <h1 className="info-title">Frequently Asked Questions</h1>
        <p className="info-subtitle">Find answers to common questions</p>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-toggle">{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
        <Link to="/" className="btn-back-home">← Back to Home</Link>
      </div>
      <style>{`
        .info-page { min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%); position: relative; overflow: hidden; }
        .info-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; animation: orbFloat 20s ease-in-out infinite; }
        .orb-1 { width: 400px; height: 400px; background: #667eea; top: -100px; right: -100px; }
        .orb-2 { width: 300px; height: 300px; background: #764ba2; bottom: -50px; left: -50px; animation-delay: 5s; }
        @keyframes orbFloat { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -30px) scale(1.1); } }
        .info-content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 60px 20px; text-align: center; }
        .info-title { font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 10px 0; }
        .info-subtitle { color: #718096; font-size: 1.2rem; margin: 0 0 50px 0; }
        .faq-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 50px; text-align: left; }
        .faq-item { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.3s ease; }
        .faq-item:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .faq-question { display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #1a202c; font-size: 1.1rem; }
        .faq-toggle { font-size: 1.5rem; color: #667eea; font-weight: 300; }
        .faq-answer { color: #4a5568; line-height: 1.7; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
        .btn-back-home { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: white; color: #667eea; text-decoration: none; border-radius: 12px; font-weight: 700; transition: all 0.3s ease; border: 2px solid #667eea; }
        .btn-back-home:hover { background: #667eea; color: white; transform: translateY(-3px); }
        @media (max-width: 768px) { .info-title { font-size: 2rem; } }
      `}</style>
    </div>
  )
}
