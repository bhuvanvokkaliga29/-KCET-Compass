import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiSearch } from 'react-icons/hi'
import { loadData, getCollegesList } from '../utils/dataProcessor'

function CollegeDetailsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [data, setData] = useState([])
  const [collegeData, setCollegeData] = useState([])
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  
  const initialCollegeCode = searchParams.get('code') || ''
  const [selectedCollege, setSelectedCollege] = useState(initialCollegeCode)
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBranch, setSelectedBranch] = useState('All Branches')
  
  const [availableYears, setAvailableYears] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])

  useEffect(() => {
    loadData().then(rawData => {
      setData(rawData)
      setColleges(getCollegesList(rawData))
      
      const years = [...new Set(rawData.map(r => r.year))].sort((a, b) => b - a)
      setAvailableYears(years)
      
      // Get all categories from a sample record
      if (rawData.length > 0) {
        setAvailableCategories(Object.keys(rawData[0].cutoffs).sort())
      }
      
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!loading && selectedCollege && data.length > 0) {
      const filtered = data.filter(r => r.collegeCode === selectedCollege)
      setCollegeData(filtered)
    } else {
      setCollegeData([])
    }
  }, [selectedCollege, data, loading])

  // Filter data based on selections
  let displayData = [...collegeData]
  if (selectedYear !== 'All Years') {
    displayData = displayData.filter(r => r.year === parseInt(selectedYear))
  }
  if (selectedBranch !== 'All Branches') {
    displayData = displayData.filter(r => r.branchName === selectedBranch)
  }
  
  const availableBranches = [...new Set(collegeData.map(r => r.branchName))].sort()
  
  // Group by branch
  const branchGroups = {}
  displayData.forEach(r => {
    if (!branchGroups[r.branchName]) {
      branchGroups[r.branchName] = []
    }
    branchGroups[r.branchName].push(r)
  })

  // Sort branches
  const sortedBranches = Object.keys(branchGroups).sort()

  const handleCollegeChange = (e) => {
    const code = e.target.value
    setSelectedCollege(code)
    setSearchParams(code ? { code } : {})
  }

  if (loading) {
    return (
      <main className="dashboard container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3, display: 'inline-block', borderTopColor: 'var(--color-primary)' }} />
        <h2 style={{ marginTop: '20px' }}>Loading College Data...</h2>
      </main>
    )
  }

  const activeCollegeName = colleges.find(c => c.code === selectedCollege)?.name || ''

  return (
    <motion.main
      className="dashboard container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: 'var(--space-20)' }}
    >
      <button className="back-btn" onClick={() => navigate(-1)}>
        <HiArrowLeft /> Back
      </button>

      <div className="dashboard-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="hero-title" style={{ fontSize: 'var(--text-4xl)' }}>
          College <span className="gradient-text">Explorer</span>
        </h1>
        <p className="section-subtitle" style={{ margin: 'var(--space-2) auto 0' }}>
          Explore detailed historical cutoffs for individual engineering colleges across all categories and branches.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Select College</label>
            <div className="search-input-wrapper">
              <HiSearch className="search-icon" />
              <select
                className="form-select"
                value={selectedCollege}
                onChange={handleCollegeChange}
                style={{ paddingLeft: '40px' }}
              >
                <option value="">-- Choose a College --</option>
                {colleges.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code}) - {c.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Filter by Year</label>
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All Years">All Years</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Filter by Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Filter by Course</label>
            <select
              className="form-select"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="All Branches">All Courses</option>
              {availableBranches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedCollege ? (
        collegeData.length > 0 ? (
          <div className="college-details-content">
            <h2 style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text)' }}>
              {activeCollegeName} Cutoffs
            </h2>

            {sortedBranches.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <p>No records match your selected filters.</p>
              </div>
            )}

            {sortedBranches.map(branchName => {
              const records = branchGroups[branchName].sort((a, b) => b.year - a.year) // Newest first
              const categoriesToShow = selectedCategory === 'All Categories' ? availableCategories : [selectedCategory]

              return (
                <div key={branchName} className="data-table-wrapper" style={{ marginBottom: 'var(--space-8)' }}>
                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>{branchName}</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ minWidth: '800px' }}>
                      <thead>
                        <tr>
                          <th style={{ width: '120px' }}>Year</th>
                          {categoriesToShow.map(cat => (
                            <th key={cat} style={{ textAlign: 'center' }}>{cat}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {records.map(record => (
                          <tr key={`${record.year}-${record.round}`}>
                            <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{record.year} (R{record.round})</td>
                            {categoriesToShow.map(cat => {
                              const cutoff = record.cutoffs[cat]
                              return (
                                <td key={cat} style={{ textAlign: 'center', color: cutoff && cutoff !== '--' ? 'var(--color-text)' : 'var(--color-text-tertiary)' }}>
                                  {cutoff && cutoff !== '--' ? parseInt(cutoff).toLocaleString() : '--'}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <h3 style={{ color: 'var(--color-text-secondary)' }}>No data available for this college.</h3>
          </div>
        )
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🎓</div>
          <h3 style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Select a college above to explore cutoffs</h3>
        </div>
      )}
    </motion.main>
  )
}

export default CollegeDetailsPage
