import React, { useState, useEffect } from 'react'
import SmartImg from './SmartImg'

export default function Shop({ isOpen, onClose, onBuy }){
  const [ingredients, setIngredients] = useState([])
  const [coins, setCoins] = useState(1000)
  const userId = localStorage.getItem('userId')

  useEffect(()=>{
    if (!isOpen) return
    // Fetch available ingredients and user coins
    Promise.all([
      fetch('http://localhost:4000/lab/ingredients')
        .then(r=>r.json())
        .then(items=>setIngredients(items))
        .catch(e=>console.error('Failed to fetch ingredients:', e)),
      userId ? fetch(`http://localhost:4000/lab/inventory/${userId}`)
        .then(r=>r.json())
        .then(data=>setCoins(data.coins))
        .catch(e=>console.error('Failed to fetch coins:', e)) : Promise.resolve()
    ])
  }, [isOpen, userId])

  const handleBuy = async (ing, qty = 1) => {
    const uid = localStorage.getItem('userId')
    const totalPrice = ing.price * qty;
    if (!uid) { alert('Non connecté'); return }
    if (coins < totalPrice) { alert('Pas assez de pièces!'); return }
    try {
      const r = await fetch('http://localhost:4000/shop/buy', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ userId: uid, ingredientKey: ing.key, quantity: qty })
      })
      const data = await r.json()
      if (data.success) {
            setCoins(data.coins)
            onBuy && onBuy(data.inventory, data.coins) // notify parent with inventory and coins
      } else {
        alert(data.error || 'Achat échoué')
      }
    } catch(e) {
      console.error('Buy error:', e)
      alert('Erreur lors de l\'achat')
    }
  }

  if (!isOpen) return null

  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
      <div style={{background:'#fff',padding:20,borderRadius:8,maxWidth:600,maxHeight:'80vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h2>Marché - Achat d'ingrédients</h2>
          <button onClick={onClose} style={{padding:'4px 12px',cursor:'pointer'}}>✕</button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:18,fontWeight:'bold'}}>
          <SmartImg srcs={['/images/object/piece.png']} style={{width:32,height:32}} />
          <div>{coins}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
          {ingredients.map(ing=> {
            const qty = 10;
            const totalPrice = ing.price * qty;
            return (
              <div key={ing.key} style={{border:'1px solid #ddd',padding:12,borderRadius:6,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <SmartImg srcs={[`/images/ingredients/${ing.key}.png`]} alt={ing.name} style={{width:60,height:60}} />
                <div style={{textAlign:'center'}}>
                  <div style={{fontWeight:'bold'}}>{ing.name}</div>
                  <div style={{fontSize:12,color:'#666'}}>Prix: {totalPrice} pour {qty}</div>
                </div>
                <button onClick={()=>{
                  handleBuy(ing, qty);
                }} style={{width:'100%',padding:'6px 12px',background:coins >= totalPrice ? '#4CAF50' : '#ccc',color:'#fff',border:'none',borderRadius:4,cursor: coins >= totalPrice ? 'pointer' : 'not-allowed'}}>
                  Acheter x{qty}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
