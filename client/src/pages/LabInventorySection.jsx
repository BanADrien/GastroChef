import SmartImg from '../components/SmartImg';
import Shop from '../components/Shop';
import DishStorage from '../components/DishStorage';
// Colonne de droite : plats préparés + inventaire
export default function LabInventorySection({ inventory, coins, setShopOpen, shopOpen, onBuy, dishes, handleDishDrop, handleDishRemove }) {
  return (
    <div style={{
      position: 'absolute',
      right: '3vw',
      top: '10vh',
      zIndex: 900,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      minWidth: 240,
      maxWidth: 320
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        boxShadow: '0 4px 24px #bbb',
        padding: 18,
      }}>
        <h3 style={{ marginBottom: 8, textAlign: 'center' }}>Plats préparés</h3>
        <DishStorage dishes={dishes} onDrop={handleDishDrop} onRemove={handleDishRemove} />
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        boxShadow: '0 4px 24px #bbb',
        padding: 18,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0 }}>Mon Inventaire</h3>
            <SmartImg srcs={['/images/object/piece.png']} style={{ width: 24, height: 24 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>{coins}</span>
          </div>
          <button
            onClick={() => setShopOpen(true)}
            style={{
              padding: '6px 12px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <SmartImg srcs={['/images/object/achat.png']} style={{ width: 16, height: 16 }} />
            Boutique
          </button>
        </div>
        {inventory.length === 0 ? (
          <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>Aucun ingrédient</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {inventory.map((inv, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('ingredientKey', inv.key);
                  e.dataTransfer.effectAllowed = 'copyMove';
                }}
                style={{
                  position: 'relative',
                  border: '2px solid #ddd',
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'grab',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8
                }}
              >
                <SmartImg srcs={[`/images/ingredients/${inv.key}.png`]} alt={inv.key} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <div style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  fontSize: 11,
                  fontWeight: 'bold',
                  background: 'rgba(76, 175, 80, 0.9)',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}>
                  {inv.count}x
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Shop isOpen={shopOpen} onClose={() => setShopOpen(false)} onBuy={onBuy} />
    </div>
  );
}
