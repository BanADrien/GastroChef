import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const r = await axios.post('http://localhost:4000/auth/login', { email, password });
      if (r.data.userId) {
        localStorage.setItem('token', r.data.token);
        localStorage.setItem('userId', r.data.userId);
        // Récupérer le nom du restaurant
        if (r.data.userId) {
          try {
            const userRes = await axios.get('http://localhost:4000/auth/user/' + r.data.userId);
            if (userRes.data && userRes.data.restaurantName) {
              localStorage.setItem('restaurantName', userRes.data.restaurantName);
            }
          } catch {}
        }
        nav('/');
      } else {
        alert('Error: userId not received from server');
      }
    } catch (err) {
      alert('login failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-panel">
        <img src="/images/decors/register.png" alt="register" className="login-bg-img" />
        <div className="login-content">
          <h2>Connexion</h2>
          <form onSubmit={submit}>
            <div className="login-field">
              <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
            </div>
            <div className="login-field">
              <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="login-btn">Se connecter</button>
          </form>
          <p className="login-register-link">Pas de compte ? <Link to="/register">Créer un compte</Link></p>
        </div>
      </div>
    </div>
  );
}
