import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiX, HiSearch } from 'react-icons/hi'
import { getProbabilityColor } from '../utils/dataProcessor'

function CollegeComparison({ results }) {
  const [selectedColleges, setSelectedColleges] = useState(
    results.slice(0, 2).map(r => r.collegeCode)
  )
  const [search, setSearch] = useState('')

  const handleToggle = (code) => {
    if (selectedColleges.includes(code)) {
      setSelectedColleges(selectedColleges.filter(c => c !== code))
    } else {
      if (selectedColleges.length < 3) {
        setSelectedColleges([...selectedColleges, code])
      }
    }
    setSearch('') // clear search after selection
  }

  const comparisonData = selectedColleges.map(code => 
    results.find(r => r.collegeCode === code)
  ).filter(Boolean)

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return results.filter(r => 
      !selectedColleges.includes(r.collegeCode) &&
      (r.collegeName.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
    ).slice(0, 5) // show top 5 matches
  }, [search, results, selectedColleges])

  if (!results || results.length === 0) return null

  return (
    <motion.div
      style={{ marginBottom: 'var(--space-10)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
        ⚖️ Compare Colleges
      </h2>
      <p className="section-subtitle">
        Select up to 3 colleges to compare their cutoffs, trends, and features side-by-side.
      </p>

      <div style={{ marginBottom: 'var(--space-6)', position: 'relative', zIndex: 10 }}>
        {selectedColleges.length < 3 && (
          <div className="search-input-wrapper" style={{ maxWidth: '400px', marginBottom: 'var(--space-4)' }}>
            <HiSearch className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search to add a college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, width: '400px', maxWidth: '100%',
            background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', 
            boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', 
            overflow: 'hidden'
          }}>
            {searchResults.map(college => (
              <div 
                key={college.collegeCode}
                onClick={() => handleToggle(college.collegeCode)}
                style={{ 
                  padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{college.collegeName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{college.city} • {college.branchName}</div>
                </div>
                <HiPlus style={{ color: 'var(--color-primary)' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="comparison-selector" style={{ marginBottom: 'var(--space-6)' }}>
        {selectedColleges.map(code => {
          const college = results.find(r => r.collegeCode === code)
          if (!college) return null
          return (
            <button
              key={code}
              className="comparison-chip selected"
              onClick={() => handleToggle(code)}
            >
              <HiX />
              {college.collegeName.substring(0, 25)}...
            </button>
          )
        })}
      </div>

      {comparisonData.length > 0 && (
        <div className="data-table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Feature</th>
                {comparisonData.map(c => (
                  <th key={c.collegeCode} style={{ width: `${80 / comparisonData.length}%` }}>
                    <div style={{ fontSize: '16px', color: 'var(--color-text)', fontWeight: 700 }}>
                      {c.collegeName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                      {c.branchName}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>City</td>
                {comparisonData.map(c => <td key={c.collegeCode}>{c.city}</td>)}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Latest Cutoff</td>
                {comparisonData.map(c => (
                  <td key={c.collegeCode} style={{ fontWeight: 700 }}>
                    {c.latestCutoff?.toLocaleString() || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Admission Chance</td>
                {comparisonData.map(c => (
                  <td key={c.collegeCode} style={{ color: getProbabilityColor(c.probCategory), fontWeight: 700 }}>
                    {c.probability !== null ? `${c.probability}% (${c.probCategory.replace('-', ' ')})` : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Rank Difference</td>
                {comparisonData.map(c => (
                  <td key={c.collegeCode}>
                    {c.difference !== null ? (
                      <span style={{ color: c.difference <= 0 ? '#34C759' : '#FF3B30' }}>
                        {c.difference > 0 ? `+${c.difference.toLocaleString()}` : c.difference.toLocaleString()}
                      </span>
                    ) : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Trend</td>
                {comparisonData.map(c => (
                  <td key={c.collegeCode}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {c.trend?.icon} {c.trend?.label}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Tier Classification</td>
                {comparisonData.map(c => (
                  <td key={c.collegeCode}>
                    <span className={`badge badge-primary`}>
                      {c.tier?.label || 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}

export default CollegeComparison
