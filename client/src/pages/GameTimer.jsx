import React from 'react';
export default function GameTimer({ gameTimeLeft }) {
  const totalSec = Math.ceil(gameTimeLeft / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const timeStr = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  return (
    <div style={{
      position: 'fixed',
      top: 18,
      right: 32,
      zIndex: 99999,
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 16,
      boxShadow: '0 2px 8px #bbb',
      padding: '8px 22px',
      fontWeight: 700,
      fontSize: 22,
      color: '#333',
      letterSpacing: 2,
      border: '2px solid #4caf50',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }}>
      <span role="img" aria-label="timer">⏳</span> {timeStr}
    </div>
  );
}