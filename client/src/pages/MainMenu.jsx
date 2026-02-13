import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css';

const LEVELS = [
  {
    label: 'Niveau 1',
    settings: { orderSpeed: 1, dishExpire: 1, satisfactionGain: 3, satisfactionLoss: 6 }
  },
  {
    label: 'Niveau 2',
    settings: { orderSpeed: 1.2, dishExpire: 1.1, satisfactionGain: 3, satisfactionLoss: 7 }
  },
  {
    label: 'Niveau 3',
    settings: { orderSpeed: 1.5, dishExpire: 1.3, satisfactionGain: 2, satisfactionLoss: 8 }
  },
  {
    label: 'Niveau 4',
    settings: { orderSpeed: 1.8, dishExpire: 1.5, satisfactionGain: 2, satisfactionLoss: 9 }
  },
  {
    label: 'Niveau 5',
    settings: { orderSpeed: 2, dishExpire: 1.7, satisfactionGain: 1, satisfactionLoss: 10 }
  }
];

export default function MainMenu() {
  const nav = useNavigate();
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [welcome, setWelcome] = useState('');

  useEffect(() => {
    // Vérifie s'il y a une partie en cours (userId existe et partie non terminée)
    const hasUserId = !!localStorage.getItem('userId');
    const gameEnded = localStorage.getItem('gameEnded') === 'true';
    setHasSave(hasUserId && !gameEnded);
    // Affiche le message de bienvenue si connecté
    const restaurantName = localStorage.getItem('restaurantName');
    if (restaurantName) {
      setWelcome(`Bonjour chef du ${restaurantName}`);
    } else {
      setWelcome('');
    }
  }, []);

  function handleContinue() {
    if (hasSave) nav('/lab');
  }

  async function handleNewGame(levelIdx) {
    localStorage.setItem('difficulty', JSON.stringify(LEVELS[levelIdx].settings));
    localStorage.removeItem('gameEnded');
    localStorage.removeItem('savedDishes');
    const userId = localStorage.getItem('userId');
    // Définir le nombre de pièces de départ selon le niveau
    const coinsByLevel = [15, 13, 10, 8, 5];
    const startCoins = coinsByLevel[levelIdx] || 10;
    if (userId) {
      try {
        await fetch('http://localhost:4000/lab/reset-satisfaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        await fetch('http://localhost:4000/lab/clear-inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        await fetch('http://localhost:4000/lab/reset-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        // Mettre à jour les pièces de départ
        await fetch('http://localhost:4000/lab/update-coins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, coins: startCoins })
        });
      } catch (e) { /* ignore erreur pour éviter blocage */ }
    }
    nav('/lab');
  }

  return (
    <div className="main-menu-bg">
      {welcome && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          margin: '0 auto',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#4CAF50',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '0 0 18px 18px',
          padding: '18px 0',
          zIndex: 1000
        }}>{welcome}</div>
      )}
      <div className="main-menu-panel">
        <h1>GastroChef</h1>
        <button onClick={() => nav('/login')}>Login</button>
        <button onClick={handleContinue} disabled={!hasSave}>Continuer</button>
        <button onClick={() => setShowLevelSelect(true)}>Nouvelle Partie</button>
        {showLevelSelect && (
          <div className="level-select-modal">
            <h2>Choisir la difficulté</h2>
            {LEVELS.map((lvl, i) => (
              <button key={i} onClick={() => handleNewGame(i)}>{lvl.label}</button>
            ))}
            <button onClick={() => setShowLevelSelect(false)}>Annuler</button>
          </div>
        )}
      </div>
    </div>
  );
}
