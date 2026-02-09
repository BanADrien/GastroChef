import React from 'react'
import SmartImg from './SmartImg'

export default function IngredientList({ ingredients=[] }){
  const handleDragStart = (e, key) => {
    e.dataTransfer.setData('ingredientKey', key)
    e.dataTransfer.effectAllowed = 'copy'
  }

  if (!ingredients || ingredients.length === 0) {
    return (
      <div style={{textAlign:'center',color:'#999',padding:16,background:'#f9f9f9',borderRadius:6}}>
        Chargement des ingrédients...
      </div>
    )
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {ingredients.map((ing,idx)=> (
        <div key={ing._id || idx} draggable onDragStart={(e)=>handleDragStart(e,ing.key)} style={{display:'flex',alignItems:'center',gap:8,padding:8,border:'1px solid #ddd',borderRadius:6,background:'#fff',cursor:'grab',minHeight:48}}>
          <SmartImg srcs={[`/images/ingredients/${ing.key}.png`]} alt={ing.name} style={{width:36,height:36}} />
          <div style={{fontSize:14,flex:1,fontWeight:500}}>{ing.name}</div>
          <div style={{fontSize:12,color:'#999'}}>{ing.price} 💰</div>
        </div>
      ))}
    </div>
  )
}
