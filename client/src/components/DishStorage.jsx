import React, { useRef, useEffect } from 'react'
import SmartImg from './SmartImg'

// plats: [{key, name, image, expiresAt, createdAt}]
export default function DishStorage({ dishes = [], onDrop, onRemove }) {
  const now = Date.now()
  return (
    <div style={{ marginTop: 24 }}>
      <h4 style={{ margin: '8px 0 6px 0', fontWeight: 600 }}>Plats préparés</h4>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {Array.from({ length: 3 }).map((_, idx) => {
          const dish = dishes[idx]
          let percent = 0
          let isBurnt = false
          if (dish) {
            const total = dish.expiresAt - dish.createdAt
            const left = Math.max(0, dish.expiresAt - now)
            percent = Math.max(0, Math.min(1, left / total))
            isBurnt = left <= 0
          }
          return (
            <div
              key={idx}
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
              onDrop={e => {
                const dishKey = e.dataTransfer.getData('dishKey')
                if (dishKey && onDrop) onDrop(idx, dishKey)
              }}
              style={{
                width: 80,
                height: 100,
                border: '2px dashed #bbb',
                borderRadius: 10,
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {dish ? (
                <>
                  <div
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('dishKey', idx.toString())
                      e.dataTransfer.effectAllowed = 'move'
                    }}
                    style={{ cursor: 'grab', marginBottom: 4 }}
                  >
                    <SmartImg
                      srcs={[
                        isBurnt ? '/images/plats/cramé.png' : (dish.image ? `/images/plats/${dish.image}` : `/images/plats/${encodeURIComponent(dish.name)}.png`),
                        isBurnt ? '/images/plats/cramé.png' : `/images/plats/${encodeURIComponent(dish.name)}.png`,
                      ]}
                      alt={dish.name}
                      style={{ width: 48, height: 48, borderRadius: 8, background: '#fff' }}
                    />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, textAlign: 'center', marginBottom: 2 }}>{dish.name}</div>
                  <div style={{ width: 54, height: 8, background: '#eee', borderRadius: 4, margin: '2px auto 0 auto', position: 'relative' }}>
                    <div style={{ width: `${percent * 100}%`, height: 8, background: percent > 0.3 ? '#4CAF50' : percent > 0 ? '#FF9800' : '#c00', borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                  {isBurnt && <div style={{ color: '#c00', fontSize: 11, marginTop: 2 }}>Cramé !</div>}
                  <button onClick={() => onRemove && onRemove(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'none', border: 'none', color: '#c00', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>×</button>
                </>
              ) : (
                <div style={{ color: '#bbb', fontSize: 13, fontStyle: 'italic' }}>Vide</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
