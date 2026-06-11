import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const tiers = [
  { name: 'Top Tier', range: '0 – 5,000', color: '#34C759', width: 10 },
  { name: 'Upper Tier', range: '5,000 – 10,000', color: '#5AC8FA', width: 10 },
  { name: 'Middle Tier', range: '10,000 – 25,000', color: '#FF9500', width: 20 },
  { name: 'Competitive', range: '25,000 – 50,000', color: '#FF6B35', width: 25 },
  { name: 'Mass Tier', range: '50,000+', color: '#FF3B30', width: 35 },
]

function RankPositioning({ rank }) {
  const [markerPos, setMarkerPos] = useState(0)
  const rankNum = parseInt(rank)

  useEffect(() => {
    // Calculate marker position as percentage
    let pos = 0
    if (rankNum <= 5000) {
      pos = (rankNum / 5000) * 10
    } else if (rankNum <= 10000) {
      pos = 10 + ((rankNum - 5000) / 5000) * 10
    } else if (rankNum <= 25000) {
      pos = 20 + ((rankNum - 10000) / 15000) * 20
    } else if (rankNum <= 50000) {
      pos = 40 + ((rankNum - 25000) / 25000) * 25
    } else {
      pos = 65 + Math.min(((rankNum - 50000) / 150000) * 35, 33)
    }

    const timer = setTimeout(() => setMarkerPos(pos), 300)
    return () => clearTimeout(timer)
  }, [rankNum])

  // Find current tier
  const currentTier = rankNum <= 5000 ? tiers[0] :
    rankNum <= 10000 ? tiers[1] :
    rankNum <= 25000 ? tiers[2] :
    rankNum <= 50000 ? tiers[3] : tiers[4]

  return (
    <motion.div
      style={{ marginBottom: 'var(--space-10)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
        📍 Your Rank Position
      </h2>
      <p className="section-subtitle">
        You're in the <strong style={{ color: currentTier.color }}>{currentTier.name}</strong> ({currentTier.range})
      </p>

      <div className="rank-visual">
        <div className="rank-bar" style={{ position: 'relative' }}>
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className="rank-segment"
              style={{
                width: `${tier.width}%`,
                background: tier.color,
                opacity: tier.name === currentTier.name ? 1 : 0.5,
              }}
            >
              <span style={{ 
                fontSize: '10px', 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: '0 4px'
              }}>
                {tier.name}
              </span>
            </div>
          ))}
          
          {/* Animated marker */}
          <motion.div
            className="rank-marker"
            style={{ left: `${markerPos}%` }}
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: `${markerPos}%`, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
          >
            <div className="rank-marker-label">
              Rank #{rankNum.toLocaleString()}
            </div>
          </motion.div>
        </div>

        <div className="rank-labels">
          {tiers.map(tier => (
            <div 
              key={tier.name} 
              className="rank-label"
              style={{ width: `${tier.width}%` }}
            >
              <div className="rank-label-range">{tier.range}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default RankPositioning
