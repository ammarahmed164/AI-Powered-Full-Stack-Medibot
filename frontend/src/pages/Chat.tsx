import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../store/slices/chatSlice'
import { AppDispatch, RootState } from '../store/store'
import './Chat.css'

export default function Chat() {
  const dispatch = useDispatch<AppDispatch>()
  const { messages, isLoading } = useSelector((state: RootState) => state.chat)
  const [input, setInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-scroll disabled
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    dispatch(sendMessage(input.trim()))
    setInput('')
  }

  const handleQuickSymptom = (symptom: string) => {
    dispatch(sendMessage(`I have ${symptom}`))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('user_id', 'current-user-id') // Replace with actual user ID
      formData.append('report_type', 'Medical Report')

      const response = await fetch('http://localhost:8000/api/v1/upload/upload-report', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      console.log('Upload result:', result) // Debug log

      if (result.success) {
        // Add bot message with analysis
        dispatch({
          type: 'chat/addMessage',
          payload: {
            type: 'bot',
            content: result.analysis,
            timestamp: new Date().toISOString()
          }
        })
      } else {
        // Show error with actual message
        const errorMsg = result.error || result.detail || result.analysis || 'Failed to analyze report. Please try again.'
        console.log('Upload error:', errorMsg) // Debug log
        dispatch({
          type: 'chat/addMessage',
          payload: {
            type: 'bot',
            content: `❌ Upload Failed: ${errorMsg}`,
            timestamp: new Date().toISOString()
          }
        })
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      dispatch({
        type: 'chat/addMessage',
        payload: {
          type: 'bot',
          content: `❌ Upload Error: ${error.message || 'Failed to upload. Please try again.'}`,
          timestamp: new Date().toISOString()
        }
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Parse response text with bold headings
  const parseResponse = (text: string) => {
    if (!text) return []

    const sections = text.split('\n\n')
    return sections.map((section) => {
      // Check for bold heading
      const boldMatch = section.match(/\*\*(.+?)\*\*(.*)/s)
      if (boldMatch) {
        return {
          type: 'bold-heading',
          heading: boldMatch[1],
          content: boldMatch[2].trim()
        }
      }
      // Regular text or list
      if (section.startsWith('-')) {
        return {
          type: 'list',
          items: section.split('\n').filter(line => line.startsWith('-')).map(line => line.replace('- ', '').trim())
        }
      }
      return {
        type: 'text',
        content: section.trim()
      }
    })
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="chat-logo">
              <span>🤖</span>
            </div>
            <div>
              <h1>MediBot Assistant</h1>
              <p>AI-Powered Healthcare Chatbot</p>
            </div>
          </div>
          <div className="chat-status">
            <span className="status-dot"></span>
            <span>Online</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="welcome-icon">
                <span>💬</span>
              </div>
              <h2>Start a Conversation</h2>
              <p>Describe your symptoms and get instant medical guidance</p>
              
              <div className="quick-symptoms">
                <p className="quick-title">Quick Select:</p>
                <div className="symptom-tags">
                  {['fever', 'headache', 'cough', 'cold', 'stomach pain', 'fatigue'].map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleQuickSymptom(symptom)}
                      className="symptom-tag"
                    >
                      + {symptom}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`message ${message.type === 'user' ? 'message-user' : 'message-bot'}`}
                >
                  <div className="message-avatar">
                    {message.type === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    {/* Parse and render response with bold headings */}
                    {message.type === 'bot' ? (
                      <div className="message-text-parsed">
                        {parseResponse(message.content).map((section, idx) => (
                          <div key={idx} className={`response-section ${section.type}`}>
                            {section.type === 'bold-heading' && (
                              <>
                                <strong className="section-heading">{section.heading}</strong>
                                {section.content?.startsWith('-') ? (
                                  <ul className="parsed-list">
                                    {section.content?.split('\n').filter(line => line.startsWith('-')).map((line, i) => (
                                      <li key={i}>{line.replace('- ', '').trim()}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="section-content">{section.content}</p>
                                )}
                              </>
                            )}
                            {section.type === 'list' && (
                              <ul className="parsed-list">
                                {section.items?.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            )}
                            {section.type === 'text' && (
                              <p className="section-text">{section.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="message-text">{message.content}</div>
                    )}
                    
                    {/* Bot Response Details */}
                    {message.type === 'bot' && message.diseases && message.diseases.length > 0 && (
                      <div className="message-details">
                        <div className="detail-section">
                          <h4>📋 Possible Conditions:</h4>
                          <div className="disease-list">
                            {message.diseases.map((disease, i) => (
                              <div key={i} className="disease-item">
                                <span className="disease-name">{disease.name}</span>
                                <span className={`confidence-badge ${
                                  disease.confidence > 0.8 ? 'confidence-high' :
                                  disease.confidence > 0.6 ? 'confidence-medium' : 'confidence-low'
                                }`}>
                                  {(disease.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {message.advice && message.advice.length > 0 && (
                          <div className="detail-section">
                            <h4>💡 Advice:</h4>
                            <ul className="advice-list">
                              {message.advice.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {message.remedies && message.remedies.length > 0 && (
                          <div className="detail-section">
                            <h4>🌿 Home Remedies:</h4>
                            <ul className="remedies-list">
                              {message.remedies.map((remedy, i) => (
                                <li key={i}>{remedy.remedy_text}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="typing-indicator">
              <div className="typing-avatar">🤖</div>
              <div className="typing-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <form onSubmit={handleSubmit} className="chat-input-form">
            {/* Upload Button - LEFT SIDE */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="chat-upload-btn-left" title="Upload Medical Report">
              {isUploading ? (
                <span>⏳</span>
              ) : (
                <span>📎</span>
              )}
            </label>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="chat-send-btn"
            >
              <span>📤</span>
            </button>
          </form>
          <p className="chat-disclaimer">
            MediBot provides information, not medical advice. Consult a doctor for serious conditions.
          </p>
        </div>
      </div>
    </div>
  )
}
