import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import MainMenu from './pages/MainMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Lab from './pages/Lab';
import Marketplace from './pages/Marketplace';
import RecipeBook from './pages/RecipeBook';


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
  return (
    <BrowserRouter>
      <ProfileButton />
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/market" element={<Marketplace />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
