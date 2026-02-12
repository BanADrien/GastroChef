import React, { useEffect } from 'react';

export default function Notification({ message, type = 'info', onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  let bgColor = '#333';
  if (type === 'success') bgColor = '#4caf50';
  else if (type === 'error') bgColor = '#f44336';
  else if (type === 'warning') bgColor = '#ff9800';

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: 40,
      transform: 'translateX(-50%)',
      background: bgColor,
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 16,
      boxShadow: '0 4px 24px #2228',
      fontSize: 20,
      zIndex: 100000,
      minWidth: 220,
      textAlign: 'center',
      opacity: 0.95,
      animation: 'notif-pop 0.4s cubic-bezier(.68,-0.55,.27,1.55)'
    }}>
      {message}
      <style>{`
        @keyframes notif-pop {
          0% { transform: translateX(-50%) translateY(40px) scale(0.8); opacity: 0; }
          80% { transform: translateX(-50%) translateY(-8px) scale(1.05); opacity: 1; }
          100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
