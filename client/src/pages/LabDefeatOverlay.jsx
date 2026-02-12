import React from 'react';

export default function LabDefeatOverlay({ show, onRestart, onMenu }) {
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
        background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
        borderRadius: 24,
        padding: '48px 64px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: 500,
        border: '3px solid #ff5252'
      }}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 16px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>Défaite !</h1>
        
        <p style={{
          fontSize: 18,
          color: '#ffcdd2',
          margin: '0 0 32px 0',
          lineHeight: 1.6
        }}>
          Votre restaurant a reçu trop d'avis négatifs.<br/>
          Les clients ne sont pas satisfaits !
        </p>
        
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
              color: '#d32f2f',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Réessayer
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
