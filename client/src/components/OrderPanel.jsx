import React, { useEffect, useState } from 'react'
import SmartImg from './SmartImg'

export default function OrderPanel({ orders = [], onSendDish, dishes }) {
  // Pour forcer le rafraîchissement du timer
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

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
            // Calcul du pourcentage d'expiration
            let percent = 100;
            if (order.expiresAt) {
              const total = order.expiresAt - order.id;
              const left = Math.max(0, order.expiresAt - Date.now());
              percent = Math.round((left / total) * 100);
            }
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
                  <SmartImg
                    srcs={[
                      order.recipe?.image ? `/images/plats/${order.recipe.image}` : null,
                      `/images/plats/${encodeURIComponent(order.recipe?.name || '')}.png`,
                      `/images/plats/${order.recipe?.key || ''}.png`
                    ].filter(Boolean)}
                    alt={order.recipe?.name || 'Plat'}
                    style={{ width: 50, height: 40, objectFit: 'contain', borderRadius: 6 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                      {order.recipe?.name || 'Plat inconnu'}
                    </div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                      💰 Récompense: {order.reward} pièces
                    </div>
                  </div>
                </div>
                {/* Barre d'expiration */}
                {order.expiresAt && (
                  <div style={{
                    width: '100%',
                    height: 7,
                    background: '#eee',
                    borderRadius: 6,
                    marginBottom: 8,
                    overflow: 'hidden',
                    border: '1px solid #ffd700',
                  }}>
                    <div style={{
                      width: percent + '%',
                      height: '100%',
                      background: percent > 50 ? '#4caf50' : percent > 20 ? '#ff9800' : '#f44336',
                      transition: 'width 0.5s',
                    }} />
                  </div>
                )}
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
