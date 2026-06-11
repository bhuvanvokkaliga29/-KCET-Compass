import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiLocationMarker, HiTrendingUp, HiTrendingDown, HiArrowRight } from 'react-icons/hi'
import { getProbabilityColor } from '../utils/dataProcessor'

function CollegeCards({ results, rank }) {
  const [showAll, setShowAll] = useState(false)
  const displayResults = showAll ? results : results.slice(0, 12)

  const getTrendIcon = (trend) => {
    if (trend?.trend === 'increasing') return <HiTrendingUp style={{ color: '#FF3B30' }} />
    if (trend?.trend === 'decreasing') return <HiTrendingDown style={{ color: '#34C759' }} />
    return <HiArrowRight style={{ color: '#999' }} />
  }

  if (results.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🎓</div>
        <h3 className="no-results-title">No colleges found</h3>
        <p className="no-results-desc">Try adjusting your filters or selecting a different branch/city.</p>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 'var(--space-10)' }}>
      <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
        🎓 College Recommendations
      </h2>
      <p className="section-subtitle">
        {results.length} colleges match your criteria. Sorted by admission probability.
      </p>

      <div className="college-cards-grid">
        {displayResults.map((college, index) => {
          const probColor = getProbabilityColor(college.probCategory)
          return (
            <motion.div
              key={`${college.collegeCode}-${college.branchCode}`}
              className="college-card card-elevated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.4 }}
            >
              {/* Top accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: probColor, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
              }} />

              <div className="college-card-header">
                <h3 className="college-card-name">{college.collegeName}</h3>
                <span className={`college-card-tier tier-${college.tier.tier}`}>
                  {college.tier.label}
                </span>
              </div>

              <div className="college-card-meta">
                <span><HiLocationMarker /> {college.city}</span>
                <span>📚 {college.branchName}</span>
              </div>

              <div className="college-card-stats">
                <div className="college-stat">
                  <span className="college-stat-label">Latest Cutoff</span>
                  <span className="college-stat-value">
                    {college.latestCutoff ? college.latestCutoff.toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="college-stat">
                  <span className="college-stat-label">Your Rank</span>
                  <span className="college-stat-value">{parseInt(rank).toLocaleString()}</span>
                </div>
                <div className="college-stat">
                  <span className="college-stat-label">Difference</span>
                  <span className="college-stat-value" style={{
                    color: college.difference <= 0 ? '#34C759' : '#FF3B30'
                  }}>
                    {college.difference !== null ? (
                      college.difference > 0 ? `+${college.difference.toLocaleString()}` : college.difference.toLocaleString()
                    ) : 'N/A'}
                  </span>
                </div>
                <div className="college-stat">
                  <span className="college-stat-label">Trend</span>
                  <span className="college-stat-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getTrendIcon(college.trend)}
                    <span style={{ fontSize: '11px' }}>{college.trend?.label || 'N/A'}</span>
                  </span>
                </div>
              </div>

              <div className="college-card-footer">
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Chance</span>
                  <div style={{ fontWeight: 800, fontSize: '20px', color: probColor }}>
                    {college.probability !== null ? `${college.probability}%` : 'N/A'}
                  </div>
                </div>
                <span className={`badge badge-${college.probCategory === 'highly-likely' ? 'success' : college.probCategory === 'likely' ? 'info' : college.probCategory === 'possible' ? 'warning' : 'danger'}`}>
                  {college.probCategory === 'highly-likely' ? 'Highly Likely' :
                   college.probCategory === 'likely' ? 'Likely' :
                   college.probCategory === 'possible' ? 'Possible' : 'Dream'}
                </span>
              </div>

              <div className="chance-bar">
                <motion.div
                  className="chance-bar-fill"
                  style={{ background: probColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${college.probability || 0}%` }}
                  transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {results.length > 12 && !showAll && (
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <button className="btn btn-secondary" onClick={() => setShowAll(true)}>
            Show All {results.length} Colleges
          </button>
        </div>
      )}
    </div>
  )
}

export default CollegeCards
