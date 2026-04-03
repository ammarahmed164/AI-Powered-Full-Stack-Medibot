import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="info-page">
      <div className="info-bg"><div className="bg-orb orb-1"></div><div className="bg-orb orb-2"></div></div>
      <div className="info-content">
        <h1 className="info-title">Terms of Service</h1>
        <p className="info-subtitle">Effective Date: February 2026</p>
        <div className="info-text">
          <p>By using MediBot, you agree to the following terms and conditions.</p>
          <h3>1. Service Description</h3>
          <p>MediBot provides AI-powered health guidance based on user-reported symptoms. It is not a substitute for professional medical advice, diagnosis, or treatment.</p>
          <h3>2. User Responsibilities</h3>
          <p>Users must provide accurate information and understand that the AI's guidance is for informational purposes only.</p>
          <h3>3. Medical Disclaimer</h3>
          <p>Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read on this platform.</p>
          <h3>4. Account Security</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
          <h3>5. Modifications</h3>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
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
        .info-subtitle { color: #718096; font-size: 1.1rem; margin: 0 0 40px 0; }
        .info-text { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); text-align: left; margin-bottom: 40px; }
        .info-text h3 { color: #1a202c; font-size: 1.25rem; margin: 25px 0 10px 0; }
        .info-text p { color: #4a5568; line-height: 1.8; margin: 0 0 15px 0; }
        .btn-back-home { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: white; color: #667eea; text-decoration: none; border-radius: 12px; font-weight: 700; transition: all 0.3s ease; border: 2px solid #667eea; }
        .btn-back-home:hover { background: #667eea; color: white; transform: translateY(-3px); }
        @media (max-width: 768px) { .info-title { font-size: 2rem; } }
      `}</style>
    </div>
  )
}
