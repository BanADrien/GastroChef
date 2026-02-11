import React from 'react'
import SmartImg from './SmartImg'

// props: onDrop, onClick
export default function TrashBin({ onDrop, onClick }) {
  const handleDragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const handleDrop = e => {
    e.preventDefault()
    const ingredientKey = e.dataTransfer.getData('ingredientKey')
    const dishKey = e.dataTransfer.getData('dishKey')
    if (ingredientKey) onDrop && onDrop({ type: 'ingredient', key: ingredientKey })
    if (dishKey) onDrop && onDrop({ type: 'dish', key: dishKey })
  }
  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onClick}
      style={{
        position: 'fixed',
        right: '6vw',
        bottom: 0,
        zIndex: 1002,
        width: 180,
        height: 180,
        background: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'none',
      }}
      title="Clique ou glisse ici pour jeter"
    >
      <SmartImg srcs={["/images/decors/poubelle.png"]} alt="Poubelle" style={{ width: 170, height: 170 }} />
    </div>
  )
}
