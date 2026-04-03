import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { logout } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'
import './Layout.css'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="layout">
      {/* Navigation - Ultra Creative */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        {/* Animated Background Mesh */}
        <div className="navbar-mesh-bg">
          <div className="mesh-gradient mesh-1"></div>
          <div className="mesh-gradient mesh-2"></div>
          <div className="mesh-gradient mesh-3"></div>
        </div>

        {/* Floating Particles */}
        <div className="navbar-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>

        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-logo-3d">
              <div className="logo-cube">
                <span className="cube-face front">🏥</span>
                <div className="cube-glow"></div>
              </div>
              <div className="logo-waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-main">Medi</span>
              <span className="brand-accent">Bot</span>
              <div className="brand-tagline">AI Healthcare</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-menu">
            <Link 
              to="/chat" 
              className={`nav-link ${hoveredLink === 'chat' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredLink('chat')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span className="nav-icon-wrapper">
                <span className="nav-icon">💬</span>
                <span className="icon-bounce"></span>
              </span>
              <span className="nav-text">
                <span className="nav-label">Chat</span>
                <span className="nav-sublabel">Consult Now</span>
              </span>
              <div className="nav-underline"></div>
              <div className="nav-shine"></div>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${hoveredLink === 'dashboard' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredLink('dashboard')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span className="nav-icon-wrapper">
                    <span className="nav-icon">📊</span>
                    <span className="icon-bounce"></span>
                  </span>
                  <span className="nav-text">
                    <span className="nav-label">Dashboard</span>
                    <span className="nav-sublabel">Your Health</span>
                  </span>
                  <div className="nav-underline"></div>
                  <div className="nav-shine"></div>
                </Link>

                <Link
                  to="/history"
                  className={`nav-link ${hoveredLink === 'history' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredLink('history')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span className="nav-icon-wrapper">
                    <span className="nav-icon">📜</span>
                    <span className="icon-bounce"></span>
                  </span>
                  <span className="nav-text">
                    <span className="nav-label">History</span>
                    <span className="nav-sublabel">Past Chats</span>
                  </span>
                  <div className="nav-underline"></div>
                  <div className="nav-shine"></div>
                </Link>
              </>
            )}
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`nav-link admin-link ${hoveredLink === 'admin' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredLink('admin')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="nav-icon-wrapper">
                  <span className="nav-icon">👨‍💼</span>
                  <span className="icon-bounce"></span>
                </span>
                <span className="nav-text">
                  <span className="nav-label">Admin</span>
                  <span className="nav-sublabel">Panel</span>
                </span>
                <div className="nav-underline"></div>
                <div className="nav-shine"></div>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <div className="user-profile-group">
                  <div className="user-avatar-wrapper">
                    <div className="avatar-ring"></div>
                    <div className="avatar-pulse"></div>
                    <span className="user-avatar">👤</span>
                    <div className="avatar-status"></div>
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.full_name?.split(' ')[0] || 'User'}</span>
                    <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Member'}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-logout-modern">
                  <span className="btn-icon">🚪</span>
                  <span className="btn-text">Logout</span>
                  <div className="btn-bg"></div>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login-modern">
                  <span className="btn-text">Login</span>
                  <div className="btn-wave"></div>
                </Link>
                <Link to="/register" className="btn-signup-modern">
                  <span className="btn-icon">✨</span>
                  <span className="btn-text">
                    <strong>Sign Up</strong>
                    <small>It's Free</small>
                  </span>
                  <div className="btn-shine-effect"></div>
                  <div className="btn-glow"></div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle-modern" onClick={toggleMobileMenu}>
            <span className="toggle-line line-1"></span>
            <span className="toggle-line line-2"></span>
            <span className="toggle-line line-3"></span>
            <span className="toggle-text">{mobileMenuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-modern">
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <span>🏥</span> 
                <span>MediBot</span>
              </div>
              <button className="mobile-close-modern" onClick={() => setMobileMenuOpen(false)}>
                <span className="close-line-1"></span>
                <span className="close-line-2"></span>
              </button>
            </div>
            
            <div className="mobile-menu-content">
              <Link to="/chat" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                <div className="mobile-link-icon">💬</div>
                <div className="mobile-link-text">
                  <span className="link-label">Chat</span>
                  <span className="link-sub">Start consultation</span>
                </div>
                <div className="mobile-link-arrow">→</div>
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-link-icon">📊</div>
                    <div className="mobile-link-text">
                      <span className="link-label">Dashboard</span>
                      <span className="link-sub">View your health</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </Link>

                  <Link to="/history" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-link-icon">📜</div>
                    <div className="mobile-link-text">
                      <span className="link-label">History</span>
                      <span className="link-sub">Past chats</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link to="/admin" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                      <div className="mobile-link-icon">👨‍💼</div>
                      <div className="mobile-link-text">
                        <span className="link-label">Admin</span>
                        <span className="link-sub">Manage panel</span>
                      </div>
                      <div className="mobile-link-arrow">→</div>
                    </Link>
                  )}

                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                    className="mobile-nav-link-modern logout"
                  >
                    <div className="mobile-link-icon">🚪</div>
                    <div className="mobile-link-text">
                      <span className="link-label">Logout</span>
                      <span className="link-sub">Sign out</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link to="/login" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-link-icon">🔑</div>
                    <div className="mobile-link-text">
                      <span className="link-label">Login</span>
                      <span className="link-sub">Access account</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </Link>

                  <Link to="/register" className="mobile-nav-link-modern primary" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-link-icon">✨</div>
                    <div className="mobile-link-text">
                      <span className="link-label">Sign Up</span>
                      <span className="link-sub">Join now - It's free!</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer-main">
        <div className="footer-container">
          <div className="footer-section footer-brand-section">
            <Link to="/" className="footer-logo">
              <div className="logo-icon-small">🏥</div>
              <span>MediBot</span>
            </Link>
            <p className="footer-description">
              Your AI-powered healthcare assistant. Get instant medical guidance based on your symptoms.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link"><span>📘</span></a>
              <a href="#" className="social-link"><span>🐦</span></a>
              <a href="#" className="social-link"><span>📸</span></a>
              <a href="#" className="social-link"><span>💼</span></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/chat">Start Chat</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/history">History</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li><span>📧</span> ammarahmeddd164@gmail.com</li>
              <li><span>📱</span> +92 319 3895181</li>
              <li><span>📍</span> Karachi, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 MediBot. All rights reserved. | Ammar Ahmed✨</p>
        </div>
      </footer>
    </div>
  )
}
