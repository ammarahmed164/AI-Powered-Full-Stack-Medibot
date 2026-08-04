import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MediBotLogo from '../components/MediBotLogo'
import adminSpotlightPortrait from '../assets/admin-orthopedic-spotlight.png'
import adminDoctor2Portrait from '../assets/Admin-Doctor2.jpeg'
import './AdminPanel.css'

const ORTHOPEDIC_DOCTOR = {
  name: 'Dr Syed Umar Rafiq',
  title: 'Consultant Orthopedic Surgeon',
  qualificationLine: 'MBBS · FCPS',
  bio: 'Orthopedic consultation focus: bone and joint care, post-injury recovery, and evidence-guided treatment planning for every patient.',
  experienceYears: 12,
  hospital: 'MediCare Orthopedic & Trauma Center',
  availability: 'Mon – Sat, 10:00 AM – 7:00 PM',
}

const OPHTHALMOLOGY_DOCTOR = {
  name: 'Dr Suraj Kumar',
  title: 'Ophthalmology Fellow',
  qualificationLine: 'MBBS',
  education: 'LUMHS Jamshoro',
  fellowship: 'JPMC — Ophthalmology',
  bio: 'Advancing vision care through ophthalmology fellowship training — focused on eye health, clinical diagnosis, and patient-centered visual rehabilitation.',
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ total_users: 0, total_consultations: 0, active_users: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userHistory, setUserHistory] = useState<any[]>([])
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [sessionMessages, setSessionMessages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [consultationFeed, setConsultationFeed] = useState<any[]>([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [feedError, setFeedError] = useState<string | null>(null)
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [feedSearch, setFeedSearch] = useState('')

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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
      const usersResponse = await fetch(`${apiUrl}/users/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
        setStats({
          total_users: usersData.length,
          active_users: usersData.filter((u: any) => u.is_active).length,
          total_consultations: 0,
        })
      }

      const statsResponse = await fetch(`${apiUrl}/dashboard/stats`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats((prev) => ({
          ...prev,
          total_consultations: statsData.total_consultations || 0,
        }))
      }

      setFeedLoading(true)
      setFeedError(null)
      const feedResponse = await fetch(`${apiUrl}/history/admin/feed?limit=100`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (feedResponse.ok) {
        const feedData = await feedResponse.json()
        setConsultationFeed(feedData.sessions || [])
        if (feedData.configured === false) {
          setFeedError('Chat history backend is not configured. Set Supabase keys on the server.')
        }
      } else {
        setFeedError('Could not load consultation history. Check that the backend is running and deployed.')
      }
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
      setFeedLoading(false)
    }
  }

  const viewUserHistory = async (user: any) => {
    try {
      setSelectedUser(user)
      setShowHistoryModal(true)
      setSelectedSession(null)
      setSessionMessages([])

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
      const response = await fetch(`${apiUrl}/history/sessions/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserHistory(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to load user history:', error)
    }
  }

  const viewSessionMessages = async (session: any) => {
    try {
      setSelectedSession(session)
      setLoadingMessages(true)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
      const response = await fetch(`${apiUrl}/history/sessions/${session.id}/messages`)

      if (response.ok) {
        const data = await response.json()
        const mappedMessages = (data.messages || []).map((msg: any) => ({
          sender: msg.sender_type,
          content: msg.content,
          timestamp: msg.created_at,
        }))
        setSessionMessages(mappedMessages)
      }
    } catch (error) {
      console.error('Failed to load session messages:', error)
      setSessionMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('user_role')
    navigate('/admin-login')
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFeed = consultationFeed.filter((session) => {
    const q = feedSearch.toLowerCase()
    if (!q) return true
    return (
      session.user_name?.toLowerCase().includes(q) ||
      session.user_email?.toLowerCase().includes(q) ||
      session.preview?.toLowerCase().includes(q) ||
      session.session_name?.toLowerCase().includes(q)
    )
  })

  const toggleSessionExpand = (sessionId: string) => {
    setExpandedSessionId((prev) => (prev === sessionId ? null : sessionId))
  }

  return (
    <>
    <div className="admin-simple" role="main">
      <div className="admin-simple-bg" aria-hidden="true" />
      <div className="admin-mesh" aria-hidden="true" />
      <div className="admin-orb admin-orb-1" aria-hidden="true" />
      <div className="admin-orb admin-orb-2" aria-hidden="true" />
      <div className="admin-orb admin-orb-3" aria-hidden="true" />

      <div className="admin-simple-inner admin-simple-inner--wide">
        <header className="admin-simple-top admin-top-glass">
          <div className="admin-simple-brand">
            <div className="admin-simple-logo" aria-hidden="true">
              <MediBotLogo size="admin" alt="" />
            </div>
            <div>
              <div className="admin-title-row">
                <h1>
                  <span className="admin-title-main">MediBot</span>
                  <span className="admin-title-accent"> Admin</span>
                </h1>
                <span className="admin-live-pill" title="Dashboard connected">
                  <span className="admin-live-dot" aria-hidden="true" />
                  Live
                </span>
              </div>
              <p>Physician spotlight · metrics pulse · patient intelligence</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-admin-logout"
            onClick={handleLogout}
            aria-label="Sign out from admin panel"
          >
            <span className="btn-admin-logout-glow" aria-hidden="true" />
            Sign out
          </button>
        </header>

        <section
          className="admin-stats-wrap admin-stats-wrap--bar admin-reveal admin-reveal--1"
          role="region"
          aria-label="Platform statistics"
        >
          <div className="admin-stats-head-row">
            <h2 className="admin-stats-heading">Pulse board</h2>
            <span className="admin-stats-hint">Real-time</span>
          </div>
          <div className="admin-stats-grid admin-stats-grid--horizontal">
            <div className="admin-stat-card admin-stat-card--purple">
              <div className="admin-stat-icon" aria-hidden="true">
                👥
              </div>
              <div>
                <span className="admin-stat-label">Total users</span>
                <span className="admin-stat-value">{loading ? '—' : stats.total_users}</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--green">
              <div className="admin-stat-icon" aria-hidden="true">
                ✅
              </div>
              <div>
                <span className="admin-stat-label">Active users</span>
                <span className="admin-stat-value">{loading ? '—' : stats.active_users}</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--blue">
              <div className="admin-stat-icon" aria-hidden="true">
                💬
              </div>
              <div>
                <span className="admin-stat-label">Consultations</span>
                <span className="admin-stat-value">{loading ? '—' : stats.total_consultations}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-consultation-feed admin-reveal admin-reveal--2" aria-labelledby="consultation-feed-title">
          <div className="admin-consultation-feed__head">
            <div>
              <span className="admin-section-chip admin-section-chip--cyan">Live stream</span>
              <h2 id="consultation-feed-title" className="admin-consultation-feed__title">
                All patient consultations
              </h2>
              <p className="admin-consultation-feed__sub">
                Every MediBot conversation — user questions and AI responses in one place
                {!feedLoading && consultationFeed.length > 0 && (
                  <span className="admin-consultation-feed__count"> · {consultationFeed.length} sessions</span>
                )}
              </p>
            </div>
            <div className="admin-consultation-feed__actions">
              <button
                type="button"
                className="admin-feed-refresh"
                onClick={loadData}
                disabled={feedLoading}
                aria-label="Refresh consultation history"
              >
                ↻ Refresh
              </button>
              <div className="admin-search-wrap admin-search-wrap--feed">
              <span className="admin-search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                className="admin-search-input"
                placeholder="Search chats…"
                value={feedSearch}
                onChange={(e) => setFeedSearch(e.target.value)}
                aria-label="Search consultations"
              />
            </div>
            </div>
          </div>

          {feedError && (
            <div className="admin-feed-error" role="alert">
              <p>{feedError}</p>
              <button type="button" className="admin-feed-retry" onClick={loadData}>
                Try again
              </button>
            </div>
          )}

          {feedLoading ? (
            <div className="admin-loading" role="status">
              <div className="admin-spinner" aria-hidden="true" />
              <p>Loading consultation history…</p>
            </div>
          ) : filteredFeed.length === 0 ? (
            <div className="admin-empty admin-empty--feed">
              <span className="admin-empty-icon" aria-hidden="true">💬</span>
              <h3>No consultations yet</h3>
              <p>When users chat with MediBot, their full conversation will appear here for admin review.</p>
            </div>
          ) : (
            <div className="admin-consultation-list">
              {filteredFeed.map((session) => {
                const isOpen = expandedSessionId === session.id
                return (
                  <article key={session.id} className={`admin-consultation-card ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="admin-consultation-card__head"
                      onClick={() => toggleSessionExpand(session.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="admin-consultation-avatar" aria-hidden="true">
                        {(session.user_name || 'U')[0].toUpperCase()}
                      </span>
                      <span className="admin-consultation-summary">
                        <span className="admin-consultation-user">{session.user_name}</span>
                        <span className="admin-consultation-email">{session.user_email}</span>
                        <span className="admin-consultation-preview">
                          {session.preview || 'No preview available'}
                        </span>
                      </span>
                      <span className="admin-consultation-meta">
                        <span className="admin-consultation-count">{session.message_count} msgs</span>
                        <time dateTime={session.created_at}>
                          {session.created_at
                            ? new Date(session.created_at).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : '—'}
                        </time>
                        <span className="admin-consultation-chevron" aria-hidden="true">
                          {isOpen ? '▲' : '▼'}
                        </span>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="admin-consultation-card__body">
                        <div className="admin-chat-thread admin-chat-thread--inline">
                          {(session.messages || []).map((message: any, index: number) => (
                            <div
                              key={message.id ?? index}
                              className={`admin-chat-row ${message.sender_type === 'user' ? 'from-user' : 'from-bot'}`}
                            >
                              <span className="admin-chat-avatar" aria-hidden="true">
                                {message.sender_type === 'user' ? '👤' : '🤖'}
                              </span>
                              <div className="admin-chat-bubble">
                                <span className="admin-chat-label">
                                  {message.sender_type === 'user' ? session.user_name : 'MediBot'}
                                </span>
                                <p className="admin-chat-text">{message.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="admin-users-shell admin-reveal admin-reveal--3" aria-label="Registered users">
          <div className="admin-users-shell-accent" aria-hidden="true" />
          <div className="admin-users-head">
            <div>
              <span className="admin-section-chip">Directory</span>
              <h2 className="admin-users-title">Patient intelligence</h2>
              <p className="admin-users-sub">Search the roster, inspect status, open encrypted chat history</p>
            </div>
            <div className="admin-search-wrap">
              <span className="admin-search-icon" aria-hidden="true">
                ⌕
              </span>
              <label htmlFor="admin-user-search" className="sr-only">
                Search users
              </label>
              <input
                id="admin-user-search"
                type="search"
                className="admin-search-input"
                placeholder="Name or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search users by name or email"
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-loading" role="status" aria-live="polite">
              <div className="admin-spinner" aria-hidden="true" />
              <p>Loading users…</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-empty" role="status">
              <span className="admin-empty-icon" aria-hidden="true">
                👥
              </span>
              <h3>No users found</h3>
              <p>Try another search or check back after new registrations.</p>
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Status</th>
                    <th scope="col">Registered</th>
                    <th scope="col">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id ?? index}>
                      <td>
                        <div className="admin-user-cell">
                          <span className="admin-user-avatar" aria-hidden="true">
                            {(user.full_name || 'U')[0].toUpperCase()}
                          </span>
                          <span className="admin-user-name">{user.full_name || 'User'}</span>
                        </div>
                      </td>
                      <td className="admin-td-muted">{user.email}</td>
                      <td>{user.phone || user.phone_number || '—'}</td>
                      <td>
                        <span className={`admin-status ${user.is_active ? 'is-active' : 'is-inactive'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="admin-td-muted">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn-history"
                          onClick={() => viewUserHistory(user)}
                          aria-label={`View consultation history for ${user.full_name || 'user'}`}
                        >
                          <span className="admin-btn-history-inner">Timeline</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-page-section admin-faculty-section admin-reveal admin-reveal--4" aria-labelledby="admin-faculty-title">
          <header className="admin-faculty-head">
            <span className="admin-section-chip admin-section-chip--violet">Clinical network</span>
            <h2 id="admin-faculty-title" className="admin-faculty-title">Physician faculty</h2>
            <p className="admin-faculty-sub">Featured specialists across orthopedics and vision care</p>
          </header>

          <div className="admin-faculty-grid admin-faculty-grid--spotlight">
            <article className="doctor-spotlight doctor-spotlight--ortho" aria-labelledby="doctor-orthopedic-heading">
              <div className="doctor-spotlight__banner">
                <div className="doctor-spotlight__portrait-stage">
                  <div className="doctor-spotlight__portrait-ring" aria-hidden="true" />
                  <div className="doctor-spotlight__portrait-shine" aria-hidden="true" />
                  <img
                    src={adminSpotlightPortrait}
                    alt={`${ORTHOPEDIC_DOCTOR.name}, ${ORTHOPEDIC_DOCTOR.title}`}
                    className="doctor-spotlight__photo"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="doctor-spotlight__banner-overlay" aria-hidden />
                <span className="doctor-spotlight__tag">🦴 Orthopedic</span>
              </div>
              <div className="doctor-spotlight__content">
                <h3 id="doctor-orthopedic-heading" className="doctor-spotlight__name">{ORTHOPEDIC_DOCTOR.name}</h3>
                <p className="doctor-spotlight__role">{ORTHOPEDIC_DOCTOR.title}</p>
                <p className="doctor-spotlight__quals">{ORTHOPEDIC_DOCTOR.qualificationLine}</p>
                <p className="doctor-spotlight__bio">{ORTHOPEDIC_DOCTOR.bio}</p>
                <ul className="doctor-spotlight__stats">
                  <li><strong>{ORTHOPEDIC_DOCTOR.experienceYears}+</strong><span>Years</span></li>
                  <li><strong>FCPS</strong><span>Board</span></li>
                  <li><strong>Mon–Sat</strong><span>Available</span></li>
                </ul>
                <div className="doctor-spotlight__footer">
                  <span className="doctor-spotlight__chip">🏥 {ORTHOPEDIC_DOCTOR.hospital}</span>
                  <span className="doctor-spotlight__chip doctor-spotlight__chip--time">🕐 {ORTHOPEDIC_DOCTOR.availability}</span>
                </div>
              </div>
            </article>

            <article className="doctor-spotlight doctor-spotlight--vision" aria-labelledby="doctor-ophthalmology-heading">
              <div className="doctor-spotlight__banner">
                <div className="doctor-spotlight__portrait-stage">
                  <div className="doctor-spotlight__portrait-ring doctor-spotlight__portrait-ring--vision" aria-hidden="true" />
                  <div className="doctor-spotlight__portrait-shine doctor-spotlight__portrait-shine--vision" aria-hidden="true" />
                  <img
                    src={adminDoctor2Portrait}
                    alt={`${OPHTHALMOLOGY_DOCTOR.name}, ${OPHTHALMOLOGY_DOCTOR.title}`}
                    className="doctor-spotlight__photo"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="doctor-spotlight__banner-overlay doctor-spotlight__banner-overlay--vision" aria-hidden />
                <span className="doctor-spotlight__tag doctor-spotlight__tag--vision">👁 Ophthalmology</span>
              </div>
              <div className="doctor-spotlight__content">
                <h3 id="doctor-ophthalmology-heading" className="doctor-spotlight__name">{OPHTHALMOLOGY_DOCTOR.name}</h3>
                <p className="doctor-spotlight__role">{OPHTHALMOLOGY_DOCTOR.title}</p>
                <p className="doctor-spotlight__quals">{OPHTHALMOLOGY_DOCTOR.qualificationLine}</p>
                <p className="doctor-spotlight__bio">{OPHTHALMOLOGY_DOCTOR.bio}</p>
                <ul className="doctor-spotlight__stats doctor-spotlight__stats--vision">
                  <li><strong>LUMHS</strong><span>Jamshoro</span></li>
                  <li><strong>MBBS</strong><span>Degree</span></li>
                  <li><strong>JPMC</strong><span>Fellowship</span></li>
                </ul>
                <div className="doctor-spotlight__footer">
                  <span className="doctor-spotlight__chip doctor-spotlight__chip--vision">🎓 {OPHTHALMOLOGY_DOCTOR.education}</span>
                  <span className="doctor-spotlight__chip doctor-spotlight__chip--vision">👁 {OPHTHALMOLOGY_DOCTOR.fellowship}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>

      {showHistoryModal && selectedUser && (
        <div
          className="admin-modal-overlay"
          onClick={() => {
            setShowHistoryModal(false)
            setSelectedSession(null)
            setSessionMessages([])
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h2 id="history-modal-title">
                  {selectedSession ? selectedSession.session_name : `${selectedUser.full_name}'s history`}
                </h2>
                <p className="admin-modal-email">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => {
                  if (selectedSession) {
                    setSelectedSession(null)
                    setSessionMessages([])
                  } else {
                    setShowHistoryModal(false)
                  }
                }}
                aria-label={selectedSession ? 'Back to sessions' : 'Close'}
              >
                {selectedSession ? '←' : '×'}
              </button>
            </div>
            <div className="admin-modal-body">
              {!selectedSession ? (
                userHistory.length === 0 ? (
                  <div className="admin-modal-empty">
                    <p>No consultation sessions yet.</p>
                  </div>
                ) : (
                  <ul className="admin-session-list">
                    {userHistory.map((session) => (
                      <li key={session.id}>
                        <button
                          type="button"
                          className="admin-session-item"
                          onClick={() => viewSessionMessages(session)}
                        >
                          <span className="admin-session-icon" aria-hidden="true">
                            💬
                          </span>
                          <span className="admin-session-info">
                            <span className="admin-session-name">{session.session_name}</span>
                            <time dateTime={session.created_at}>
                              {new Date(session.created_at).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </time>
                          </span>
                          <span className="admin-session-arrow" aria-hidden="true">
                            →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              ) : loadingMessages ? (
                <div className="admin-modal-loading">
                  <div className="admin-spinner" aria-hidden="true" />
                  <p>Loading conversation…</p>
                </div>
              ) : sessionMessages.length === 0 ? (
                <div className="admin-modal-empty">
                  <p>No messages in this session.</p>
                </div>
              ) : (
                <div className="admin-chat-thread">
                  {sessionMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`admin-chat-row ${message.sender === 'user' ? 'from-user' : 'from-bot'}`}
                    >
                      <span className="admin-chat-avatar" aria-hidden="true">
                        {message.sender === 'user' ? '👤' : '🤖'}
                      </span>
                      <div className="admin-chat-bubble">
                        <span className="admin-chat-label">
                          {message.sender === 'user' ? 'Patient' : 'MediBot'}
                        </span>
                        <p className="admin-chat-text">{message.content}</p>
                        <time className="admin-chat-time">
                          {new Date(message.timestamp).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
