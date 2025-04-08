import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../src/pages/Login'
import PasienList from '../src/pages/PasienList'

const App = () => {
  const token = localStorage.getItem('token')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/pasien"
          element={
            token ? <PasienList /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  )
}

export default App
