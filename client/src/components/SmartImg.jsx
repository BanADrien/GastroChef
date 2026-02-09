import React, { useEffect, useState } from 'react'

// SmartImg tries multiple srcs in order and uses the first that loads successfully.
export default function SmartImg({ srcs = [], alt = '', style = {}, className }){
  const [loaded, setLoaded] = useState(null)
  const [error, setError] = useState(false)

  useEffect(()=>{
    let cancelled = false
    setError(false)
    const tryNext = (list, i=0) => {
      if (cancelled) return
      if (!list || i >= list.length) { 
        setLoaded(null)
        setError(true)
        return 
      }
      const img = new Image()
      img.onload = () => { 
        if (!cancelled) { 
          setLoaded(list[i])
          setError(false)
        }
      }
      img.onerror = () => {
        if (!cancelled) tryNext(list, i+1)
      }
      img.src = list[i]
    }
    tryNext(srcs)
    return ()=>{ cancelled = true }
  }, [JSON.stringify(srcs)])

  if (!loaded) {
    // Return a visible but subtle placeholder
    return (
      <div style={{
        width: style.width||40, 
        height: style.height||40, 
        background: error ? '#f0f0f0' : '#f9f9f9', 
        display:'inline-flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4,
        border: error ? '1px solid #ddd' : 'none',
        color:'#bbb',
        fontSize: Math.max(8, (style.width || 40) / 4),
        textAlign:'center',
        padding:2,
        minWidth: style.width||40,
        minHeight: style.height||40
      }}>
        {error ? '?' : '…'}
      </div>
    )
  }
  return <img src={loaded} alt={alt} style={{...style, objectFit: 'contain'}} className={className} />
}
