import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  const submit = async e=>{
    e.preventDefault()
    try{
      const r = await axios.post('http://localhost:4000/auth/login',{ email, password })
      console.log('Login response:', r.data)
      if (r.data.userId) {
        localStorage.setItem('token', r.data.token)
        localStorage.setItem('userId', r.data.userId)
        console.log('Stored userId:', localStorage.getItem('userId'))
        nav('/lab')
      } else {
        alert('Error: userId not received from server')
      }
    }catch(err){
      console.error('Login error:', err)
      alert('login failed')
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Login</button>
      </form>
      <p>Or <Link to="/register">register</Link></p>
    </div>
  )
}
