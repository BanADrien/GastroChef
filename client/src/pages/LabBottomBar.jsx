import SmartImg from '../components/SmartImg';
import TrashBin from '../components/TrashBin';
// Barre inférieure : livre de recettes + poubelle
export default function LabBottomBar({ onRecipeBookOpen, onTrashDrop }) {
  return (
    <div style={{
      position: 'fixed',
      left: '3vw',
      bottom: '2vh',
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      zIndex: 3000
    }}>
      <button
        onClick={onRecipeBookOpen}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '3px solid #8B4513',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          zIndex: 3000
        }}
        title="Livre de recettes"
      >
        <SmartImg srcs={['/images/object/livre.png']} alt='Livre de recettes' style={{ width: 60, height: 60 }} />
      </button>
      <TrashBin
        onDrop={onTrashDrop}
        onClick={() => {}}
        decorMode
      />
    </div>
  );
}
