import React from 'react';

export default function LabVictoryOverlay({ show, onRestart, onMenu, satisfaction, coins, stars = 0 }) {
  if (!show) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #388e3c 0%, #1b5e20 100%)',
        borderRadius: 24,
        padding: '48px 64px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: 500,
        border: '3px solid #66bb6a'
      }}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 16px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>Victoire !</h1>
        
        <p style={{
          fontSize: 18,
          color: '#c8e6c9',
          margin: '0 0 24px 0',
          lineHeight: 1.6
        }}>
          Félicitations ! Vous avez survécu aux 5 minutes !<br/>
          Votre restaurant est un succès !
        </p>
        
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 12,
          padding: '16px 24px',
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: 14, color: '#c8e6c9', marginBottom: 4 }}>Satisfaction</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{satisfaction}</div>
          </div>
          <div style={{ width: 2, background: 'rgba(255,255,255,0.3)', height: 60 }}></div>
          <div>
            <div style={{ fontSize: 14, color: '#c8e6c9', marginBottom: 4 }}>Pièces</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#ffd700' }}>💰 {coins}</div>
          </div>
          <div style={{ width: 2, background: 'rgba(255,255,255,0.3)', height: 60 }}></div>
          <div>
            <div style={{ fontSize: 14, color: '#c8e6c9', marginBottom: 4 }}>Étoiles</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#FFD700' }}>{'⭐'.repeat(Math.max(0, stars))} {stars}</div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center'
        }}>
          <button
            onClick={onRestart}
            style={{
              padding: '14px 32px',
              fontSize: 16,
              fontWeight: 700,
              background: '#fff',
              color: '#388e3c',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Rejouer
          </button>
          
          <button
            onClick={onMenu}
            style={{
              padding: '14px 32px',
              fontSize: 16,
              fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Menu principal
          </button>
        </div>
      </div>
    </div>
  );
}
