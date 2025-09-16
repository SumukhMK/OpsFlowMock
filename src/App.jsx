import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from 'grommet'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Projects from './pages/Projects.jsx'
import Analyze from './pages/Analyze.jsx'
import Architectures from './pages/Architectures.jsx'
import Staffing from './pages/Staffing.jsx'

export default function App() {
  return (
    <Box fill>
      <Nav />
      <Box pad={{ horizontal: 'medium', bottom: 'medium' }} flex overflow={{ vertical: 'auto', horizontal: 'auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/architectures" element={<Architectures />} />
          <Route path="/staffing" element={<Staffing />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}
