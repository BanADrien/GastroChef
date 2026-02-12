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

export default function Lab() {
  // Tous les hooks d'état et logique restent ici
  const GAME_DURATION_MS = 5 * 60 * 1000;
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

  // Charger l'inventaire utilisateur au chargement
  useEffect(() => {
    async function fetchInventory() {
      try {
        if (!userId) return;
        const res = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(res.data.inventory || []);
        if (typeof res.data.coins === 'number') setCoins(res.data.coins);
        if (typeof res.data.satisfaction === 'number') {
          setSatisfaction(res.data.satisfaction);
          setShowDefeat(false);
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

  // Générer une nouvelle commande toutes les 30 secondes
  useEffect(() => {
    function generateOrder() {
      if (allRecipes.length === 0) return;
      const recipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      const newOrder = {
        id: Date.now(),
        recipeKey: recipe.key,
        recipe: recipe,
        reward: recipe.price || 10,
        expiresAt: Date.now() + ORDER_EXPIRE_MS
      };
      setOrders(prev => [...prev, newOrder]);
    }
    if (allRecipes.length > 0 && orders.length === 0) {
      generateOrder();
    }
    const interval = setInterval(generateOrder, ORDER_EXPIRE_MS);
    return () => clearInterval(interval);
  }, [allRecipes, orders.length, ORDER_EXPIRE_MS]);

  // Timer pour pourrissement des plats cuisinés
  useEffect(() => {
    if (!dishes.some(Boolean)) return;
    const now = Date.now();
    setDishes(prev => prev.map(dish => {
      if (dish && !dish.expiresAt) {
        return { ...dish, expiresAt: now + DISH_EXPIRE_MS };
      }
      return dish;
    }));
    const timer = setInterval(() => {
      setDishes(prev => prev.map(dish => {
        if (dish && dish.expiresAt && dish.expiresAt < Date.now()) {
          return null;
        }
        return dish;
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, [dishes, DISH_EXPIRE_MS]);

  // Expiration commandes : fait descendre la barre de satisfaction si une commande expire
  useEffect(() => {
    if (!orders.length) return;
    const timer = setInterval(() => {
      const now = Date.now();
      const expired = orders.filter(o => o.recipe && o.expiresAt && o.expiresAt < now);
      if (expired.length > 0) {
        setOrders(prev => prev.filter(o => !o.expiresAt || o.expiresAt > now));
        setSatisfaction(s => s - SATISFACTION_LOSS * expired.length);
        expired.forEach(async (order) => {
          try {
            await axios.post('http://localhost:4000/lab/order-feedback', {
              userId,
              success: false
            });
            setAvis(prev => [...prev, { type: 'negatif', date: Date.now(), orderId: order.id }]);
          } catch (err) {
            console.error('Erreur feedback satisfaction (exp):', err);
          }
        });
        setNotif({ message: '⏰ Commande expirée ! Avis négatif (-10 satisfaction)', type: 'error' });
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [orders, userId, SATISFACTION_LOSS]);

  // Si satisfaction atteint 0, perdu
  useEffect(() => {
    if (satisfaction === 0) {
      setNotif({ message: '😡 Votre restaurant a trop d\'avis négatifs. Partie terminée !', type: 'error' });
      setShowDefeat(true);
    } else if (satisfaction < 0) {
      setSatisfaction(0);
    }
  }, [satisfaction]);

  useEffect(() => {
    if (gameTimeLeft === 0) {
      setShowVictory(true);
    }
  }, [gameTimeLeft]);

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
        setNotif({ message: 'Aucune recette ne correspond à ce motif. Essayez autre chose !', type: 'warning' });
      }
    } catch (err) {
      setNotif({ message: 'Une erreur est survenue. Veuillez réessayer.', type: 'error' });
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
            <LabInventorySection key="inventory" inventory={inventory} coins={coins} setShopOpen={setShopOpen} shopOpen={shopOpen} onBuy={handleBuySuccess} />
          ]
        }}
      />
      {/* Overlays et barres fixes */}
      <GameTimer gameTimeLeft={gameTimeLeft} />
      <SatisfactionBar satisfaction={satisfaction} />
      <Notification message={notif.message} type={notif.type} onClose={() => setNotif({ message: '', type: 'info' })} />
      <LabDefeatOverlay show={showDefeat} onRestart={() => window.location.reload()} onMenu={() => nav('/')} />
      <LabVictoryOverlay show={showVictory} onRestart={() => window.location.reload()} onMenu={() => nav('/')} satisfaction={satisfaction} coins={coins} />
      <LabBottomBar onRecipeBookOpen={() => setRecipeBookOpen(true)} onTrashDrop={handleTrashDrop} />
      {/* Modals (Shop, RecipeBook) à réintégrer ici */}
    </>
  );
}