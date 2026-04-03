import { Link } from 'react-router-dom'

export default function HelpCenter() {
  return (
    <div className="info-page">
      <div className="info-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>
      <div className="info-content">
        <h1 className="info-title">Help Center</h1>
        <p className="info-subtitle">How can we assist you today?</p>
        
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">🤖</div>
            <h3>Using MediBot</h3>
            <p>Simply type your symptoms or health concerns in the chat. MediBot will ask follow-up questions to provide accurate guidance.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3>Privacy & Security</h3>
            <p>Your data is encrypted and stored securely. We never share your health information with third parties.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📜</div>
            <h3>Viewing History</h3>
            <p>Access your past consultations anytime from the Dashboard or History page to track your health journey.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Contact Support</h3>
            <p>Need more help? Reach us at <a href="mailto:ammarahmeddd164@gmail.com">ammarahmeddd164@gmail.com</a> or call +92 319 3895181.</p>
          </div>
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
        .info-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 60px 20px; text-align: center; }
        .info-title { font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 10px 0; }
        .info-subtitle { color: #718096; font-size: 1.2rem; margin: 0 0 50px 0; }
        .info-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-bottom: 50px; }
        .info-card { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); transition: all 0.3s ease; text-align: left; }
        .info-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .info-icon { font-size: 2.5rem; margin-bottom: 15px; }
        .info-card h3 { color: #1a202c; font-size: 1.25rem; margin: 0 0 10px 0; }
        .info-card p { color: #718096; line-height: 1.7; margin: 0; }
        .btn-back-home { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: white; color: #667eea; text-decoration: none; border-radius: 12px; font-weight: 700; transition: all 0.3s ease; border: 2px solid #667eea; }
        .btn-back-home:hover { background: #667eea; color: white; transform: translateY(-3px); }
        @media (max-width: 768px) { .info-title { font-size: 2rem; } }
      `}</style>
    </div>
  )
}
