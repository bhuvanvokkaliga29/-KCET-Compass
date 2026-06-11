import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HiCheckCircle, HiThumbUp, HiQuestionMarkCircle, HiStar } from 'react-icons/hi'

function AnimatedNumber({ value, delay = 0 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => {
      let start = 0
      const step = Math.max(1, Math.ceil(value / 30))
      const timer = setInterval(() => {
        start += step
        if (start >= value) {
          setDisplay(value)
          clearInterval(timer)
        } else {
          setDisplay(start)
        }
      }, 30)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(timeout)
  }, [isInView, value, delay])

  return <span ref={ref}>{display}</span>
}

const categories = [
  {
    key: 'highly-likely',
    label: 'Highly Likely',
    range: 'Chance above 75%',
    icon: <HiCheckCircle />,
    bgColor: '#E8F8ED',
    color: '#34C759',
  },
  {
    key: 'likely',
    label: 'Likely',
    range: 'Chance 55% – 75%',
    icon: <HiThumbUp />,
    bgColor: '#E6F6FE',
    color: '#5AC8FA',
  },
  {
    key: 'possible',
    label: 'Possible',
    range: 'Chance 30% – 55%',
    icon: <HiQuestionMarkCircle />,
    bgColor: '#FFF3E0',
    color: '#FF9500',
  },
  {
    key: 'dream',
    label: 'Dream',
    range: 'Chance below 30%',
    icon: <HiStar />,
    bgColor: '#FFEBEE',
    color: '#FF3B30',
  },
]

function ProbabilityOverview({ grouped }) {
  return (
    <div style={{ marginBottom: 'var(--space-10)' }}>
      <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
        📊 Admission Probability Overview
      </h2>
      <p className="section-subtitle">
        Here's how your chances break down across all matching colleges.
      </p>

      <div className="probability-grid">
        {categories.map((cat, index) => {
          const count = grouped[cat.key]?.length || 0
          return (
            <motion.div
              key={cat.key}
              className="probability-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              style={{ borderTop: `3px solid ${cat.color}` }}
            >
              <div
                className="probability-icon"
                style={{ background: cat.bgColor, color: cat.color }}
              >
                {cat.icon}
              </div>
              <div className="probability-count" style={{ color: cat.color }}>
                <AnimatedNumber value={count} delay={index * 100} />
              </div>
              <div className="probability-label">{cat.label}</div>
              <div className="probability-range">{cat.range}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ProbabilityOverview
