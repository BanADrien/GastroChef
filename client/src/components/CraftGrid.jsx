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
      background: 'none',
      borderRadius: 16,
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
              background: '#a97c50',
              borderRadius: 10,
              boxShadow: 'none',
              overflow: 'visible'
            }}
          >
            {key ? (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <SmartImg srcs={[`/images/ingredients/${key}.png`]} alt={ing?.name || key} style={{ width: 44, height: 44, objectFit: 'contain', display: 'block', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 11 }}>{ing?.name || key}</div>
                <div style={{ fontSize: 9, color: '#666' }}>({getInventoryCount(key)})</div>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
