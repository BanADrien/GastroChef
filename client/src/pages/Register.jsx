import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/auth/register', { restaurantName, email, password });
      // Auto login after register
      const loginR = await axios.post('http://localhost:4000/auth/login', { email, password });
      if (loginR.data.userId) {
        localStorage.setItem('token', loginR.data.token);
        localStorage.setItem('userId', loginR.data.userId);
        nav('/lab');
      } else {
        alert('Error: userId not received from server');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-bg">
      <div className="register-panel">
        <img src="/images/decors/register.png" alt="register" className="register-bg-img" />
        <div className="register-content">
          <h2>Créer un compte</h2>
          <form onSubmit={submit}>
            <div className="register-field">
              <input placeholder="Nom du restaurant" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} required />
            </div>
            <div className="register-field">
              <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
            </div>
            <div className="register-field">
              <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="register-btn">Créer le compte</button>
          </form>
        </div>
      </div>
    </div>
  );
}
