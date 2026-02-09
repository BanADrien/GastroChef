import React from 'react'
import SmartImg from './SmartImg'

export default function CraftGrid({ pattern, onChange, ingredients=[] }){
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e, idx) => {
    e.preventDefault()
    const ingredientKey = e.dataTransfer.getData('ingredientKey')
    if (!ingredientKey) return
    const p = [...pattern]
    p[idx] = ingredientKey
    onChange(p)
  }

  const handleClear = (idx) => {
    const p = [...pattern]
    p[idx] = null
    onChange(p)
  }

  const findIngredient = (key) => ingredients.find(i=> i.key === key)

  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,90px)',gap:8}}>
      {Array.from({length:9}).map((_,i)=>{
        const key = pattern[i]
        const ing = key ? findIngredient(key) : null
        return (
          <div key={i}
            onDragOver={handleDragOver}
            onDrop={(e)=>handleDrop(e,i)}
            style={{width:90,height:90,border:'1px solid #ccc',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',background: key ? '#eef7ee' : '#fff'}}
          >
            {key ? (
              <div style={{textAlign:'center'}}>
                <SmartImg srcs={[`/images/ingredients/${key}.png`]} alt={ing?.name||key} style={{width:44,height:44,objectFit:'contain',display:'block',margin:'0 auto 4px'}} />
                <div style={{fontSize:11}}>{ing?.name || key}</div>
                <button onClick={()=>handleClear(i)} style={{position:'absolute',top:4,right:4,fontSize:10}}>x</button>
              </div>
            ) : (
              <div style={{color:'#999',fontSize:12}}>Drop</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
