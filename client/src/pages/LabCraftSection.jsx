import CraftGrid from '../components/CraftGrid';
import SmartImg from '../components/SmartImg';
// Section centrale : CraftGrid + bouton préparer
export default function LabCraftSection({ pattern, setPattern, inventory, tryDiscover }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: '60px', marginLeft: '32px' }}>
      <CraftGrid
        pattern={pattern}
        onChange={setPattern}
        inventory={inventory}
        ingredients={inventory.map(inv => ({
          key: inv.key,
          name: inv.key,
          count: inv.count
        }))}
      />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 28, width: '100%' }}>
        <button
          onClick={tryDiscover}
          style={{
            background: 'none',
            border: 'none',
            borderRadius: 16,
            boxShadow: 'none',
            padding: 0,
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            backgroundColor: 'transparent'
          }}
          aria-label="Cuisiner"
        >
          <SmartImg srcs={['/images/object/pr%C3%A9parer.png']} alt='Créer le plat' style={{ width: 48, height: 48 }} />
        </button>
      </div>
    </div>
  );
}
