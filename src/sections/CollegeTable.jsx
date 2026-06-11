import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HiSearch, HiDownload, HiChevronUp, HiChevronDown, HiSortAscending } from 'react-icons/hi'
import { exportToCSV, exportToPDF } from '../utils/exportUtils'

function CollegeTable({ results, studentInfo }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('probability')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const perPage = 20

  const filtered = useMemo(() => {
    let data = [...results]
    
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(r =>
        r.collegeName.toLowerCase().includes(q) ||
        r.branchName.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
      )
    }

    data.sort((a, b) => {
      let aVal, bVal
      switch (sortKey) {
        case 'college': aVal = a.collegeName; bVal = b.collegeName; break
        case 'city': aVal = a.city; bVal = b.city; break
        case 'cutoff': aVal = a.latestCutoff || 999999; bVal = b.latestCutoff || 999999; break
        case 'probability': aVal = a.probability || 0; bVal = b.probability || 0; break
        default: aVal = a.probability || 0; bVal = b.probability || 0;
      }
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })

    return data
  }, [results, search, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  const SortIcon = ({ field }) => {
    if (sortKey !== field) return <HiSortAscending style={{ opacity: 0.3 }} />
    return sortDir === 'asc' ? <HiChevronUp /> : <HiChevronDown />
  }

  const handleExportCSV = () => {
    exportToCSV(filtered.map(r => ({ ...r, rank: studentInfo.rank })))
  }

  const handleExportPDF = () => {
    exportToPDF(filtered, studentInfo)
  }

  return (
    <motion.div
      style={{ marginBottom: 'var(--space-10)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
        📋 All Colleges
      </h2>
      <p className="section-subtitle">
        Complete list with search, sort, and export options.
      </p>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <HiSearch className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search colleges, branches, or cities..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            id="table-search"
          />
        </div>
        <div className="export-btns">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <HiDownload /> CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportPDF}>
            <HiDownload /> PDF
          </button>
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('college')}>
                College Name <SortIcon field="college" />
              </th>
              <th>Branch</th>
              <th onClick={() => handleSort('city')}>
                City <SortIcon field="city" />
              </th>
              {studentInfo.years && studentInfo.years.map(y => (
                <th key={y}>{y} Cutoff</th>
              ))}
              <th onClick={() => handleSort('cutoff')}>
                Latest Cutoff <SortIcon field="cutoff" />
              </th>
              <th onClick={() => handleSort('probability')}>
                Probability <SortIcon field="probability" />
              </th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={`${r.collegeCode}-${r.branchCode}-${i}`}>
                <td style={{ fontWeight: 600, maxWidth: '250px', whiteSpace: 'normal' }}>{r.collegeName}</td>
                <td style={{ maxWidth: '180px', whiteSpace: 'normal', fontSize: '13px' }}>{r.branchName}</td>
                <td>{r.city}</td>
                {studentInfo.years && studentInfo.years.map(y => (
                  <td key={y}>
                    {r.cutoffsByYear[y] !== null && r.cutoffsByYear[y] !== undefined
                      ? r.cutoffsByYear[y].toLocaleString()
                      : '—'}
                  </td>
                ))}
                <td style={{ fontWeight: 600 }}>
                  {r.latestCutoff ? r.latestCutoff.toLocaleString() : '—'}
                </td>
                <td>
                  <span
                    className={`badge badge-${r.probCategory === 'highly-likely' ? 'success' : r.probCategory === 'likely' ? 'info' : r.probCategory === 'possible' ? 'warning' : 'danger'}`}
                  >
                    {r.probability !== null ? `${r.probability}%` : 'N/A'}
                  </span>
                </td>
                <td style={{ fontSize: '12px' }}>
                  {r.trend?.icon} {r.trend?.label || '—'}
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum
            if (totalPages <= 7) {
              pageNum = i + 1
            } else if (page <= 4) {
              pageNum = i + 1
            } else if (page >= totalPages - 3) {
              pageNum = totalPages - 6 + i
            } else {
              pageNum = page - 3 + i
            }
            return (
              <button
                key={pageNum}
                className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            )
          })}
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
        Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} results
      </div>
    </motion.div>
  )
}

export default CollegeTable
