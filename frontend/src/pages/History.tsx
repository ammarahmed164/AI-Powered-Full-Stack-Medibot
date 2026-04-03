import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { historyAPI } from '../services/historyApi'

interface Session {
  id: string
  session_name: string
  created_at: string
  message_count?: number
}

interface Message {
  id: string
  sender_type: 'user' | 'bot'
  content: string
  timestamp: string
}

export default function History() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [viewingMessages, setViewingMessages] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }

    fetchSessions()
  }, [navigate])

  const fetchSessions = async () => {
    try {
      // 1. Check LocalStorage
      let userId = localStorage.getItem('user_id') || localStorage.getItem('userId')
      
      // 2. Fallback: Extract from Token
      if (!userId) {
        const token = localStorage.getItem('access_token')
        if (token) {
          if (token.startsWith('jwt_')) userId = token.replace('jwt_', '')
          else if (token.startsWith('admin_jwt_')) userId = token.replace('admin_jwt_', '')
        }
      }

      console.log('🔍 Fetching sessions for User ID:', userId)
      
      if (!userId) {
        console.warn('⚠️ No User ID found')
        return
      }

      const response = await historyAPI.getUserSessions(userId)
      console.log('📦 API Response:', response.data)
      
      setSessions(response.data.sessions || [])
    } catch (error) {
      console.error('❌ Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewSession = async (sessionId: string) => {
    try {
      setSelectedSession(sessionId)
      setViewingMessages(true)
      
      const response = await historyAPI.getSessionMessages(sessionId)
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const goBack = () => {
    setViewingMessages(false)
    setSelectedSession(null)
    setMessages([])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (viewingMessages && selectedSession) {
    return (
      <div className="history-page">
        <div className="history-header">
          <button className="back-btn" onClick={goBack}>
            ← Back to Sessions
          </button>
          <h2>Session Messages</h2>
          <p className="session-date">
            {messages[0] ? formatDate(messages[0].timestamp) : ''}
          </p>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-messages">
              <p>No messages found</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${msg.sender_type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-sender">
                  {msg.sender_type === 'user' ? '👤 You' : '🤖 MediBot'}
                </div>
                <div className="message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>My Chat History</h1>
        <p className="history-subtitle">View your past conversations with MediBot</p>
      </div>

      {loading ? (
        <div className="loading-sessions">
          <div className="spinner"></div>
          <p>Loading your history...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">💬</div>
          <h3>No chat history yet</h3>
          <p>Start a conversation with MediBot to see your history here</p>
          <button className="start-chat-btn" onClick={() => navigate('/chat')}>
            Start Chat
          </button>
        </div>
      ) : (
        <div className="sessions-grid">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="session-card"
              onClick={() => viewSession(session.id)}
            >
              <div className="session-icon">💬</div>
              <div className="session-info">
                <h3>{session.session_name}</h3>
                <p className="session-date">{formatDate(session.created_at)}</p>
                {session.message_count && (
                  <p className="message-count">{session.message_count} messages</p>
                )}
              </div>
              <div className="session-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .history-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 50%, #c3cfe2 100%);
          padding: 40px 20px;
        }

        .history-header {
          max-width: 1200px;
          margin: 0 auto 40px;
          text-align: center;
        }

        .history-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 10px 0;
        }

        .history-subtitle {
          color: #718096;
          font-size: 1.1rem;
          margin: 0;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          color: #4a5568;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .back-btn:hover {
          border-color: #667eea;
          color: #667eea;
          transform: translateX(-5px);
        }

        .loading-sessions {
          text-align: center;
          padding: 80px 20px;
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

        .empty-history {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 20px;
        }

        .empty-history h3 {
          font-size: 1.75rem;
          color: #1a202c;
          margin: 0 0 10px 0;
        }

        .empty-history p {
          color: #718096;
          margin: 0 0 30px 0;
        }

        .start-chat-btn {
          padding: 16px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .start-chat-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
        }

        .sessions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .session-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .session-card:hover {
          border-color: #667eea;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .session-icon {
          font-size: 2.5rem;
        }

        .session-info {
          flex: 1;
        }

        .session-info h3 {
          font-size: 1.25rem;
          color: #1a202c;
          margin: 0 0 8px 0;
          font-weight: 700;
        }

        .session-date {
          color: #718096;
          font-size: 0.9rem;
          margin: 0 0 4px 0;
        }

        .message-count {
          color: #667eea;
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0;
        }

        .session-arrow {
          font-size: 1.5rem;
          color: #cbd5e0;
          transition: all 0.3s ease;
        }

        .session-card:hover .session-arrow {
          color: #667eea;
          transform: translateX(5px);
        }

        .messages-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message-bubble {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .user-message {
          border-left: 4px solid #667eea;
        }

        .bot-message {
          border-left: 4px solid #764ba2;
        }

        .message-sender {
          font-weight: 700;
          color: #4a5568;
          margin-bottom: 12px;
          font-size: 0.95rem;
        }

        .message-content p {
          color: #2d3748;
          line-height: 1.8;
          margin: 0 0 8px 0;
        }

        .message-time {
          color: #a0aec0;
          font-size: 0.85rem;
          margin-top: 12px;
        }

        .empty-messages {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
        }

        .empty-messages p {
          color: #718096;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .sessions-grid {
            grid-template-columns: 1fr;
          }

          .history-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
