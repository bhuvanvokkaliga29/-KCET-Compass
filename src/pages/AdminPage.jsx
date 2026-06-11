import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiLockClosed, HiUpload, HiCheckCircle } from 'react-icons/hi'
import { loadData, getDataStats } from '../utils/dataProcessor'

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadData().then(data => {
        setStats(getDataStats(data))
      })
    }
  }, [isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple client-side protection as requested for this prototype
    if (password === 'admin123') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-gate">
        <motion.div 
          className="admin-login-card card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ fontSize: '48px', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
            <HiLockClosed />
          </div>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Admin Portal</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: 'var(--space-4)' }}
            />
            {error && <p style={{ color: 'var(--color-danger)', fontSize: '14px', marginBottom: 'var(--space-4)' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 className="section-title" style={{ margin: 0 }}>System Administration</h1>
          <button className="btn btn-secondary" onClick={() => setIsAuthenticated(false)}>
            Log Out
          </button>
        </div>

        {stats && (
          <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-10)' }}>
            <div className="admin-stat-card card">
              <div className="admin-stat-value">{stats.totalRecords.toLocaleString()}</div>
              <div className="admin-stat-label">Total Cutoff Records</div>
            </div>
            <div className="admin-stat-card card">
              <div className="admin-stat-value">{stats.colleges}</div>
              <div className="admin-stat-label">Colleges in DB</div>
            </div>
            <div className="admin-stat-card card">
              <div className="admin-stat-value">{stats.branches}</div>
              <div className="admin-stat-label">Unique Branches</div>
            </div>
            <div className="admin-stat-card card">
              <div className="admin-stat-value">{stats.years.join(', ')}</div>
              <div className="admin-stat-label">Years of Data</div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '18px', fontWeight: 700 }}>
            Upload New KCET Data
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Upload the official KEA cutoff PDF to convert and add to the database.
          </p>
          
          <div style={{ 
            border: '2px dashed var(--color-border)', 
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-10)',
            textAlign: 'center',
            background: 'var(--color-surface-alt)',
            cursor: 'pointer'
          }}>
            <HiUpload style={{ fontSize: '48px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }} />
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Click to upload or drag and drop</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>PDF files only (max. 10MB)</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '18px', fontWeight: 700 }}>
            System Status
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: 500 }}>
            <HiCheckCircle size={20} /> Platform is running normally
          </div>
          <p style={{ marginTop: 'var(--space-4)', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Last data update: Today. No backend dependency detected. Running efficiently from static JSON.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
