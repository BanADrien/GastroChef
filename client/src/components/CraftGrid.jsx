import React from 'react'
import SmartImg from './SmartImg'

export default function CraftGrid({ pattern, onChange, inventory = [], ingredients = [] }) {
  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e, idx) => {
    e.preventDefault()
    const ingredientKey = e.dataTransfer.getData('ingredientKey')
    if (!ingredientKey) return
    // Check if ingredient is in inventory
    const inv = inventory.find(i => i.key === ingredientKey)
    if (!inv || inv.count < 1) {
      alert("Vous n'avez pas cet ingrédient !")
      return
    }
    // Only allow one of each ingredient per slot
    const p = [...pattern]
    p[idx] = ingredientKey
    onChange(p)
  }

  const handleClear = (idx) => {
    const p = [...pattern]
    p[idx] = null
    onChange(p)
  }

  const findIngredient = (key) => ingredients.find(i => i.key === key)
  const getInventoryCount = (key) => {
    const inv = inventory.find(i => i.key === key)
    return inv ? inv.count : 0
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3,90px)',
      gap: 8,
      position: 'relative',
      background: '#f5f7fa',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      padding: 16,
      minWidth: 300,
      minHeight: 200
    }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const key = pattern[i]
        const ing = key ? findIngredient(key) : null
        return (
          <div
            key={i}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, i)}
            style={{
              width: 90,
              height: 90,
              border: '1.5px solid #b0b0b0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: key ? '#eef7ee' : '#fff',
              borderRadius: 10,
              boxShadow: key ? '0 1px 4px #cde8c9' : 'none',
              overflow: 'visible'
            }}
          >
            {key ? (
              <>
                {/* Small clear cross at top left */}
                <button
                  onClick={() => handleClear(i)}
                  aria-label="Retirer l'ingrédient"
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    width: 18,
                    height: 18,
                    border: 'none',
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: '50%',
                    color: '#c00',
                    fontWeight: 'bold',
                    fontSize: 13,
                    cursor: 'pointer',
                    lineHeight: '16px',
                    padding: 0,
                    zIndex: 2,
                    boxShadow: '0 1px 2px #eee'
                  }}
                  tabIndex={0}
                >
                  ×
                </button>
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <SmartImg srcs={[`/images/ingredients/${key}.png`]} alt={ing?.name || key} style={{ width: 44, height: 44, objectFit: 'contain', display: 'block', margin: '0 auto 4px' }} />
                  <div style={{ fontSize: 11 }}>{ing?.name || key}</div>
                  <div style={{ fontSize: 9, color: '#666' }}>({getInventoryCount(key)})</div>
                </div>
              </>
            ) : (
              <div style={{ color: '#bbb', fontSize: 13, fontStyle: 'italic' }}>Drop</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
