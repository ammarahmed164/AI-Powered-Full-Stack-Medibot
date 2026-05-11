import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { logout } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'
import './Layout.css'
import MediBotLogo from './MediBotLogo'
import {
  IconNavChat,
  IconNavDashboard,
  IconNavHistory,
  IconNavAdmin,
  IconUserCircle,
  IconLogout,
  IconLoginKey,
  IconSparkle,
} from './NavbarIcons'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
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
            <span className="navbar-brand-cluster">
              <span className="navbar-brand-cluster-bloom" aria-hidden />
              <span className="navbar-brand-orbit navbar-brand-orbit--outer" aria-hidden />
              <span className="navbar-brand-orbit navbar-brand-orbit--inner" aria-hidden />
              <span className="navbar-brand-spark navbar-brand-spark--tl" aria-hidden />
              <span className="navbar-brand-spark navbar-brand-spark--br" aria-hidden />
              <span className="navbar-brand-visual">
                <span className="navbar-brand-visual-ring" aria-hidden />
                <span className="navbar-brand-visual-panel" aria-hidden />
                <span className="navbar-brand-glare" aria-hidden />
                <MediBotLogo size="nav" className="navbar-brand-logo-slot" />
              </span>
            </span>
            <div className="brand-text">
              <div className="brand-tagline-row">
                <span className="brand-live-dot" aria-hidden />
                <span className="brand-tagline">AI Healthcare</span>
              </div>
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
                <span className="nav-icon" aria-hidden>
                  <IconNavChat className="nav-icon-svg" />
                </span>
                <span className="icon-bounce" aria-hidden />
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
                    <span className="nav-icon" aria-hidden>
                      <IconNavDashboard className="nav-icon-svg" />
                    </span>
                    <span className="icon-bounce" aria-hidden />
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
                    <span className="nav-icon" aria-hidden>
                      <IconNavHistory className="nav-icon-svg" />
                    </span>
                    <span className="icon-bounce" aria-hidden />
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
                  <span className="nav-icon" aria-hidden>
                    <IconNavAdmin className="nav-icon-svg" />
                  </span>
                  <span className="icon-bounce" aria-hidden />
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
                    <span className="user-avatar" aria-hidden>
                      <IconUserCircle className="user-avatar-svg" />
                    </span>
                    <div className="avatar-status"></div>
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.full_name?.split(' ')[0] || 'User'}</span>
                    <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Member'}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-logout-modern">
                  <span className="btn-icon" aria-hidden>
                    <IconLogout className="btn-icon-svg" />
                  </span>
                  <span className="btn-text">Logout</span>
                  <div className="btn-bg" aria-hidden />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login-modern">
                  <span className="btn-login-icon" aria-hidden>
                    <IconLoginKey className="btn-icon-svg btn-icon-svg--muted" />
                  </span>
                  <span className="btn-text">Login</span>
                  <div className="btn-wave" aria-hidden />
                </Link>
                <Link to="/register" className="btn-signup-modern">
                  <span className="btn-icon" aria-hidden>
                    <IconSparkle className="btn-icon-svg" />
                  </span>
                  <span className="btn-text">
                    <strong>Sign Up</strong>
                    <small>It's Free</small>
                  </span>
                  <div className="btn-shine-effect" aria-hidden />
                  <div className="btn-glow" aria-hidden />
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
                <MediBotLogo size="mobile" />
              </div>
              <button className="mobile-close-modern" onClick={() => setMobileMenuOpen(false)}>
                <span className="close-line-1"></span>
                <span className="close-line-2"></span>
              </button>
            </div>
            
            <div className="mobile-menu-content">
              <Link to="/chat" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                <div className="mobile-link-icon" aria-hidden>
                  <IconNavChat className="mobile-nav-svg" />
                </div>
                <div className="mobile-link-text">
                  <span className="link-label">Chat</span>
                  <span className="link-sub">Start consultation</span>
                </div>
                <div className="mobile-link-arrow">→</div>
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-link-icon" aria-hidden>
                      <IconNavDashboard className="mobile-nav-svg" />
                    </div>
                    <div className="mobile-link-text">
                      <span className="link-label">Dashboard</span>
                      <span className="link-sub">View your health</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </Link>

                  <Link to="/history" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-link-icon" aria-hidden>
                      <IconNavHistory className="mobile-nav-svg" />
                    </div>
                    <div className="mobile-link-text">
                      <span className="link-label">History</span>
                      <span className="link-sub">Past chats</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link to="/admin" className="mobile-nav-link-modern" onClick={() => setMobileMenuOpen(false)}>
                      <div className="mobile-link-icon" aria-hidden>
                        <IconNavAdmin className="mobile-nav-svg" />
                      </div>
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
                    <div className="mobile-link-icon" aria-hidden>
                      <IconLogout className="mobile-nav-svg" />
                    </div>
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
                    <div className="mobile-link-icon" aria-hidden>
                      <IconLoginKey className="mobile-nav-svg" />
                    </div>
                    <div className="mobile-link-text">
                      <span className="link-label">Login</span>
                      <span className="link-sub">Access account</span>
                    </div>
                    <div className="mobile-link-arrow">→</div>
                  </Link>

                  <Link to="/register" className="mobile-nav-link-modern primary" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-link-icon mobile-link-icon--inverse" aria-hidden>
                      <IconSparkle className="mobile-nav-svg" />
                    </div>
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
              <MediBotLogo size="footer" />
            </Link>
            <p className="footer-description">
              Your AI-powered healthcare assistant. Get instant medical guidance based on your symptoms.
            </p>
            <div className="footer-social">
              <a
                href="https://github.com/anasali435"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub — Anas Ali"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/anas-ali-91959b272"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn — Anas Ali"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
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
            <h4>Connect</h4>
            <div className="footer-social-links">
              <a
                href="https://github.com/anasali435"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/anas-ali-91959b272"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 MediBot. All rights reserved. | Anas Ali</p>
        </div>
      </footer>
    </div>
  )
}
