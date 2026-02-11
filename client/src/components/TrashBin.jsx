import React from 'react'
import SmartImg from './SmartImg'

// props: onDrop, onClick
export default function TrashBin({ onDrop, onClick, decorMode }) {
  const handleDragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const handleDrop = e => {
    e.preventDefault()
    const ingredientKey = e.dataTransfer.getData('ingredientKey')
    const dishKey = e.dataTransfer.getData('dishKey')
    console.log('TrashBin drop - ingredient:', ingredientKey, 'dish:', dishKey)
    if (ingredientKey) onDrop && onDrop('ingredient', ingredientKey)
    if (dishKey) onDrop && onDrop('dish', dishKey)
  }
  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onClick}
      style={{
        position: decorMode ? 'relative' : 'fixed',
        right: decorMode ? 'auto' : '6vw',
        bottom: decorMode ? 'auto' : 0,
        zIndex: decorMode ? 'auto' : 1002,
        width: decorMode ? 90 : 180,
        height: decorMode ? 90 : 180,
        background: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'none',
      }}
      title="Clique ou glisse ici pour jeter"
    >
      <SmartImg srcs={["/images/decors/poubelle.png"]} alt="Poubelle" style={{ width: decorMode ? 85 : 170, height: decorMode ? 85 : 170 }} />
    </div>
  )
}
