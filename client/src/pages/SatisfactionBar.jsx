import React from 'react';
export default function SatisfactionBar({ satisfaction }) {
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: '4vh',
      zIndex: 9999,
      width: 340,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }}>
      <span style={{ fontSize: 28 }} role="img" aria-label="pas content">😡</span>
      <div style={{ display: 'flex', flex: 1, height: 22, background: '#eee', borderRadius: 12, overflow: 'hidden', border: '2px solid #bbb', position: 'relative' }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const percent = i / 19;
          let color = '#f44336';
          if (percent > 0.85) color = '#4caf50';
          else if (percent > 0.6) color = '#ffeb3b';
          else if (percent > 0.3) color = '#ff9800';
          return <div key={i} style={{
            flex: 1,
            height: '100%',
            background: i < satisfaction ? color : 'transparent',
            transition: 'background 0.4s',
            borderTopLeftRadius: i === 0 ? 10 : 0,
            borderBottomLeftRadius: i === 0 ? 10 : 0,
            borderTopRightRadius: i === 19 ? 10 : 0,
            borderBottomRightRadius: i === 19 ? 10 : 0,
            marginRight: i !== 19 ? 1 : 0
          }} />;
        })}
      </div>
      <span style={{ fontSize: 28 }} role="img" aria-label="content">😃</span>
    </div>
  );
}