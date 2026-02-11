

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CraftGrid from '../components/CraftGrid';
import Shop from '../components/Shop';
import SmartImg from '../components/SmartImg';
import TrashBin from '../components/TrashBin';
import DishStorage from '../components/DishStorage';
import RecipeBook from './RecipeBook';
import OrderPanel from '../components/OrderPanel';
import axios from 'axios';

export default function Lab() {
  // États
  const [pattern, setPattern] = useState(Array(6).fill(null));
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [coins, setCoins] = useState(1000);
  const [shopOpen, setShopOpen] = useState(false);
  const [dishes, setDishes] = useState([null, null, null]);
  const [recipeBookOpen, setRecipeBookOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);

  // Variables simples
  const userId = localStorage.getItem('userId');
  const nav = useNavigate();

  // Charger l'inventaire utilisateur au chargement
  useEffect(() => {
    async function fetchInventory() {
      try {
        if (!userId) return;
        const res = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(res.data.inventory || []);
        if (typeof res.data.coins === 'number') setCoins(res.data.coins);
      } catch (err) {
        console.error('Erreur chargement inventaire', err);
      }
    }
    fetchInventory();
  }, [userId]);

  // Charger toutes les recettes
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await axios.get('http://localhost:4000/lab/recipes');
        setAllRecipes(res.data);
      } catch (err) {
        console.error('Erreur chargement recettes', err);
      }
    }
    fetchRecipes();
  }, []);

  // Générer une nouvelle commande toutes les 30 secondes
  useEffect(() => {
    function generateOrder() {
      if (allRecipes.length === 0) return;
      const recipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      const newOrder = {
        id: Date.now(),
        recipeKey: recipe.key,
        recipe: recipe,
        reward: recipe.price || 10
      };
      setOrders(prev => [...prev, newOrder]);
    }

    // Générer une première commande
    if (allRecipes.length > 0 && orders.length === 0) {
      generateOrder();
    }

    const interval = setInterval(generateOrder, 30000);
    return () => clearInterval(interval);
  }, [allRecipes, orders.length]);

  // Handlers corrigés (déclarés avant le return)
  function handleDishDrop(dish, index) {
    alert(`Vous avez interagi avec le plat : ${dish.name}`);
  }
  function handleDishRemove(index) {
    setDishes(prev => {
      const newDishes = [...prev];
      newDishes[index] = null;
      return newDishes;
    });
  }
  function handleTrashDrop(type, key) {
    if (type === 'ingredient') {
      setInventory(prev => prev.filter(inv => inv.key !== key));
    } else if (type === 'dish') {
      const index = parseInt(key);
      handleDishRemove(index);
    }
  }
  function handleBuySuccess(newInventory, newCoins) {
    if (Array.isArray(newInventory)) setInventory(newInventory);
    if (typeof newCoins === 'number') setCoins(newCoins);
  }

  async function handleSendDish(orderId, dishIndex) {
    if (dishIndex === -1 || !dishes[dishIndex]) {
      alert('Plat non disponible !');
      return;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Supprimer le plat des slots
    handleDishRemove(dishIndex);

    // Ajouter les pièces
    const newCoins = coins + order.reward;
    setCoins(newCoins);

    // Mettre à jour les coins sur le serveur
    try {
      await axios.post('http://localhost:4000/lab/update-coins', {
        userId,
        coins: newCoins
      });
    } catch (err) {
      console.error('Erreur mise à jour coins:', err);
    }

    // Supprimer la commande
    setOrders(prev => prev.filter(o => o.id !== orderId));
    alert(`✅ Commande envoyée ! +${order.reward} pièces`);
  }

  async function tryDiscover() {
    try {
      console.log('Attempting to discover with pattern:', pattern);
      console.log('User inventory:', inventory);
      
      const res = await axios.post('http://localhost:4000/lab/discover', {
        pattern,
        userId
      });
      console.log('Server response:', res.data);
      
      if (res.data.success && res.data.recipe) {
        const recipe = res.data.recipe;
        
        // Trouver le premier emplacement libre
        const freeIndex = dishes.findIndex(d => d === null);
        if (freeIndex !== -1) {
          setDishes(prev => {
            const newDishes = [...prev];
            newDishes[freeIndex] = recipe;
            return newDishes;
          });
          alert(`Félicitations ! Vous avez cuisiné : ${recipe.name}`);
        } else {
          alert(`${recipe.name} créé mais plus d'emplacement libre !`);
        }
        
        // Vide la grille après cuisine
        setPattern(Array(6).fill(null));
        // Rafraîchir l'inventaire
        const invRes = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(invRes.data.inventory || []);
      } else {
        console.log('No recipe matched or invalid response');
        alert('Aucune recette ne correspond à ce motif. Essayez autre chose !');
      }
    } catch (err) {
      console.error('Erreur lors de la découverte', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'url(/images/decors/fond.png) center/cover no-repeat, #fff'
    }}>
      {/* Colonne du centre : commandes */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '10vh',
        zIndex: 900,
        minWidth: 280,
        maxWidth: 340
      }}>
        <OrderPanel orders={orders} onSendDish={handleSendDish} dishes={dishes} />
      </div>

      {/* Colonne de droite : plats préparés + inventaire */}
      <div style={{
        position: 'absolute',
        right: '3vw',
        top: '10vh',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        minWidth: 240,
        maxWidth: 320
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          boxShadow: '0 4px 24px #bbb',
          padding: 18,
        }}>
          <h3 style={{ marginBottom: 8, textAlign: 'center' }}>Plats préparés</h3>
          <DishStorage dishes={dishes} onDrop={handleDishDrop} onRemove={handleDishRemove} />
        </div>
        {/* Inventaire */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          boxShadow: '0 4px 24px #bbb',
          padding: 18,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0 }}>Mon Inventaire</h3>
              <SmartImg srcs={['/images/object/piece.png']} style={{ width: 24, height: 24 }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>{coins}</span>
            </div>
            <button
              onClick={() => setShopOpen(true)}
              style={{
                padding: '6px 12px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <SmartImg srcs={['/images/object/achat.png']} style={{ width: 16, height: 16 }} />
              Boutique
            </button>
          </div>
          {inventory.length === 0 ? (
            <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>Aucun ingrédient</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {inventory.map((inv, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('ingredientKey', inv.key);
                    e.dataTransfer.effectAllowed = 'copyMove';
                  }}
                  style={{
                    position: 'relative',
                    border: '2px solid #ddd',
                    borderRadius: 8,
                    background: '#fff',
                    cursor: 'grab',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8
                  }}
                >
                  <SmartImg srcs={[`/images/ingredients/${inv.key}.png`]} alt={inv.key} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    fontSize: 11,
                    fontWeight: 'bold',
                    background: 'rgba(76, 175, 80, 0.9)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: 4,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    {inv.count}x
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Laboratory modal */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '2vw',
        pointerEvents: 'none'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px #b2e7b2',
          maxWidth: 500,
          width: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 32,
          position: 'relative',
          pointerEvents: 'auto'
        }}>
          <h2 style={{ marginBottom: 8, fontSize: 22, fontWeight: 700, color: '#333' }}>Laboratory</h2>
          <CraftGrid
            pattern={pattern}
            onChange={setPattern}
            inventory={inventory}
            ingredients={inventory.map(inv => ({
              key: inv.key,
              name: inv.key,
              count: inv.count
            }))}
          />
          {/* Affichage du bouton cuisiner */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <button
              onClick={tryDiscover}
              style={{
                background: '#fff',
                border: '2px solid #4CAF50',
                borderRadius: 16,
                boxShadow: '0 2px 8px #cde8c9',
                padding: 0,
                width: 72,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              aria-label="Cuisiner"
            >
              <SmartImg srcs={['/images/object/pr%C3%A9parer.png']} alt='Créer le plat' style={{ width: 56, height: 56 }} />
            </button>
          </div>
          <button
            onClick={() => setPattern(Array(6).fill(null))}
            aria-label="Vider la table"
            style={{
              position: 'absolute',
              top: 12,
              left: 16,
              width: 22,
              height: 22,
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              color: '#c00',
              fontWeight: 'bold',
              fontSize: 15,
              cursor: 'pointer',
              lineHeight: '20px',
              zIndex: 20,
              boxShadow: '0 1px 2px #eee'
            }}
          >
            ×
          </button>
          {/* Boutique (modal) */}
          <Shop isOpen={shopOpen} onClose={() => setShopOpen(false)} onBuy={handleBuySuccess} />
        </div>
      </div>

      {/* Barre inférieure : livre de recettes - poubelle - laboratoire */}
      <div style={{
        position: 'fixed',
        left: '3vw',
        bottom: '2vh',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        zIndex: 3000
      }}>
        {/* Livre de recettes - à gauche */}
        <button
          onClick={() => setRecipeBookOpen(true)}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '3px solid #8B4513',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            zIndex: 3000
          }}
          title="Livre de recettes"
        >
          <SmartImg srcs={['/images/object/livre.png']} alt='Livre de recettes' style={{ width: 60, height: 60 }} />
        </button>

        {/* Poubelle - au centre */}
        <TrashBin
          onDrop={handleTrashDrop}
          onClick={() => alert('Glisse un ingrédient ou un plat ici pour le jeter !')}
          decorMode
        />
      </div>

      {/* Livre de recettes (modal) */}
      {recipeBookOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3001
        }}>
          <div style={{
            position: 'relative',
            background: 'white',
            borderRadius: 12,
            maxWidth: 800,
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '90%'
          }}>
            <button
              onClick={() => setRecipeBookOpen(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#f0f0f0',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                fontWeight: 'bold',
                zIndex: 10
              }}
            >
              ×
            </button>
            <RecipeBook modalMode />
          </div>
        </div>
      )}
    </div>
  );
}