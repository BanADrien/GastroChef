import React from 'react'

export default function CraftGrid({ pattern, onChange }){
  const handleClick = (idx) => {
    const key = prompt('Ingredient key (e.g. tomato) or leave empty to clear')
    const p = [...pattern]
    p[idx] = key || null
    onChange(p)
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,80px)',gap:8}}>
      {Array.from({length:9}).map((_,i)=> (
        <div key={i} onClick={()=>handleClick(i)} style={{width:80,height:80,border:'1px solid #333',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          {pattern[i] || '-'}
        </div>
      ))}
    </div>
  )
}
