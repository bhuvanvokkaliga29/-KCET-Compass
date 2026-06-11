import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="logo" style={{ marginBottom: '8px', display: 'inline-flex' }}>
              <span>KCET Compass</span>
            </Link>
            <p className="footer-brand-desc">
              The most advanced KCET engineering college prediction platform. Analyze 3 years of cutoff data and discover your best admission opportunities instantly.
            </p>
          </div>
          
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">College Predictor</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="https://cetonline.karnataka.gov.in" target="_blank" rel="noopener noreferrer">KEA Official</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} KCET Compass. Built for Karnataka Engineering Aspirants.</p>
          <p style={{ marginTop: '4px', fontSize: '12px' }}>
            Disclaimer: Cutoff data is based on publicly available information. Actual admission depends on official KEA counselling.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
