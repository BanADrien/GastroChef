import React, { useEffect, useState } from "react"
import axios from "axios"
import SmartImg from '../components/SmartImg'

export default function RecipeBook(){
  const [recipes,setRecipes]=useState([])
  const [ingredients,setIngredients]=useState([])
  const userId = 'test-user' // simplified: should come from auth

  useEffect(()=>{
    axios.get("http://localhost:4000/lab/user-recipes/"+userId).then(r=>setRecipes(r.data)).catch(e=>console.error(e))
    axios.get("http://localhost:4000/lab/ingredients").then(r=>setIngredients(r.data)).catch(e=>console.error(e))
  },[])

  const findIngredient = (key) => ingredients.find(i=>i.key===key)

  return (
    <div style={{padding:20,background:'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',minHeight:'100vh'}}>
      <h1 style={{textAlign:'center',color:'#333',marginBottom:30}}>📖 Mon Livre de Recettes</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(1,1fr)",gap:24,maxWidth:1200}}>
        {recipes.length === 0 ? (
          <div style={{padding:60,textAlign:'center',background:'#fff',borderRadius:12,boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:48,marginBottom:16}}>🔍</div>
            <div style={{fontSize:18,color:'#666'}}>Aucune recette découverte encore.</div>
            <div style={{fontSize:14,color:'#999',marginTop:8}}>Explorez le laboratoire pour découvrir de nouvelles recettes !</div>
          </div>
        ) : (
          recipes.map(r=> (
            <div key={r._id} style={{background:'#fff',padding:24,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',display:'flex',gap:24,alignItems:'flex-start'}}>
              <div style={{width:160,flexShrink:0,textAlign:'center'}}>
                <div style={{width:160,height:120,display:'flex',alignItems:'center',justifyContent:'center',background:'#f9f9f9',borderRadius:8,marginBottom:12}}>
                  <SmartImg srcs={[`/images/plats/${encodeURIComponent(r.name)}.png`, `/images/plats/${r.key}.png`]} alt={r.name} style={{width:150,height:110,objectFit:'contain'}} />
                </div>
                <div style={{fontWeight:'bold',fontSize:16,color:'#333'}}>{r.name}</div>
              </div>
              <div style={{flex:1}}>
                <h3 style={{margin:'0 0 16px 0',color:'#333',fontSize:16}}>📦 Ingrédients nécessaires:</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(100px, 1fr))",gap:16}}>
                  {Array.from({length:9}).map((_,i)=> {
                    const key = r.pattern[i]
                    const ing = key ? findIngredient(key) : null
                    return (
                      <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,padding:12,background:'#f9f9f9',borderRadius:8,border:key ? '2px solid #e0e0e0' : 'none'}}>
                        {key ? (
                          <>
                            <div style={{width:60,height:60,display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',borderRadius:6}}>
                              <SmartImg srcs={[`/images/ingredients/${key}.png`]} alt={ing?.name||key} style={{width:56,height:56,objectFit:'contain'}} />
                            </div>
                            <div style={{fontSize:13,textAlign:'center',fontWeight:'500',color:'#333'}}>{ing?.name || key}</div>
                          </>
                        ) : (
                          <div style={{width:60,height:60,display:'flex',alignItems:'center',justifyContent:'center',color:'#ddd',fontSize:24}}>-</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
