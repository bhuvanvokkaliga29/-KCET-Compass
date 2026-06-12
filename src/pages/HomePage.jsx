import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { HiAcademicCap, HiChartBar, HiLightningBolt, HiSearch } from 'react-icons/hi'
import { loadData, getDataStats } from '../utils/dataProcessor'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

function HomePage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ colleges: 0, branches: 0, years: [] })
  const [form, setForm] = useState({
    rank: '',
    category: 'GM',
    branch: 'Computer Science Engineering',
    city: 'All Karnataka',
    round: '2',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    loadData().then(data => {
      if (data.length > 0) {
        setStats(getDataStats(data))
      }
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleRankChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setForm(prev => ({ ...prev, rank: value }))
    if (errors.rank) {
      setErrors(prev => ({ ...prev, rank: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.rank) {
      newErrors.rank = 'Please enter your KCET rank'
    } else if (parseInt(form.rank) < 1 || parseInt(form.rank) > 250000) {
      newErrors.rank = 'Please enter a valid rank (1 - 250,000)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    // Small delay for smooth transition
    await new Promise(r => setTimeout(r, 400))
    
    const params = new URLSearchParams(form).toString()
    navigate(`/results?${params}`)
  }

  const handleRipple = (e) => {
    const btn = e.currentTarget
    const ripple = document.createElement('span')
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`
    ripple.className = 'btn-ripple'
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ─── Hero Section ─── */}
      <section className="hero-fullscreen">

        <div className="container hero-grid">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="hero-badge">
              <span className="hero-badge-dot" />
              KCET 2025 Data Available
            </motion.div>

            <motion.h1 variants={fadeUp} className="hero-title">
              Find Your Best KCET{' '}
              <span className="gradient-text">Engineering College</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="hero-subtitle">
              Analyze 4 years of KCET cutoff data (2022-2025) and discover your admission opportunities instantly with our premium intelligence engine.
            </motion.p>

            {/* ─── Analysis Form ─── */}
            <motion.div variants={fadeUp} className="glass-panel premium-form-container" ref={formRef}>
              <form className="analysis-form" onSubmit={handleSubmit} id="analysis-form">
                <h3 className="analysis-form-title">🎯 KCET Analysis</h3>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="rank-input">Your KCET Rank</label>
                    <input
                      id="rank-input"
                      type="text"
                      inputMode="numeric"
                      className={`form-input ${errors.rank ? 'error' : ''}`}
                      placeholder="Enter your KCET Rank"
                      name="rank"
                      value={form.rank}
                      onChange={handleRankChange}
                      autoComplete="off"
                      style={{ fontSize: '1.125rem', padding: '14px 16px' }}
                    />
                    {errors.rank && <span className="form-error">{errors.rank}</span>}
                    {form.rank && !errors.rank && (
                      <span style={{ fontSize: '12px', color: '#34C759', marginTop: '4px' }}>
                        ✓ Rank {parseInt(form.rank).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="category-select">Category</label>
                    <select
                      id="category-select"
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <optgroup label="General Merit">
                        <option value="GM">GM (General Merit)</option>
                        <option value="GMK">GMK (Kannada)</option>
                        <option value="GMR">GMR (Rural)</option>
                        <option value="GMP">GMP</option>
                      </optgroup>
                      <optgroup label="Category 1">
                        <option value="1G">1G</option>
                        <option value="1K">1K</option>
                        <option value="1R">1R</option>
                      </optgroup>
                      <optgroup label="Category 2A">
                        <option value="2AG">2AG</option>
                        <option value="2AK">2AK</option>
                        <option value="2AR">2AR</option>
                      </optgroup>
                      <optgroup label="Category 2B">
                        <option value="2BG">2BG</option>
                        <option value="2BK">2BK</option>
                        <option value="2BR">2BR</option>
                      </optgroup>
                      <optgroup label="Category 3A">
                        <option value="3AG">3AG</option>
                        <option value="3AK">3AK</option>
                        <option value="3AR">3AR</option>
                      </optgroup>
                      <optgroup label="Category 3B">
                        <option value="3BG">3BG</option>
                        <option value="3BK">3BK</option>
                        <option value="3BR">3BR</option>
                      </optgroup>
                      <optgroup label="SC">
                        <option value="SCG">SCG</option>
                        <option value="SCK">SCK</option>
                        <option value="SCR">SCR</option>
                      </optgroup>
                      <optgroup label="ST">
                        <option value="STG">STG</option>
                        <option value="STK">STK</option>
                        <option value="STR">STR</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option value="NRI">NRI</option>
                        <option value="OPN">OPN</option>
                        <option value="OTH">OTH</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="branch-select">Preferred Branch</label>
                    <select
                      id="branch-select"
                      className="form-select"
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                    >
                      <option value="Computer Science Engineering">Computer Science Engineering</option>
                      <option value="Information Science Engineering">Information Science Engineering</option>
                      <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="city-select">Preferred City</label>
                    <select
                      id="city-select"
                      className="form-select"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                    >
                      <option value="All Karnataka">All Karnataka</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mysore">Mysore</option>
                      <option value="Mangalore">Mangalore</option>
                      <option value="Hubli">Hubli</option>
                      <option value="Belagavi">Belagavi</option>
                      <option value="Davanagere">Davanagere</option>
                      <option value="Shivamogga">Shivamogga</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="round-select">Counselling Round</label>
                    <select
                      id="round-select"
                      className="form-select"
                      name="round"
                      value={form.round}
                      onChange={handleChange}
                    >
                      <option value="1">Round 1</option>
                      <option value="2">Round 2</option>
                      <option value="3">Round 3 (Extended)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="analyze-btn"
                  disabled={isLoading}
                  onClick={handleRipple}
                  id="analyze-button"
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2, display: 'inline-block', verticalAlign: 'middle', marginRight: 8, borderTopColor: '#000' }} />
                      Analyzing...
                    </>
                  ) : (
                    <>🔍 Analyze My Chances</>
                  )}
                </button>
                
                <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: 'rgba(0, 122, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 122, 255, 0.1)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>Note:</strong> Students belonging to <strong>Rural</strong> or <strong>Kannada medium</strong> categories (e.g., GMR, GMK, 3AR, 3AK) should also check their respective General categories (e.g., GM, 3AG, SCG). If seats are unavailable in Rural/Kannada medium, they may be allotted under the General category.
                </div>
              </form>
            </motion.div>

            {/* Stats section removed as per request */}
          </motion.div>

          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src="/hero-bg.png" alt="Students studying" className="hero-image" />
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="section section-alt" id="features">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            style={{ textAlign: 'center' }}
          >
            <motion.h2 variants={fadeUp} className="section-title" style={{ textAlign: 'center' }}>
              Everything You Need to{' '}
              <span className="gradient-text">Make the Right Choice</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }}>
              Powerful tools to analyze your KCET rank and find the perfect college.
            </motion.p>

            <motion.div variants={fadeUp} className="features-grid">
              <div className="card card-elevated feature-card">
                <div className="feature-icon">
                  <HiSearch />
                </div>
                <h3 className="feature-title">Smart Analysis</h3>
                <p className="feature-desc">
                  Instant probability calculations based on 4 years of cutoff data with trend analysis.
                </p>
              </div>

              <div className="card card-elevated feature-card">
                <div className="feature-icon">
                  <HiChartBar />
                </div>
                <h3 className="feature-title">Cutoff Trends</h3>
                <p className="feature-desc">
                  Visualize how competition changes year over year with beautiful interactive charts.
                </p>
              </div>

              <div className="card card-elevated feature-card">
                <div className="feature-icon">
                  <HiAcademicCap />
                </div>
                <h3 className="feature-title">Branch Explorer</h3>
                <p className="feature-desc">
                  Discover alternative branches and find hidden opportunities across Karnataka colleges.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── About Section ─── */}
      <section className="section" id="about">
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="section-title" style={{ textAlign: 'center' }}>
              Built for <span className="gradient-text">Karnataka Students</span>
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: 'var(--space-4)' }}>
              KCET Compass uses official cutoff data from 2022 to 2025 to give you the most accurate 
              predictions for engineering college admissions in Karnataka. Experience premium agency-grade insights instantly.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}

export default HomePage
