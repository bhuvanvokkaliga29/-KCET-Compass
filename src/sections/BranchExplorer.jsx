import React from 'react'
import { motion } from 'framer-motion'
import { HiLightningBolt, HiCode, HiDatabase, HiGlobeAlt, HiDesktopComputer, HiDeviceMobile } from 'react-icons/hi'
import { getBranchOpportunities } from '../utils/dataProcessor'

const getBranchIcon = (code) => {
  if (['CS', 'CA'].includes(code)) return <HiCode />
  if (['AI', 'AD'].includes(code)) return <HiLightningBolt />
  if (['EC', 'ET', 'EI'].includes(code)) return <HiDesktopComputer />
  if (['IE'].includes(code)) return <HiGlobeAlt />
  if (['EE', 'ME', 'CE', 'CV'].includes(code)) return <HiDeviceMobile />
  return <HiDatabase />
}

function BranchExplorer({ data, studentInfo }) {
  const branches = getBranchOpportunities(data, studentInfo)

  if (!branches || branches.length === 0) return null

  return (
    <motion.div
      style={{ marginBottom: 'var(--space-10)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
        🔭 Alternative Branch Opportunities
      </h2>
      <p className="section-subtitle">
        Discover how many colleges you can get into if you choose a different branch.
      </p>

      <div className="branch-grid">
        {branches.slice(0, 10).map((branch, i) => (
          <motion.div
            key={branch.code}
            className="branch-card"
            whileHover={{ y: -4, scale: 1.02 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 + 0.3 }}
            onClick={() => {
              const el = document.getElementById('table-search')
              if (el) {
                el.value = branch.name
                el.dispatchEvent(new Event('input', { bubbles: true }))
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }}
          >
            <div className="branch-card-icon" style={{ color: 'var(--color-primary)' }}>
              {getBranchIcon(branch.code)}
            </div>
            <div className="branch-card-count">
              {branch.reachable} <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>/ {branch.total}</span>
            </div>
            <div className="branch-card-name">{branch.name}</div>
            <div className="branch-card-label">Colleges in your range</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default BranchExplorer
