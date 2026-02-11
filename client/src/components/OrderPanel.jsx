import React from 'react'
import SmartImg from './SmartImg'

export default function OrderPanel({ orders = [], onSendDish, dishes }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 24,
      boxShadow: '0 4px 24px #bbb',
      padding: 18,
      minWidth: 240,
      maxWidth: 320
    }}>
      <h3 style={{ marginBottom: 12, textAlign: 'center' }}>Commandes</h3>
      {orders.length === 0 ? (
        <div style={{ color: '#888', fontSize: 14, textAlign: 'center', padding: 20 }}>
          Aucune commande en attente
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order, idx) => {
            const canSend = dishes.some((dish, dishIdx) => 
              dish && dish.key === order.recipeKey
            )
            const dishIndex = dishes.findIndex((dish) => 
              dish && dish.key === order.recipeKey
            )
            
            return (
              <div
                key={order.id}
                style={{
                  background: '#fff',
                  border: '2px solid #FFD700',
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {order.recipe?.image ? (
                    <SmartImg 
                      srcs={[`/images/plats/${order.recipe.image}`]} 
                      alt={order.recipe.name} 
                      style={{ width: 50, height: 40, objectFit: 'contain', borderRadius: 6 }} 
                    />
                  ) : (
                    <div style={{ 
                      width: 50, 
                      height: 40, 
                      background: '#f0f0f0', 
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20
                    }}>
                      🍽️
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                      {order.recipe?.name || 'Plat inconnu'}
                    </div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                      💰 Récompense: {order.reward} pièces
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSendDish(order.id, dishIndex)}
                  disabled={!canSend}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: canSend ? '#4CAF50' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    fontWeight: 600,
                    fontSize: 13
                  }}
                >
                  {canSend ? '📤 Envoyer' : '❌ Plat non disponible'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
