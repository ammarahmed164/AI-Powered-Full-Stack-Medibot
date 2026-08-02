import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import MediBotLogo from '../components/MediBotLogo'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login({ email, password })
      const { access_token, user } = response.data

      if (user && user.role === 'admin') {
        localStorage.setItem('admin_token', access_token)
        localStorage.setItem('user_role', 'admin')
        navigate('/admin-panel')
      } else {
        setError('Access denied. Admins only.')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      {/* Animated Background */}
      <div className="admin-login-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-brand">
              <MediBotLogo size="auth" />
            </div>
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-subtitle">Secure access to MediBot Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@medibot.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-admin-submit" disabled={loading}>
              {loading ? (
                <span className="spinner-small"></span>
              ) : (
                'Login as Admin'
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>Not an admin? <a href="/login">User Login</a></p>
          </div>
        </div>
      </div>

      <style>{`
        .admin-login-page { min-height: calc(100vh - 4.75rem); background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .admin-login-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .bg-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.4; animation: orbFloat 20s ease-in-out infinite; }
        .orb-1 { width: 500px; height: 500px; background: #667eea; top: -150px; right: -150px; }
        .orb-2 { width: 400px; height: 400px; background: #764ba2; bottom: -100px; left: -100px; animation-delay: 5s; }
        .orb-3 { width: 300px; height: 300px; background: #3b82f6; top: 50%; left: 50%; animation-delay: 10s; }
        @keyframes orbFloat { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -40px) scale(1.15); } }
        
        .admin-login-container { position: relative; z-index: 1; width: 100%; max-width: 480px; padding: 20px; }
        .admin-login-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        
        .admin-login-header { text-align: center; margin-bottom: 35px; display: flex; flex-direction: column; align-items: center; gap: 0; }
        .admin-login-brand { margin-bottom: 0; padding: 0.75rem 0 0; min-height: 4.5rem; display: flex; justify-content: center; align-items: center; overflow: hidden; flex-shrink: 0; }
        .admin-login-brand .medibot-logo-3d--auth { animation: none; }
        .admin-login-brand .medibot-logo-3d__img { animation: none; transform: none; }
        .admin-login-brand .medibot-logo-3d__orbit,
        .admin-login-brand .medibot-logo-3d__ambient,
        .admin-login-brand .medibot-logo-3d__ambient--alt { display: none; }
        .admin-login-brand img { max-width: 200px; width: 100%; height: auto; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.35)); }
        .admin-login-title { font-size: 2.25rem; font-weight: 800; color: #ffffff; margin: 1.75rem 0 10px 0; padding-top: 0.25rem; letter-spacing: -0.5px; line-height: 1.2; position: relative; z-index: 1; }
        .admin-login-subtitle { color: #94a3b8; margin: 0; font-size: 1rem; }
        
        .admin-login-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { color: #cbd5e1; font-weight: 600; font-size: 0.9rem; }
        .form-input { width: 100%; padding: 14px 18px; background: rgba(255, 255, 255, 0.08); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 14px; color: #ffffff; font-size: 1rem; transition: all 0.3s ease; }
        .form-input::placeholder { color: #64748b; }
        .form-input:focus { outline: none; border-color: #667eea; background: rgba(255, 255, 255, 0.12); box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2); }
        
        .error-message { background: rgba(239, 68, 68, 0.15); color: #fca5a5; padding: 14px; border-radius: 12px; font-size: 0.9rem; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3); }
        
        .btn-admin-submit { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; border: none; border-radius: 14px; font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4); display: flex; align-items: center; justify-content: center; gap: 10px; }
        .btn-admin-submit:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6); }
        .btn-admin-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .spinner-small { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid #ffffff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .admin-login-footer { text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.9rem; }
        .admin-login-footer a { color: #667eea; text-decoration: none; font-weight: 600; transition: color 0.3s ease; }
        .admin-login-footer a:hover { color: #818cf8; text-decoration: underline; }
        
        @media (max-width: 768px) {
          .admin-login-card { padding: 30px 20px; }
          .admin-login-title { font-size: 1.75rem; }
        }
      `}</style>
    </div>
  )
}
