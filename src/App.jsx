import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import AdminPage from './pages/AdminPage'
import CollegeDetailsPage from './pages/CollegeDetailsPage'

import { FaWhatsapp } from 'react-icons/fa'

function App() {
  return (
    <Router>
      <Header />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/college" element={<CollegeDetailsPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      
      {/* Global Personal Assistance Button */}
      <div className="fab-container">
        <div className="fab-text">Need Expert Guidance? Connect with us!</div>
        <a 
          href="https://wa.me/919380095587" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fab-button"
        >
          <FaWhatsapp />
        </a>
      </div>
    </Router>
  )
}

export default App
