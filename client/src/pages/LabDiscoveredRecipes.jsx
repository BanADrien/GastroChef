import SmartImg from '../components/SmartImg';
// Colonne de gauche : recettes découvertes
export default function LabDiscoveredRecipes({ foundRecipes, inventory, setPattern }) {
  return (
    <div style={{ minWidth: 60, marginRight: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      {foundRecipes.length === 0 ? null : (
        foundRecipes.map(r => {
          const missing = r.pattern.some(key => key && !inventory.some(inv => inv.key === key && inv.count > 0));
          return (
            <div
              key={r._id}
              style={{
                cursor: missing ? 'not-allowed' : 'pointer',
                borderRadius: 10,
                padding: 2,
                transition: 'background 0.2s',
                opacity: missing ? 0.45 : 1,
                filter: missing ? 'grayscale(0.7)' : 'none',
                pointerEvents: missing ? 'none' : 'auto',
              }}
              onClick={() => {
                if (!missing) setPattern(Array(6).fill(null).map((_, i) => r.pattern[i] || null));
              }}
              tabIndex={0}
              title={r.name}
            >
              <SmartImg
                srcs={r.image ? [`/images/plats/${r.image}`] : [`/images/plats/${encodeURIComponent(r.name)}.png`, `/images/plats/${r.key}.png`]}
                alt={r.name}
                style={{ width: 44, height: 38, borderRadius: 8, background: '#f9f9f9', boxShadow: '0 1px 4px #e0e0e0' }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
