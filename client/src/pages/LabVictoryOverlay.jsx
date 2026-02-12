import React from 'react';

export default function LabVictoryOverlay({ show, onRestart, onMenu, satisfaction, coins }) {
  // Overlay victoire
  return show ? <div>Victoire</div> : null;
}
