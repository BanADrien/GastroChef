import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [restaurantName,setRestaurantName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  const submit = async e=>{
    e.preventDefault()
    try {
      await axios.post('http://localhost:4000/auth/register',{ restaurantName, email, password })
      // Auto login after register
      const loginR = await axios.post('http://localhost:4000/auth/login',{ email, password })
      console.log('Login response:', loginR.data)
      if (loginR.data.userId) {
        localStorage.setItem('token', loginR.data.token)
        localStorage.setItem('userId', loginR.data.userId)
        console.log('Stored userId:', localStorage.getItem('userId'))
        nav('/lab')
      } else {
        alert('Error: userId not received from server')
      }
    } catch(err) {
      console.error('Error:', err)
      alert(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Restaurant name" value={restaurantName} onChange={e=>setRestaurantName(e.target.value)} /></div>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
