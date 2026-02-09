import React, { useEffect, useState } from "react"
import axios from "axios"

export default function Marketplace(){
  const [items,setItems]=useState([])
  useEffect(()=>{ axios.get("http://localhost:4000/market/list").then(r=>setItems(r.data)).catch(e=>console.error(e)) },[])
  return (
    <div style={{padding:20}}>
      <h2>Marketplace</h2>
      <ul>{items.map(i=>(<li key={i._id}>{i.name}  ${i.price} <button>Buy x50</button></li>))}</ul>
    </div>
  )
}
