import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import ResultPage from './pages/ResultPage'
import ApplyPage from './pages/ApplyPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<IntroPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/apply"  element={<ApplyPage />} />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  )
}
