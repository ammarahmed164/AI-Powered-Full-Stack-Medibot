import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect to the actual admin panel page
    navigate('/admin-panel')
  }, [navigate])

  return null
}
