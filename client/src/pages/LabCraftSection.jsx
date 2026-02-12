import CraftGrid from '../components/CraftGrid';
import SmartImg from '../components/SmartImg';
// Section centrale : CraftGrid + bouton préparer
export default function LabCraftSection({ pattern, setPattern, inventory, tryDiscover }) {
  return (
    <div style={{ 
      flex: 1, 
      minWidth: 0, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'flex-start', 
      marginTop: '0px', 
      marginLeft: '-200px',
      backgroundImage: 'url(/images/decors/planche.png)',
      backgroundSize: '600px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      padding: '80px 20px 20px 20px',
      width: '700px',
      height: '950px',
      gap: 0,
      overflow: 'visible'
    }}>
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: -30, width: '100%' }}>
        <button
          onClick={tryDiscover}
          style={{
            background: 'none',
            border: 'none',
            borderRadius: 16,
            boxShadow: 'none',
            padding: 0,
            width: 100,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            backgroundColor: 'transparent'
          }}
          aria-label="Cuisiner"
        >
          <SmartImg srcs={['/images/object/pr%C3%A9parer.png']} alt='Créer le plat' style={{ width: 80, height: 80 }} />
        </button>
      </div>
    </div>
  );
}
