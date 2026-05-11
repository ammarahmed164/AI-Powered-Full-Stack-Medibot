import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { register } from '../store/slices/authSlice'
import { AppDispatch } from '../store/store'
import MediBotLogo from '../components/MediBotLogo'
import './Auth.css'

export default function Register() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await dispatch(register(formData))
    
    if (register.fulfilled.match(result)) {
      navigate('/login')
    } else {
      setError(result.payload as string)
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <MediBotLogo size="auth" />
            </div>
            <h1>Create Account</h1>
            <p>Join MediBot for free health consultations</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
                placeholder="+1234567890"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                placeholder="••••••••"
                required
              />
              <p className="password-hint">
                Must be at least 8 characters with uppercase, number, and special character
              </p>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="link-primary">
              Login
            </Link>
          </p>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Start Your Health Journey</h2>
            <p>Get instant AI-powered medical guidance, track your health, and access personalized recommendations.</p>
            <ul className="feature-list">
              <li>✓ Free AI health consultations</li>
              <li>✓ 24/7 availability</li>
              <li>✓ Secure & private</li>
              <li>✓ Personalized health insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
