import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Lab from './pages/Lab'
import Marketplace from './pages/Marketplace'
import RecipeBook from './pages/RecipeBook'

function FloatingBookButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1001,
        background: '#fff',
        border: '2px solid #4CAF50',
        borderRadius: '50%',
        width: 64,
        height: 64,
        boxShadow: '0 2px 12px #b2e7b2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
      }}
      aria-label="Ouvrir le livre de recettes"
    >
      <img src="/images/object/livre.png" alt="Livre de recettes" style={{ width: 44, height: 44, objectFit: 'contain', pointerEvents: 'none' }} />
    </button>
  )
}

function ProfileButton() {
  return (
    <div style={{ position: 'fixed', top: 18, left: 18, zIndex: 1003 }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button style={{
          background: '#fff',
          border: '2px solid #4CAF50',
          borderRadius: '50%',
          width: 54,
          height: 54,
          boxShadow: '0 2px 12px #b2e7b2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}>
          <img src="/images/object/profile.png" alt="Profil" style={{ width: 36, height: 36, objectFit: 'contain', pointerEvents: 'none' }} />
        </button>
      </Link>
    </div>
  )
}

function App() {
  const [showBook, setShowBook] = useState(false)
  return (
    <BrowserRouter>
      <ProfileButton />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/market" element={<Marketplace />} />
      </Routes>
      <FloatingBookButton onClick={() => setShowBook(true)} />
      {showBook && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ position: 'relative', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #b2e7b2', maxWidth: 1000, width: '90vw', maxHeight: '90vh', overflowY: 'auto', padding: 32 }}>
            <button onClick={() => setShowBook(false)} style={{ position: 'absolute', top: 12, right: 16, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#c00', fontWeight: 'bold' }}>×</button>
            <RecipeBook modalMode />
          </div>
        </div>
      )}
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
