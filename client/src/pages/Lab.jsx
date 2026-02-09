import React, { useState, useEffect } from 'react'
import CraftGrid from '../components/CraftGrid'
import axios from 'axios'

export default function Lab(){
  const [pattern,setPattern] = useState(Array(9).fill(null))
  const [recipes,setRecipes] = useState([])

  useEffect(()=>{ axios.get('http://localhost:4000/lab/recipes').then(r=>setRecipes(r.data)) },[])

  const tryDiscover = async ()=>{
    const r = await axios.post('http://localhost:4000/lab/discover',{ pattern })
    if (r.data.success) {
      alert('Recipe found: '+r.data.recipe.name)
    } else alert('No match — ingredients destroyed')
  }

  return (
    <div style={{padding:20}}>
      <h2>Laboratory</h2>
      <div style={{display:'flex',gap:20}}>
        <div>
          <CraftGrid pattern={pattern} onChange={setPattern} />
          <div style={{marginTop:10}}><button onClick={tryDiscover}>Try Discover</button></div>
        </div>
        <div>
          <h3>Known recipes</h3>
          <ul>{recipes.map(r=>(<li key={r._id}>{r.name}</li>))}</ul>
        </div>
      </div>
    </div>
  )
}
