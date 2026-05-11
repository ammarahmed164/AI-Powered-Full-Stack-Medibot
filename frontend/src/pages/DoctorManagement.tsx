import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import './DoctorManagement.css'

function doctorInitials(name: string) {
  const parts = name.replace(/^Dr\.?\s*/i, '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'MD'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface Doctor {
  id?: string
  name: string
  specialization: string
  qualification: string
  experience: number
  availability: string
  hospital: string
  bio: string
  image?: string
  imageFile?: File
}

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 'featured-doctor-1',
      name: 'Dr Syed Umar Rafiq',
      specialization: 'Consultant Orthopedic Surgeon',
      qualification: 'MBBS, FCPS',
      experience: 12,
      availability: 'Mon - Sat, 10:00 AM - 7:00 PM',
      hospital: 'MediCare Orthopedic & Trauma Center',
      bio: 'Orthopedic consultation focus: bone and joint care, post-injury recovery, and evidence-guided treatment planning for every patient.',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Doctor>({
    name: '',
    specialization: '',
    qualification: '',
    experience: 0,
    availability: '',
    hospital: '',
    bio: '',
    image: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string,
          imageFile: file
        }))
      }
      reader.readAsDataURL(file)
      toast.success('Image selected')
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) { toast.error('Doctor name is required'); return false }
    if (!formData.specialization.trim()) { toast.error('Specialization is required'); return false }
    if (!formData.qualification.trim()) { toast.error('Qualification is required'); return false }
    if (formData.experience < 0) { toast.error('Experience cannot be negative'); return false }
    if (!formData.availability.trim()) { toast.error('Availability is required'); return false }
    if (!formData.hospital.trim()) { toast.error('Hospital/Clinic name is required'); return false }
    if (!formData.bio.trim()) { toast.error('Bio is required'); return false }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // Simulate API call
      if (editingId) {
        setDoctors(doctors.map(doc =>
          doc.id === editingId
            ? { ...formData, id: editingId }
            : doc
        ))
        toast.success('Doctor updated successfully!')
      } else {
        const newDoctor: Doctor = {
          ...formData,
          id: Date.now().toString()
        }
        setDoctors([...doctors, newDoctor])
        toast.success('Doctor added successfully!')
      }

      resetForm()
      setShowForm(false)
    } catch (error) {
      toast.error('Failed to save doctor information')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      qualification: '',
      experience: 0,
      availability: '',
      hospital: '',
      bio: '',
      image: '',
    })
    setEditingId(null)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleEdit = (doctor: Doctor) => {
    setFormData(doctor)
    setEditingId(doctor.id || null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doc => doc.id !== id))
      toast.success('Doctor deleted successfully')
    }
  }

  return (
    <div className="doctor-management" role="main" aria-label="Doctor Management">
      <div className="dm-header">
        <div>
          <h1 className="dm-title">👨‍⚕️ Doctor Management</h1>
          <p className="dm-subtitle">Manage healthcare professionals and their information</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-add-doctor"
            aria-label="Add new doctor"
          >
            <span aria-hidden="true">➕</span> Add New Doctor
          </button>
        )}
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="dm-form-container" role="region" aria-label="Doctor form">
          <div className="dm-form-card">
            <div className="form-header">
              <h2 id="form-title">{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button
                onClick={() => { resetForm(); setShowForm(false); }}
                className="form-close"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="doctor-form" aria-labelledby="form-title">
              {/* Image Upload */}
              <div className="form-section">
                <h3>Profile Picture</h3>
                <div className="image-upload-area">
                  {formData.image ? (
                    <div className="image-preview">
                      <img src={formData.image} alt={`Profile picture of ${formData.name || 'doctor'}`} />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="remove-image-btn"
                        aria-label="Remove profile picture"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label" htmlFor="doctor-image-upload">
                      <input
                        id="doctor-image-upload"
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        aria-label="Upload doctor profile picture"
                      />
                      <div className="upload-content">
                        <span aria-hidden="true">📷</span>
                        <p>Click to upload doctor's profile picture</p>
                        <small>Max 5MB • PNG, JPG, WEBP</small>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Doctor Information */}
              <div className="form-section">
                <h3>Basic Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="doctor-name">Full Name *</label>
                    <input
                      id="doctor-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Dr. John Doe"
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doctor-specialization">Specialization *</label>
                    <input
                      id="doctor-specialization"
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Cardiology, Neurology"
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="doctor-qualification">Qualification *</label>
                    <input
                      id="doctor-qualification"
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="e.g., MD, MBBS, DM"
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doctor-experience">Years of Experience *</label>
                    <input
                      id="doctor-experience"
                      type="number"
                      name="experience"
                      min="0"
                      max="70"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="form-section">
                <h3>Professional Details</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="doctor-hospital">Hospital/Clinic Name *</label>
                    <input
                      id="doctor-hospital"
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      placeholder="e.g., ABC Medical Hospital"
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doctor-availability">Availability *</label>
                    <input
                      id="doctor-availability"
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      placeholder="e.g., Mon-Fri 9AM-6PM"
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="doctor-bio">Bio/Description *</label>
                  <textarea
                    id="doctor-bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Enter doctor's bio, experience summary, and specialties..."
                    rows={4}
                    className="form-textarea"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="btn-cancel"
                  aria-label="Cancel and close form"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                  aria-label={editingId ? 'Update doctor information' : 'Add new doctor'}
                  aria-busy={loading}
                >
                  {loading ? '⏳ Saving...' : (editingId ? '✓ Update Doctor' : '+ Add Doctor')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="dm-content">
        {doctors.length === 0 ? (
          <div className="empty-state-doctors" role="status" aria-live="polite">
            <div className="empty-icon" aria-hidden="true">👨‍⚕️</div>
            <h3>No Doctors Added Yet</h3>
            <p>Click "Add New Doctor" to start adding healthcare professionals</p>
          </div>
        ) : (
          <div className="doctors-grid" role="list" aria-label="List of doctors">
            {doctors.map((doctor) => (
              <article key={doctor.id} className="doctor-card" role="listitem">
                {doctor.image ? (
                  <div className="doctor-image-wrapper">
                    <img
                      src={doctor.image}
                      alt={`Profile picture of ${doctor.name}`}
                      className="doctor-image"
                    />
                  </div>
                ) : (
                  <div className="doctor-image-wrapper doctor-image-placeholder" aria-hidden="true">
                    <span>{doctorInitials(doctor.name)}</span>
                  </div>
                )}

                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-spec">{doctor.specialization}</p>

                  <div className="doctor-details">
                    <div className="detail-item">
                      <span className="detail-icon" aria-hidden="true">🎓</span>
                      <span className="detail-text">{doctor.qualification}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon" aria-hidden="true">⏰</span>
                      <span className="detail-text">{doctor.experience}+ years experience</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon" aria-hidden="true">🏥</span>
                      <span className="detail-text">{doctor.hospital}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon" aria-hidden="true">📅</span>
                      <span className="detail-text">{doctor.availability}</span>
                    </div>
                  </div>

                  <p className="doctor-bio">{doctor.bio}</p>

                  <div className="doctor-actions">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="btn-edit"
                      aria-label={`Edit ${doctor.name}'s information`}
                    >
                      <span aria-hidden="true">✏️</span> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id!)}
                      className="btn-delete"
                      aria-label={`Delete ${doctor.name} from the list`}
                    >
                      <span aria-hidden="true">🗑️</span> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
