import React from 'react';
// Ajoute le fond pixel-art et la structure visuelle principale
// children attend un objet { left, center, right }
export default function LabMainLayout({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'url(/images/decors/fond.png) center/cover no-repeat, #fff',
      }}
    >
      {/* Recettes découvertes à gauche de la planche */}
      {children.left && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '2vw',
          transform: 'translateY(-50%)',
          zIndex: 800,
        }}>
          {children.left}
        </div>
      )}
      {/* Planche (grille) à gauche */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '5vw',
        transform: 'translateY(-50%)',
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {children.center}
      </div>
      {/* Commandes au centre */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 240,
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        background: 'none',
        boxShadow: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
      }}>
        {children.right && children.right[0]}
      </div>
      {/* Inventaire à droite */}
      {children.right && children.right[1] && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '5vw',
          transform: 'translateY(-50%)',
          minWidth: 240,
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          background: 'none',
          boxShadow: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
        }}>
          {children.right[1]}
        </div>
      )}
    </div>
  );
}