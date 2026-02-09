import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Lab from './pages/Lab'
import Marketplace from './pages/Marketplace'
import RecipeBook from './pages/RecipeBook'

function App(){
  return (
    <BrowserRouter>
      <nav style={{padding:10}}>
        <Link to="/">Login</Link> | <Link to="/lab">Lab</Link> | <Link to="/market">Market</Link> | <Link to="/book">Book</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/lab" element={<Lab/>} />
        <Route path="/market" element={<Marketplace/>} />
        <Route path="/book" element={<RecipeBook/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
