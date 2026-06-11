import React from 'react'
import { motion } from 'framer-motion'
import { HiLocationMarker, HiAcademicCap, HiTag, HiStar } from 'react-icons/hi'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function StudentSummary({ rank, category, branch, city, round }) {
  return (
    <motion.div
      className="summary-card"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)', opacity: 0.95 }}>
          📋 Your Analysis Summary
        </h2>
        <div className="summary-grid">
          <div>
            <div className="summary-item-label">KCET Rank</div>
            <div className="summary-item-value">#{parseInt(rank).toLocaleString()}</div>
          </div>
          <div>
            <div className="summary-item-label">Category</div>
            <div className="summary-item-value">{category}</div>
          </div>
          <div>
            <div className="summary-item-label">Branch</div>
            <div className="summary-item-value" style={{ fontSize: 'var(--text-base)' }}>{branch}</div>
          </div>
          <div>
            <div className="summary-item-label">City</div>
            <div className="summary-item-value">{city}</div>
          </div>
          <div>
            <div className="summary-item-label">Round</div>
            <div className="summary-item-value">Round {round}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StudentSummary
