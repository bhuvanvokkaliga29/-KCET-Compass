import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function CutoffTrends({ results, years }) {
  const [selectedCollege, setSelectedCollege] = useState(results[0]?.collegeCode || '')

  const chartData = useMemo(() => {
    if (!selectedCollege || !years || years.length === 0) return []
    
    const college = results.find(r => r.collegeCode === selectedCollege)
    if (!college) return []

    return years.sort().map(year => ({
      year: year.toString(),
      cutoff: college.cutoffsByYear[year] || null,
    }))
  }, [selectedCollege, results, years])

  const collegeData = results.find(r => r.collegeCode === selectedCollege)

  if (!results || results.length === 0) return null

  return (
    <motion.div
      style={{ marginBottom: 'var(--space-10)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
        📈 Cutoff Trends
      </h2>
      <p className="section-subtitle">
        Analyze how cutoffs have changed over the last years to predict future trends.
      </p>

      <div className="chart-container" style={{ background: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
        <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Trend Analysis</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Higher on the graph = Lower cutoff rank (More Competitive)
            </p>
          </div>
          
          <select 
            className="form-select"
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            {results.slice(0, 50).map(r => (
              <option key={r.collegeCode} value={r.collegeCode}>
                {r.collegeName} ({r.branchCode})
              </option>
            ))}
          </select>
        </div>

        {collegeData && (
          <div style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)' }}>
            <div className="badge badge-primary" style={{ padding: '6px 12px', borderRadius: '20px', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
              Trend: {collegeData.trend?.icon} {collegeData.trend?.label || 'N/A'}
            </div>
            <div className="badge badge-info" style={{ padding: '6px 12px', borderRadius: '20px', background: '#E6F6FE', color: '#007AFF' }}>
              {collegeData.tier?.label}
            </div>
          </div>
        )}

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-secondary)', fontWeight: 600 }} 
                padding={{ left: 30, right: 30 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-secondary)' }}
                reversed={true}
                domain={['dataMin - 500', 'dataMax + 500']}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}
                formatter={(value) => [value.toLocaleString(), 'Cutoff Rank']}
                labelStyle={{ fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '8px' }}
              />
              <Line 
                type="monotone" 
                dataKey="cutoff" 
                stroke="var(--color-primary)" 
                strokeWidth={5}
                dot={{ r: 6, fill: '#fff', stroke: 'var(--color-primary)', strokeWidth: 3 }}
                activeDot={{ r: 10, fill: 'var(--color-primary)', stroke: '#fff', strokeWidth: 3 }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

export default CutoffTrends
