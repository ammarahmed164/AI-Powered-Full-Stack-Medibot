import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_consultations: 0,
    today_consultations: 0,
    recent_sessions: []
  })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('User')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Get User Details
    const name = localStorage.getItem('user_full_name') || 'User'
    const email = localStorage.getItem('user_email') || ''
    setUserName(name.split(' ')[0])
    setUserEmail(email)

    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      // 1. Get User ID with Fallback
      let userId = localStorage.getItem('user_id')
      
      if (!userId) {
        const token = localStorage.getItem('access_token')
        if (token) {
          if (token.startsWith('jwt_')) userId = token.replace('jwt_', '')
          else if (token.startsWith('admin_jwt_')) userId = token.replace('admin_jwt_', '')
        }
      }

      console.log('🔍 Dashboard: Fetching stats for User ID:', userId)
      
      if (!userId) {
        console.warn('⚠️ Dashboard: No User ID found!')
        return
      }

      // 2. Fetch user's sessions
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/history/sessions/${userId}`)
      console.log('📡 Dashboard: API Response Status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Dashboard: API Data:', data)
        
        let sessions = data.sessions || []

        // 3. STRICT FILTER: Ensure we only show THIS user's sessions
        sessions = sessions.filter((s: any) => s.user_id === userId)

        // 4. Calculate stats
        const today = new Date().toDateString()
        const todayCount = sessions.filter((s: any) => new Date(s.created_at).toDateString() === today).length

        setStats({
          total_consultations: sessions.length,
          today_consultations: todayCount,
          recent_sessions: sessions.slice(0, 5) // Last 5 sessions
        })
      } else {
        console.error('❌ Dashboard: Failed to fetch sessions', await response.text())
      }
    } catch (error) {
      console.error('❌ Failed to fetch user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome Back, {userName}!</h1>
            <p className="dashboard-subtitle">
              Logged in as: <span className="user-email">{userEmail || 'N/A'}</span>
            </p>
          </div>
          <Link to="/chat" className="btn-new-consultation">
            <span>+</span> New Consultation
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card consultations">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <span className="stat-label">My Consultations</span>
              <span className="stat-value">{loading ? '-' : stats.total_consultations}</span>
            </div>
            <div className="stat-bg"></div>
          </div>

          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-label">Today's Activity</span>
              <span className="stat-value">{loading ? '-' : stats.today_consultations}</span>
            </div>
            <div className="stat-bg"></div>
          </div>
        </div>

        {/* Recent History */}
        <div className="recent-history-section">
          <div className="section-header">
            <h2 className="section-title">My Recent Consultations</h2>
            <Link to="/history" className="btn-view-all">View All History →</Link>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading history...</p>
            </div>
          ) : stats.recent_sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No consultations yet</h3>
              <p>Start your first chat with MediBot to see history here</p>
              <Link to="/chat" className="btn-start-chat">Start Chat</Link>
            </div>
          ) : (
            <div className="history-list">
              {stats.recent_sessions.map((session: any) => (
                <div key={session.id} className="history-card">
                  <div className="history-icon">💬</div>
                  <div className="history-info">
                    <h4>{session.session_name}</h4>
                    <p>{new Date(session.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/chat" className="action-card">
              <div className="action-icon">🤖</div>
              <h3>AI Chatbot</h3>
              <p>Get instant medical advice</p>
            </Link>

            <Link to="/history" className="action-card">
              <div className="action-icon">📜</div>
              <h3>Full History</h3>
              <p>View all past consultations</p>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 50%, #c3cfe2 100%);
          position: relative;
          overflow: hidden;
        }

        .dashboard-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: orbFloat 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: #667eea;
          top: -100px;
          right: -100px;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: #764ba2;
          bottom: -50px;
          left: -50px;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: #fbbf24;
          top: 50%;
          left: 50%;
          animation-delay: 10s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        .dashboard-content {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 10px 0;
        }

        .dashboard-subtitle {
          color: #718096;
          font-size: 1.1rem;
          margin: 0;
        }

        .user-email {
          color: #667eea;
          font-weight: 600;
        }

        .btn-new-consultation {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .btn-new-consultation:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
        }

        .btn-new-consultation span {
          font-size: 1.5rem;
          font-weight: 300;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 50px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
        }

        .stat-card.consultations:hover { border-color: #667eea; }
        .stat-card.today:hover { border-color: #fbbf24; }

        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          position: relative;
          z-index: 1;
        }

        .stat-card.consultations .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .stat-card.today .stat-icon { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }

        .stat-info {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .stat-label {
          color: #718096;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a202c;
          line-height: 1;
        }

        .stat-bg {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          opacity: 0.1;
        }

        .stat-card.consultations .stat-bg { background: #667eea; }
        .stat-card.today .stat-bg { background: #fbbf24; }

        .recent-history-section {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 50px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .btn-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .btn-view-all:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #1a202c;
          margin: 0 0 10px 0;
        }

        .empty-state p {
          color: #718096;
          margin: 0 0 30px 0;
        }

        .btn-start-chat {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .btn-start-chat:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .history-card:hover {
          background: #f1f5f9;
          transform: translateX(8px);
          border-color: #667eea;
        }

        .history-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .history-info h4 {
          color: #1a202c;
          margin: 0 0 6px 0;
          font-weight: 600;
        }

        .history-info p {
          color: #64748b;
          margin: 0;
          font-size: 0.9rem;
        }

        .quick-actions {
          margin-top: 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .action-card {
          background: white;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .action-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          border-color: #667eea;
        }

        .action-card.coming-soon {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .action-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 20px;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
        }

        .action-card:hover .action-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .action-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 10px 0;
        }

        .action-card p {
          color: #718096;
          font-size: 0.95rem;
          margin: 0;
        }

        .badge-soon {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          background: rgba(245, 101, 101, 0.15);
          color: #f56565;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid rgba(245, 101, 101, 0.3);
        }

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
