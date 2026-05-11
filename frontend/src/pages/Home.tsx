import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MediBotLogo from '../components/MediBotLogo'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Floating Badge */}
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <span className="badge-text">🎉 AI-Powered Healthcare</span>
            </motion.div>

            {/* Main Logo */}
            <motion.div 
              className="hero-logo-wrapper"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <div className="hero-logo-3d">
                <MediBotLogo size="hero" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Your Intelligent
              <span className="title-gradient"> Healthcare</span>
              <br />
              <span className="title-accent">Assistant</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Experience the future of healthcare with AI-powered symptom analysis, 
              instant medical guidance, and personalized health recommendations. 
              Available 24/7, completely free.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Link to="/chat" className="btn-hero-primary">
                <span className="btn-icon">🚀</span>
                <span className="btn-text">
                  <strong>Start Free Consultation</strong>
                  <small>Get instant medical advice</small>
                </span>
                <div className="btn-shine"></div>
              </Link>

              <Link to="/register" className="btn-hero-secondary">
                <span className="btn-icon">✨</span>
                <span className="btn-text">
                  <strong>Create Account</strong>
                  <small>Join thousands of users</small>
                </span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Consultations</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Accuracy</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Floating Cards */}
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="floating-cards">
              <motion.div 
                className="float-card card-1"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="card-icon">💬</div>
                <div className="card-content">
                  <div className="card-title">AI Chat</div>
                  <div className="card-desc">Instant responses</div>
                </div>
              </motion.div>

              <motion.div 
                className="float-card card-2"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <div className="card-title">Health Analytics</div>
                  <div className="card-desc">Track your progress</div>
                </div>
              </motion.div>

              <motion.div 
                className="float-card card-3"
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="card-icon">🔒</div>
                <div className="card-content">
                  <div className="card-title">Secure & Private</div>
                  <div className="card-desc">HIPAA compliant</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        >
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* Why Choose MediBot - Ultra Creative */}
      <section className="why-choose-section ultra-creative">
        <div className="section-bg-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
        
        <motion.div
          className="section-header-creative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge">
            <span className="badge-icon">✨</span>
            <span>Why Choose MediBot?</span>
          </div>
          <h2 className="section-title-creative">
            <span className="title-line-1">Experience Healthcare</span>
            <span className="title-line-2 gradient-text">Reimagined</span>
          </h2>
          <p className="section-subtitle">
            Discover the future of medical consultation with cutting-edge AI technology
          </p>
        </motion.div>

        <div className="features-showcase">
          <motion.div
            className="feature-card-creative feature-1"
            whileHover={{ scale: 1.02, y: -10 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-bg-gradient"></div>
            <div className="feature-content">
              <div className="feature-icon-3d">
                <span className="icon-emoji">🎯</span>
                <div className="icon-ring"></div>
                <div className="icon-particles"></div>
              </div>
              <h3>Accurate AI Analysis</h3>
              <p>Advanced machine learning algorithms analyze your symptoms with 95%+ accuracy using our comprehensive medical database.</p>
              <div className="feature-stats">
                <div className="stat-item">
                  <span className="stat-value">95%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">10K+</span>
                  <span className="stat-label">Conditions</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="feature-card-creative feature-2"
            whileHover={{ scale: 1.02, y: -10 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-bg-gradient"></div>
            <div className="feature-content">
              <div className="feature-icon-3d">
                <span className="icon-emoji">🌙</span>
                <div className="icon-ring"></div>
                <div className="icon-particles"></div>
              </div>
              <h3>24/7 Always Available</h3>
              <p>Get instant medical guidance anytime, day or night. No appointments, no waiting, just instant care whenever you need it.</p>
              <div className="feature-stats">
                <div className="stat-item">
                  <span className="stat-value">24/7</span>
                  <span className="stat-label">Available</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0s</span>
                  <span className="stat-label">Wait Time</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="feature-card-creative feature-3"
            whileHover={{ scale: 1.02, y: -10 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="card-bg-gradient"></div>
            <div className="feature-content">
              <div className="feature-icon-3d">
                <span className="icon-emoji">🛡️</span>
                <div className="icon-ring"></div>
                <div className="icon-particles"></div>
              </div>
              <h3>Enterprise Security</h3>
              <p>Your health data is protected with bank-level encryption and HIPAA-compliant security measures. Your privacy is our priority.</p>
              <div className="feature-stats">
                <div className="stat-item">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Private</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">✓</span>
                  <span className="stat-label">HIPAA</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Ultra Creative */}
      <section className="how-it-works-section ultra-creative">
        <div className="section-bg-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
        
        <motion.div
          className="section-header-creative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge">
            <span className="badge-icon">🚀</span>
            <span>Simple Process</span>
          </div>
          <h2 className="section-title-creative">
            <span className="title-line-1">How MediBot</span>
            <span className="title-line-2 gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            Get started in three simple steps - it's that easy
          </p>
        </motion.div>

        <div className="steps-showcase">
          <motion.div
            className="step-card-creative"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="step-connector"></div>
            <div className="step-number-3d">
              <span>1</span>
              <div className="number-glow"></div>
              <div className="number-ring"></div>
            </div>
            <div className="step-content">
              <div className="step-icon">💬</div>
              <h3>Describe Your Symptoms</h3>
              <p>Tell MediBot about your symptoms using natural language. Type or speak - we understand both.</p>
              <div className="step-visual">
                <div className="chat-bubble">
                  <span>I have fever and headache...</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="step-card-creative"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="step-connector"></div>
            <div className="step-number-3d">
              <span>2</span>
              <div className="number-glow"></div>
              <div className="number-ring"></div>
            </div>
            <div className="step-content">
              <div className="step-icon">🧠</div>
              <h3>AI Analysis</h3>
              <p>Our AI analyzes your symptoms against thousands of conditions to provide accurate insights.</p>
              <div className="step-visual">
                <div className="analysis-bars">
                  <div className="bar"><div className="fill" style={{width: '85%'}}></div></div>
                  <div className="bar"><div className="fill" style={{width: '72%'}}></div></div>
                  <div className="bar"><div className="fill" style={{width: '91%'}}></div></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="step-card-creative"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="step-connector"></div>
            <div className="step-number-3d">
              <span>3</span>
              <div className="number-glow"></div>
              <div className="number-ring"></div>
            </div>
            <div className="step-content">
              <div className="step-icon">✅</div>
              <h3>Get Personalized Advice</h3>
              <p>Receive tailored medical advice, home remedies, and guidance on next steps.</p>
              <div className="step-visual">
                <div className="advice-checklist">
                  <div className="check-item">✓ Rest & hydration</div>
                  <div className="check-item">✓ Home remedies</div>
                  <div className="check-item">✓ When to see a doctor</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Ultra Creative */}
      <section className="cta-section ultra-creative">
        <div className="cta-bg-effects">
          <div className="cta-glow-orb orb-1"></div>
          <div className="cta-glow-orb orb-2"></div>
          <div className="cta-particle-ring"></div>
        </div>
        
        <motion.div
          className="cta-content-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="cta-badge">
            <span className="badge-icon">🎉</span>
            <span>Start Your Journey</span>
          </div>
          
          <h2 className="cta-title">
            Ready to Experience
            <span className="gradient-text"> Healthcare Reimagined?</span>
          </h2>
          
          <p className="cta-subtitle">
            Join thousands of users who trust MediBot for instant, accurate medical guidance
          </p>
          
          <div className="cta-stats-row">
            <div className="cta-stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="cta-stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Consultations</span>
            </div>
            <div className="cta-stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
          
          <div className="cta-actions">
            <Link to="/chat" className="btn-cta-primary">
              <span className="btn-icon-wrapper">🚀</span>
              <span className="btn-content">
                <strong>Start Free Consultation</strong>
                <small>No signup required</small>
              </span>
              <div className="btn-arrow">→</div>
              <div className="btn-shine-effect"></div>
            </Link>
            
            <Link to="/register" className="btn-cta-secondary">
              <span className="btn-icon-wrapper">✨</span>
              <span className="btn-content">
                <strong>Create Free Account</strong>
                <small>Save your history</small>
              </span>
            </Link>
          </div>
          
          <p className="cta-note">
            <span className="note-icon">🔒</span>
            <span>100% Free • No Credit Card • HIPAA Compliant</span>
          </p>
        </motion.div>
      </section>
    </div>
  )
}
