import React from 'react';

export default function LabDefeatOverlay({ show, onRestart, onMenu }) {
  // Overlay défaite
  return show ? <div>Défaite</div> : null;
}
