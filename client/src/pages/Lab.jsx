import React, { useState, useEffect } from 'react'
import CraftGrid from '../components/CraftGrid'
import IngredientList from '../components/IngredientList'
import Shop from '../components/Shop'
import SmartImg from '../components/SmartImg'
import axios from 'axios'

export default function Lab(){
  const [pattern,setPattern] = useState(Array(9).fill(null))
  const [recipes,setRecipes] = useState([])
  const [ingredients,setIngredients] = useState([])
  const [coins, setCoins] = useState(1000) // default for testing
  const [shopOpen, setShopOpen] = useState(false)
  const userId = 'test-user' // simplified: should come from auth

  useEffect(()=>{
    axios.get('http://localhost:4000/lab/recipes').then(r=>setRecipes(r.data))
    axios.get('http://localhost:4000/lab/ingredients').then(r=>setIngredients(r.data))
  },[])

  const tryDiscover = async ()=>{
    const r = await axios.post('http://localhost:4000/lab/discover',{ pattern, userId })
    if (r.data.success) {
      alert('Recipe found: '+r.data.recipe.name)
      // simple visual reset: clear pattern after success
      setPattern(Array(9).fill(null))
    } else {
      alert('No match — ingredients destroyed')
      setPattern(Array(9).fill(null))
    }
  }

  const handleBuySuccess = (ingredientKey) => {
    // Update coins displayed after purchase
    // In a real app, would fetch from server or receive via socket
    setCoins(prev => prev - (ingredients.find(i=>i.key===ingredientKey)?.price || 0))
  }

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h2>Laboratory</h2>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,fontSize:18,fontWeight:'bold'}}>
            <SmartImg srcs={['/images/object/piece.png']} style={{width:32,height:32}} />
            <div>{coins}</div>
          </div>
          <button onClick={()=>setShopOpen(true)} style={{padding:'8px 16px',background:'#FF6B6B',color:'#fff',border:'none',borderRadius:4,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
            <SmartImg srcs={['/images/object/achat.png']} style={{width:24,height:24}} />
            Shop
          </button>
        </div>
      </div>

      <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
        <div>
          <CraftGrid pattern={pattern} onChange={setPattern} ingredients={ingredients} />
          <div style={{marginTop:10,display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={()=>setPattern(Array(9).fill(null))} style={{padding:'8px 16px',background:'#999',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}}>
              Clear
            </button>
            <button onClick={tryDiscover} style={{padding:0,border:'none',background:'transparent',cursor:'pointer',width:64,height:64}}>
              <SmartImg srcs={['/images/object/pr%C3%A9parer.png']} alt='Créer le plat' style={{width:64,height:64}} />
            </button>
          </div>
        </div>
        <div style={{minWidth:260}}>
          <h3>Ingredients</h3>
          <IngredientList ingredients={ingredients} />
          <h3 style={{marginTop:16}}>Known recipes</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
            {recipes.map(r=> (
              <div key={r._id} style={{display:'flex',alignItems:'center',gap:8,border:'1px solid #eee',padding:6,borderRadius:6}}>
                <img src={`/images/plats/${encodeURIComponent(r.name)}.png`} alt={r.name} onError={e=>{e.target.style.display='none'}} style={{width:48,height:36,objectFit:'contain'}} />
                <div style={{fontSize:13}}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Shop isOpen={shopOpen} onClose={()=>setShopOpen(false)} userId={userId} onBuy={handleBuySuccess} />
    </div>
  )
}
