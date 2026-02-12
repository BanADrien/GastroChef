import React, { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LabMainLayout from './LabMainLayout';
import LabCraftSection from './LabCraftSection';
import LabDiscoveredRecipes from './LabDiscoveredRecipes';
import LabOrderPanelWrapper from './LabOrderPanelWrapper';
import LabInventorySection from './LabInventorySection';

import LabVictoryOverlay from './LabVictoryOverlay';
import LabDefeatOverlay from './LabDefeatOverlay';
import LabBottomBar from './LabBottomBar';
import SatisfactionBar from './SatisfactionBar';
import GameTimer from './GameTimer';
import DishStorage from '../components/DishStorage';
import RecipeBook from './RecipeBook';
import KitchenModal from '../components/KitchenModal';

export default function Lab() {
  // Tous les hooks d'état et logique restent ici
  const GAME_DURATION_MS = 2 * 60 * 1000;
  const [gameTimeLeft, setGameTimeLeft] = useState(GAME_DURATION_MS);
  const [pattern, setPattern] = useState(Array(6).fill(null));
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [coins, setCoins] = useState(1000);
  const [shopOpen, setShopOpen] = useState(false);
  const [dishes, setDishes] = useState([null, null, null]);
  const [recipeBookOpen, setRecipeBookOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [foundRecipes, setFoundRecipes] = useState([]);
  const [satisfaction, setSatisfaction] = useState(20);
  const [avis, setAvis] = useState([]);
  const [notif, setNotif] = useState({ message: '', type: 'info' });
  const [showDefeat, setShowDefeat] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [stars, setStars] = useState(3);

  // Paramètres de difficulté dynamiques
  const defaultDifficulty = { orderSpeed: 1, dishExpire: 1, satisfactionGain: 3, satisfactionLoss: 10 };
  let difficulty = defaultDifficulty;
  try {
    const stored = localStorage.getItem('difficulty');
    if (stored) difficulty = { ...defaultDifficulty, ...JSON.parse(stored) };
  } catch {}
  // Plus la vitesse est grande, plus c'est difficile (intervalle plus court)
  const ORDER_EXPIRE_MS = Math.round(30000 / difficulty.orderSpeed);
  const DISH_EXPIRE_MS = Math.round(45000 / difficulty.dishExpire);
  const SATISFACTION_GAIN = difficulty.satisfactionGain;
  const SATISFACTION_LOSS = difficulty.satisfactionLoss;

  // Variables simples
  const userId = localStorage.getItem('userId');
  const nav = useNavigate();


  // Timer global de partie
  useEffect(() => {
    setGameTimeLeft(GAME_DURATION_MS);
    setSatisfaction(20);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setGameTimeLeft(Math.max(0, GAME_DURATION_MS - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [GAME_DURATION_MS]);

  // Restaurer les plats sauvegardés après un restart
  useEffect(() => {
    const savedDishes = localStorage.getItem('savedDishes');
    if (savedDishes) {
      try {
        const parsedDishes = JSON.parse(savedDishes);
        setDishes(parsedDishes);
      } catch (err) {
        console.error('Erreur restauration plats:', err);
      }
    }
  }, []);

  // Sauvegarder les plats automatiquement quand ils changent
  useEffect(() => {
    if (dishes.some(d => d !== null)) {
      localStorage.setItem('savedDishes', JSON.stringify(dishes));
    }
  }, [dishes]);

  // Cron: suppression des ingrédients périmés
  useEffect(() => {
    const INGREDIENT_EXPIRE_MS = 5 * 60 * 1000; // 5 minutes
    const timer = setInterval(() => {
      const now = Date.now();
      setInventory(prev => {
        return prev.filter(inv => {
          if (!inv.createdAt) return true; // Garder les anciens ingrédients sans timestamp
          const age = now - new Date(inv.createdAt).getTime();
          return age < INGREDIENT_EXPIRE_MS;
        });
      });
    }, 10000); // Vérifier toutes les 10 secondes
    return () => clearInterval(timer);
  }, []);

  // Charger l'inventaire utilisateur au chargement
  useEffect(() => {
    async function fetchInventory() {
      try {
        if (!userId) return;
        const res = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(res.data.inventory || []);
        if (typeof res.data.coins === 'number') setCoins(res.data.coins);
        // Ne charger la satisfaction que si elle n'est pas à 0 (évite de recharger une défaite)
        if (typeof res.data.satisfaction === 'number' && res.data.satisfaction > 0) {
          setSatisfaction(res.data.satisfaction);
        }
        if (typeof res.data.stars === 'number') {
          setStars(res.data.stars);
        }
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

  // Charger les recettes découvertes
  useEffect(() => {
    if (!userId) return;
    axios.get('http://localhost:4000/lab/user-recipes/' + userId)
      .then(r => setFoundRecipes(r.data))
      .catch(e => console.error(e));
  }, [userId]);

  // Générer une nouvelle commande avec timing aléatoire selon le niveau
  useEffect(() => {
    if (gameEnded || allRecipes.length === 0) return;
    
    // Calculer le délai aléatoire basé sur orderSpeed
    // orderSpeed 1 -> 10-15s, orderSpeed 2 -> 8-12s, orderSpeed 3 -> 6-10s, etc.
    function getRandomOrderDelay() {
      const baseMin = 15000; // 15 secondes
      const baseMax = 20000; // 20 secondes
      const reduction = (difficulty.orderSpeed - 1) * 2000; // 2 secondes de réduction par niveau
      
      const min = Math.max(5000, baseMin - reduction);
      const max = Math.max(8000, baseMax - reduction);
      
      return Math.random() * (max - min) + min;
    }
    
    function generateOrder() {
      if (allRecipes.length === 0) return;
      
      // 1/6 chance pour une commande VIP
      const isVIP = Math.random() < 1/6;
      
      const recipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      const vipMultiplier = isVIP ? 3 : 1; // Bonus x3 pour VIP
      const vipExpireMs = isVIP ? Math.round(ORDER_EXPIRE_MS / 3) : ORDER_EXPIRE_MS; // VIP expire 3x plus vite
      
      const newOrder = {
        id: Date.now(),
        recipeKey: recipe.key,
        recipe: recipe,
        reward: (recipe.price || 10) * vipMultiplier,
        isVIP: isVIP,
        expiresAt: Date.now() + vipExpireMs
      };
      setOrders(prev => [...prev, newOrder]);
    }
    
    // Générer immédiatement la première commande si aucune n'existe
    if (orders.length === 0) {
      generateOrder();
    }
    
    // Programmer les prochaines commandes avec délais aléatoires
    function scheduleNextOrder() {
      const delay = getRandomOrderDelay();
      return setTimeout(() => {
        generateOrder();
        scheduleNextOrder();
      }, delay);
    }
    
    const timeout = scheduleNextOrder();
    return () => clearTimeout(timeout);
  }, [allRecipes, orders.length, ORDER_EXPIRE_MS, gameEnded, difficulty.orderSpeed]);

  // Expiration commandes : fait descendre la barre de satisfaction si une commande expire
  useEffect(() => {
    if (!orders.length) return;
    const timer = setInterval(() => {
      const now = Date.now();
      const expired = orders.filter(o => o.recipe && o.expiresAt && o.expiresAt < now);
      if (expired.length > 0) {
        setOrders(prev => prev.filter(o => !o.expiresAt || o.expiresAt > now));
        
        // Compter les commandes VIP expirées
        const expiredVIP = expired.filter(o => o.isVIP).length;
        
        setSatisfaction(s => s - SATISFACTION_LOSS * expired.length);
        
        // Perdre 1 étoile par commande VIP expirée
        if (expiredVIP > 0) {
          setStars(s => Math.max(0, s - expiredVIP));
        }
        
        expired.forEach(async (order) => {
          try {
            const res = await axios.post('http://localhost:4000/lab/order-feedback', {
              userId,
              success: false,
              isVIP: order.isVIP
            });
            if (typeof res.data.stars === 'number') {
              setStars(res.data.stars);
            }
            setAvis(prev => [...prev, { type: 'negatif', date: Date.now(), orderId: order.id }]);
          } catch (err) {
            console.error('Erreur feedback satisfaction (exp):', err);
          }
        });
        
        const vipMsg = expiredVIP > 0 ? ` (-${expiredVIP} étoile${expiredVIP > 1 ? 's' : ''})` : '';
        setNotif({ message: `⏰ Commande expirée ! Avis négatif (-${SATISFACTION_LOSS * expired.length} satisfaction)${vipMsg}`, type: 'error' });
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [orders, userId, SATISFACTION_LOSS]);

  // Si satisfaction atteint 0 ou étoiles <= 1, perdu
  useEffect(() => {
    if (!gameEnded) {
      if (satisfaction <= 0) {
        setNotif({ message: '😡 Votre restaurant a trop d\'avis négatifs. Partie terminée !', type: 'error' });
        setShowDefeat(true);
        setGameEnded(true);
        localStorage.setItem('gameEnded', 'true');
      } else if (stars < 1) {
        setNotif({ message: '⭐ Vous avez perdu toutes vos étoiles. Partie terminée !', type: 'error' });
        setShowDefeat(true);
        setGameEnded(true);
        localStorage.setItem('gameEnded', 'true');
      }
    }
    if (satisfaction < 0) {
      setSatisfaction(0);
    }
  }, [satisfaction, stars, gameEnded]);

  useEffect(() => {
    if (gameTimeLeft === 0 && !gameEnded) {
      setShowVictory(true);
      setGameEnded(true);
      localStorage.setItem('gameEnded', 'true');
    }
  }, [gameTimeLeft, gameEnded]);

  // Handlers
  function handleDishDrop(dish, index) {
    setNotif({ message: `Vous avez interagi avec le plat : ${dish.name}`, type: 'info' });
  }

  function handleDishRemove(index) {
    setDishes(prev => {
      const newDishes = [...prev];
      newDishes[index] = null;
      return newDishes;
    });
  }

  async function handleTrashDrop(type, key) {
    if (type === 'ingredient') {
      try {
        await axios.post('http://localhost:4000/lab/remove-ingredient', {
          userId,
          key
        });
        setInventory(prev => prev.filter(inv => inv.key !== key));
      } catch (err) {
        setNotif({ message: 'Erreur lors de la suppression de l\'ingrédient.', type: 'error' });
      }
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
    if (gameEnded) {
      setNotif({ message: 'La partie a terminé !', type: 'error' });
      return;
    }
    if (dishIndex === -1 || !dishes[dishIndex]) {
      setNotif({ message: 'Plat non disponible !', type: 'warning' });
      return;
    }
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    handleDishRemove(dishIndex);
    const newCoins = coins + order.reward;
    setCoins(newCoins);
    try {
      await axios.post('http://localhost:4000/lab/update-coins', {
        userId,
        coins: newCoins
      });
    } catch (err) {
      console.error('Erreur mise à jour coins:', err);
    }
    try {
      const res = await axios.post('http://localhost:4000/lab/order-feedback', {
        userId,
        success: true
      });
      setSatisfaction(res.data.satisfaction);
      setAvis(prev => [...prev, { type: 'positif', date: Date.now(), orderId }]);
    } catch (err) {
      console.error('Erreur feedback satisfaction:', err);
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setNotif({ message: `✅ Commande envoyée ! +${order.reward} pièces`, type: 'success' });
  }

  async function tryDiscover() {
    if (gameEnded) {
      setNotif({ message: 'La partie a terminé !', type: 'error' });
      return;
    }
    try {
      const res = await axios.post('http://localhost:4000/lab/discover', {
        pattern,
        userId
      });
      if (res.data.success && res.data.recipe) {
        const recipe = res.data.recipe;
        const freeIndex = dishes.findIndex(d => d === null);
        if (freeIndex !== -1) {
          setDishes(prev => {
            const now = Date.now();
            const newDishes = [...prev];
            newDishes[freeIndex] = {
              ...recipe,
              createdAt: now,
              expiresAt: now + DISH_EXPIRE_MS
            };
            return newDishes;
          });
          setNotif({ message: `Félicitations ! Vous avez cuisiné : ${recipe.name}`, type: 'success' });
        } else {
          setNotif({ message: `${recipe.name} créé mais plus d'emplacement libre !`, type: 'warning' });
        }
        setPattern(Array(6).fill(null));
        const invRes = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(invRes.data.inventory || []);
        const foundRes = await axios.get('http://localhost:4000/lab/user-recipes/' + userId);
        setFoundRecipes(foundRes.data);
      } else {
        setNotif({ message: 'Aucune recette ne correspond à ce motif. Ingrédients perdus !', type: 'error' });
        setPattern(Array(6).fill(null));
        const invRes = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(invRes.data.inventory || []);
      }
    } catch (err) {
      setNotif({ message: 'Une erreur est survenue. Veuillez réessayer.', type: 'error' });
    }
  }

  async function handleRestart() {
    try {
      // Réinitialiser la satisfaction côté serveur
      await axios.post('http://localhost:4000/lab/reset-satisfaction', { userId });
      // Réinitialiser les recettes découvertes
      await axios.post('http://localhost:4000/lab/reset-recipes', { userId });
      // Vider l'inventaire
      await axios.post('http://localhost:4000/lab/clear-inventory', { userId });
      // Supprimer les plats sauvegardés
      localStorage.removeItem('savedDishes');
      // Supprimer le flag de fin de partie
      localStorage.removeItem('gameEnded');
      // Recharger la page
      window.location.reload();
    } catch (err) {
      console.error('Erreur lors du redémarrage:', err);
      window.location.reload();
    }
  }

  return (
    <>
      <LabMainLayout
        children={{
          left: <LabDiscoveredRecipes foundRecipes={foundRecipes} inventory={inventory} setPattern={setPattern} />,
          center: <LabCraftSection pattern={pattern} setPattern={setPattern} inventory={inventory} tryDiscover={tryDiscover} />,
          right: [
            <LabOrderPanelWrapper key="orders" orders={orders} onSendDish={handleSendDish} dishes={dishes} />, 
            <LabInventorySection 
              key="inventory" 
              inventory={inventory} 
              coins={coins} 
              setShopOpen={setShopOpen} 
              shopOpen={shopOpen} 
              onBuy={handleBuySuccess}
              dishes={dishes}
              handleDishDrop={handleDishDrop}
              handleDishRemove={handleDishRemove}
            />
          ]
        }}
      />
      {/* Overlays et barres fixes */}
      <GameTimer gameTimeLeft={gameTimeLeft} />
      <SatisfactionBar satisfaction={satisfaction} />
      {/* Affichage des étoiles */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 380,
        background: 'rgba(255,255,255,0.95)',
        padding: '12px 20px',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontWeight: 700,
        fontSize: 18,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <span>{'⭐'.repeat(Math.max(0, stars))}</span>
        <span style={{ color: stars < 1 ? '#c00' : '#666' }}>{stars} étoile{stars !== 1 ? 's' : ''}</span>
      </div>
      <Notification message={notif.message} type={notif.type} onClose={() => setNotif({ message: '', type: 'info' })} />
      <LabDefeatOverlay show={showDefeat} onRestart={handleRestart} onMenu={() => nav('/')} />
      <LabVictoryOverlay show={showVictory} onRestart={handleRestart} onMenu={() => nav('/')} satisfaction={satisfaction} coins={coins} stars={stars} />
      <LabBottomBar onRecipeBookOpen={() => setRecipeBookOpen(true)} onTrashDrop={handleTrashDrop} />
      <KitchenModal open={recipeBookOpen} onClose={() => setRecipeBookOpen(false)}>
        <RecipeBook modalMode foundRecipes={foundRecipes} />
      </KitchenModal>
    </>
  );
}