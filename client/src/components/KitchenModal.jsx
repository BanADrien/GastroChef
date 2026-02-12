import React from 'react'

export default function KitchenModal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.35)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 8px 32px #b2e7b2',
        maxWidth: 900,
        width: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 32,
        position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#c00', fontWeight: 'bold' }}>×</button>
        {children}
      </div>
    </div>
  )
}
