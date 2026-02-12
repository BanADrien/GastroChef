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

  useEffect(() => {
    // Vérifie s'il y a une partie sauvegardée (ex: userId/localStorage)
    setHasSave(!!localStorage.getItem('userId'));
  }, []);

  function handleContinue() {
    if (hasSave) nav('/lab');
  }

  async function handleNewGame(levelIdx) {
    localStorage.setItem('difficulty', JSON.stringify(LEVELS[levelIdx].settings));
    const userId = localStorage.getItem('userId');
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
      } catch (e) { /* ignore erreur pour éviter blocage */ }
    }
    nav('/lab');
  }

  return (
    <div className="main-menu-bg">
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
