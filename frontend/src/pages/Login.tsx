import { useState } from 'react'
import { Link } from 'react-router-dom'
import MediBotLogo from '../components/MediBotLogo'
import './Auth.css'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setLoading(true)

    try {
      // Direct API call for login
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user_role', data.user.role)
        localStorage.setItem('user_email', data.user.email)
        localStorage.setItem('user_full_name', data.user.full_name)
        
        console.log('Login successful! User role:', data.user.role)
        console.log('User full name:', data.user.full_name)
        
        // Small delay to ensure localStorage is saved
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Redirect based on role
        if (data.user.role === 'admin' || data.user.role === 'super_admin') {
          console.log('Redirecting to admin panel...')
          window.location.href = '/admin-panel'
        } else {
          console.log('Redirecting to user dashboard...')
          window.location.href = '/dashboard'
        }
        return // Important: prevent further execution
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <MediBotLogo size="auth" />
            </div>
            <h1>Welcome Back</h1>
            <p>Login to access your health dashboard</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                placeholder="••••••••"
                required
              />
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <span>🔐</span>
                  Login
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="link-primary">
              Sign up
            </Link>
          </p>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Access Your Health Records</h2>
            <p>Login to view your consultation history, health metrics, and personalized recommendations.</p>
            <ul className="feature-list">
              <li>✓ View consultation history</li>
              <li>✓ Track health metrics</li>
              <li>✓ Get personalized advice</li>
              <li>✓ Secure & private</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
