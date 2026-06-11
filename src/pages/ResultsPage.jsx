import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowLeft } from 'react-icons/hi'
import { loadData, analyzeResults } from '../utils/dataProcessor'

import StudentSummary from '../sections/StudentSummary'
import ProbabilityOverview from '../sections/ProbabilityOverview'
import CollegeCards from '../sections/CollegeCards'
import CollegeTable from '../sections/CollegeTable'
import RankPositioning from '../sections/RankPositioning'
import BranchExplorer from '../sections/BranchExplorer'
import CutoffTrends from '../sections/CutoffTrends'
import CollegeComparison from '../sections/CollegeComparison'

function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState(null)
  
  // Parse query params
  const searchParams = new URLSearchParams(location.search)
  const studentInfo = {
    rank: searchParams.get('rank') || '',
    category: searchParams.get('category') || 'GM',
    branch: searchParams.get('branch') || '',
    city: searchParams.get('city') || '',
    round: searchParams.get('round') || '2',
  }

  useEffect(() => {
    // If no rank is provided, redirect to home
    if (!studentInfo.rank) {
      navigate('/')
      return
    }

    // Scroll to top
    window.scrollTo(0, 0)

    const fetchData = async () => {
      try {
        const rawData = await loadData()
        setData(rawData)
        
        if (rawData && rawData.length > 0) {
          const result = analyzeResults(rawData, studentInfo)
          setAnalysis(result)
        }
      } catch (error) {
        console.error("Error analyzing data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location.search, navigate])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Analyzing your chances...</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Processing KCET cutoff data across 250+ colleges.</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="loading-screen">
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-danger)' }}>Error Loading Data</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>We couldn't process the cutoff data.</p>
        <Link to="/" className="btn btn-primary">Go Back Home</Link>
      </div>
    )
  }

  // Pass years to studentInfo for use in child components
  studentInfo.years = analysis.years

  return (
    <motion.main
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        <div className="dashboard-header">
          <Link to="/" className="back-btn">
            <HiArrowLeft /> Modify Search
          </Link>
          <h1 className="hero-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)' }}>
            Admission <span className="gradient-text">Intelligence Report</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: 'var(--text-base)' }}>
            Based on historical KCET cutoff data analysis.
          </p>
        </div>

        {/* Section 1: Student Summary */}
        <StudentSummary {...studentInfo} />

        {/* Section 5: Rank Positioning */}
        <RankPositioning rank={studentInfo.rank} />

        {/* Section 2: Probability Overview */}
        <ProbabilityOverview grouped={analysis.grouped} />

        {/* Section 3: College Cards */}
        <CollegeCards results={analysis.results} rank={studentInfo.rank} />

        {/* Section 6: Branch Explorer */}
        <BranchExplorer data={data} studentInfo={studentInfo} />

        {/* Section 7: Cutoff Trends */}
        <CutoffTrends results={analysis.results} years={analysis.years} />

        {/* Section 8: College Comparison */}
        <CollegeComparison results={analysis.results} />

        {/* Section 4: Full Table */}
        <CollegeTable results={analysis.results} studentInfo={studentInfo} />

      </div>
    </motion.main>
  )
}

export default ResultsPage
