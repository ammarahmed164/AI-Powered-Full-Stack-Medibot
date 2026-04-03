import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ total_users: 0, total_consultations: 0, active_users: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userHistory, setUserHistory] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      navigate('/admin-login')
      return
    }
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token')
      
      // Load users
      const usersResponse = await fetch('http://localhost:8000/api/v1/users/', {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      })

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        console.log('✅ Users loaded:', usersData)
        setUsers(usersData)
        
        // Update stats
        setStats({
          total_users: usersData.length,
          active_users: usersData.filter((u: any) => u.is_active).length,
          total_consultations: 0 
        })
      } else {
        console.error('❌ Failed to load users:', usersResponse.status, await usersResponse.text())
      }

      // Load dashboard stats
      const statsResponse = await fetch('http://localhost:8000/api/v1/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(prev => ({
          ...prev,
          total_consultations: statsData.total_consultations || 0
        }))
      }
    } catch (error) {
      console.error('❌ Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewUserHistory = async (user: any) => {
    try {
      setSelectedUser(user)
      setShowHistoryModal(true)
      
      const response = await fetch(`http://localhost:8000/api/v1/history/sessions/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserHistory(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to load user history:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('user_role')
    navigate('/admin-login')
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="admin-panel">
      {/* Animated Background */}
      <div className="admin-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      <div className="admin-content">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage users and view consultations</p>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <span>🚪</span> Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card purple">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{loading ? '-' : stats.total_users}</span>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-label">Active Users</span>
              <span className="stat-value">{loading ? '-' : stats.active_users}</span>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <span className="stat-label">Total Consultations</span>
              <span className="stat-value">{loading ? '-' : stats.total_consultations}</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-section">
          <div className="section-header">
            <h2 className="section-title">Registered Users</h2>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>Users will appear here once they register</p>
            </div>
          ) : (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index} className="user-row">
                      <td className="user-cell">
                        <div className="user-avatar">
                          {(user.full_name || 'U')[0].toUpperCase()}
                        </div>
                        <span className="user-name">{user.full_name || 'User'}</span>
                      </td>
                      <td className="email-cell">{user.email}</td>
                      <td>{user.phone_number || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn-view-history"
                          onClick={() => viewUserHistory(user)}
                        >
                          📜 View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedUser.full_name}'s History</h2>
                <p className="modal-email">{selectedUser.email}</p>
              </div>
              <button className="modal-close" onClick={() => setShowHistoryModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {userHistory.length === 0 ? (
                <div className="empty-history">
                  <div className="empty-icon">📭</div>
                  <p>No consultation history found</p>
                </div>
              ) : (
                <div className="history-list">
                  {userHistory.map((session) => (
                    <div key={session.id} className="history-item">
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
          </div>
        </div>
      )}

      <style>{`
        .admin-panel {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          position: relative;
          overflow: hidden;
        }

        .admin-bg {
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
          filter: blur(100px);
          opacity: 0.3;
          animation: orbFloat 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: #667eea;
          top: -150px;
          right: -150px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: #764ba2;
          bottom: -100px;
          left: -100px;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 350px;
          height: 350px;
          background: #fbbf24;
          top: 50%;
          left: 50%;
          animation-delay: 10s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.15); }
        }

        .admin-content {
          position: relative;
          z-index: 1;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .admin-title {
          font-size: 2.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 10px 0;
        }

        .admin-subtitle {
          color: #94a3b8;
          font-size: 1.1rem;
          margin: 0;
        }

        .btn-logout {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: rgba(239, 68, 68, 0.15);
          border: 2px solid #ef4444;
          color: #ef4444;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 50px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .stat-card.purple .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .stat-card.green .stat-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .stat-card.blue .stat-icon { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }

        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .users-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          margin: 0;
        }

        .search-input {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          width: 300px;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.15);
        }

        .loading-state, .empty-state, .empty-history {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-state p, .empty-state p, .empty-history p {
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .users-table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead th {
          text-align: left;
          padding: 16px;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .users-table tbody tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .users-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .users-table td {
          padding: 16px;
          color: #e2e8f0;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
        }

        .user-name {
          font-weight: 600;
          color: #ffffff;
        }

        .email-cell {
          color: #94a3b8;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .status-badge.inactive {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .btn-view-history {
          padding: 8px 16px;
          background: rgba(102, 126, 234, 0.2);
          border: 1px solid rgba(102, 126, 234, 0.4);
          color: #667eea;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view-history:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .history-modal {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 24px;
          max-width: 700px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          padding: 28px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
        }

        .modal-email {
          color: #94a3b8;
          margin: 0;
        }

        .modal-close {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #ef4444;
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 32px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .history-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(8px);
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
        }

        .history-info h4 {
          color: white;
          margin: 0 0 6px 0;
          font-weight: 600;
        }

        .history-info p {
          color: #94a3b8;
          margin: 0;
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .admin-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-title {
            font-size: 2rem;
          }

          .search-input {
            width: 100%;
          }

          .users-table-wrapper {
            overflow-x: scroll;
          }

          .users-table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  )
}
