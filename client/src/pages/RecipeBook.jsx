import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import SmartImg from '../components/SmartImg'

export default function RecipeBook({ modalMode }){
  const [foundRecipes, setFoundRecipes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const userId = localStorage.getItem('userId')
  const nav = useNavigate()

  useEffect(() => {
    if (!userId && !modalMode) {
      nav('/')
      return
    }
    axios.get('http://localhost:4000/lab/user-recipes/' + userId).then(r => setFoundRecipes(r.data)).catch(e => console.error(e))
    axios.get('http://localhost:4000/lab/recipes').then(r => setAllRecipes(r.data)).catch(e => console.error(e))
    axios.get('http://localhost:4000/lab/ingredients').then(r => setIngredients(r.data)).catch(e => console.error(e))
  }, [userId, nav, modalMode])

  const findIngredient = (key) => ingredients.find(i => i.key === key)
  const isFound = (recipe) => foundRecipes.some(r => r._id === recipe._id)

  return (
    <div style={{ padding: modalMode ? 0 : 20, background: modalMode ? 'none' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: modalMode ? undefined : '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: 30 }}>Livre de Recettes</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900, margin: '0 auto' }}>
        {allRecipes.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, color: '#666' }}>Aucune recette dans la base.</div>
          </div>
        ) : (
          allRecipes.map(r => {
            const found = isFound(r)
            return (
              <div key={r._id} style={{
                background: found ? '#fff' : '#f3f3f3',
                padding: 14,
                borderRadius: 12,
                boxShadow: found ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                opacity: found ? 1 : 0.45,
                filter: found ? 'none' : 'grayscale(0.7)',
                border: found ? '2px solid #b2e7b2' : '2px dashed #ccc'
              }}>
                {/* Plat image et nom */}
                <div style={{ width: 90, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {found ? (
                    <SmartImg srcs={r.image ? [`/images/plats/${r.image}`] : [`/images/plats/${encodeURIComponent(r.name)}.png`, `/images/plats/${r.key}.png`]} alt={r.name} style={{ width: 80, height: 64, objectFit: 'contain', borderRadius: 8, background: '#f9f9f9' }} />
                  ) : (
                    <div style={{ width: 80, height: 64, borderRadius: 8, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 28 }}>?</div>
                  )}
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#333', marginTop: 6 }}>{r.name}</div>
                  {found && <div style={{ fontSize: 11, color: '#4CAF50', marginTop: 2 }}>Trouvée</div>}
                </div>
                {/* Ingrédients images en ligne */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                  {Array.from({ length: 9 }).map((_, i) => {
                    const key = r.pattern[i]
                    const ing = key ? findIngredient(key) : null
                    return key ? (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        {found ? (
                          <SmartImg srcs={[`/images/ingredients/${key}.png`]} alt={ing?.name || key} style={{ width: 38, height: 38, objectFit: 'contain', background: '#fff', borderRadius: 6, border: '1px solid #eee' }} />
                        ) : (
                          <div style={{ width: 38, height: 38, borderRadius: 6, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 18 }}>?</div>
                        )}
                        {found && <div style={{ fontSize: 10, color: '#333', marginTop: 1 }}>{ing?.name || key}</div>}
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
