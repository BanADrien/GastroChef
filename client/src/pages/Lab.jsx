

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CraftGrid from '../components/CraftGrid';
import Shop from '../components/Shop';
import SmartImg from '../components/SmartImg';
import TrashBin from '../components/TrashBin';
import DishStorage from '../components/DishStorage';
import axios from 'axios';

export default function Lab() {
                                                                            useEffect(() => {
                                                                              setMoveMode(null);
                                                                            }, [shopOpen]);
                                                                          useEffect(() => {
                                                                            setMoveMode(null);
                                                                          }, [shopOpen]);
                                                                        useEffect(() => {
                                                                          setMoveMode(null);
                                                                        }, [shopOpen]);
                                                                      useEffect(() => {
                                                                        setMoveMode(null);
                                                                      }, [shopOpen]);
                                                                    useEffect(() => {
                                                                      setMoveMode(null);
                                                                    }, [shopOpen]);
                                                                  useEffect(() => {
                                                                    setMoveMode(null);
                                                                  }, [shopOpen]);
                                                                useEffect(() => {
                                                                  setMoveMode(null);
                                                                }, [shopOpen]);
                                                              useEffect(() => {
                                                                setMoveMode(null);
                                                              }, [shopOpen]);
                                                            useEffect(() => {
                                                              setMoveMode(null);
                                                            }, [shopOpen]);
                                                          useEffect(() => {
                                                            setMoveMode(null);
                                                          }, [shopOpen]);
                                                        useEffect(() => {
                                                          setMoveMode(null);
                                                        }, [shopOpen]);
                                                      useEffect(() => {
                                                        setMoveMode(null);
                                                      }, [shopOpen]);
                                                    useEffect(() => {
                                                      setMoveMode(null);
                                                    }, [shopOpen]);
                                                  useEffect(() => {
                                                    setMoveMode(null);
                                                  }, [shopOpen]);
                                                useEffect(() => {
                                                  setMoveMode(null);
                                                }, [shopOpen]);
                                              useEffect(() => {
                                                setMoveMode(null);
                                              }, [shopOpen]);
                                            useEffect(() => {
                                              setMoveMode(null);
                                            }, [shopOpen]);
                                          useEffect(() => {
                                            setMoveMode(null);
                                          }, [shopOpen]);
                                        useEffect(() => {
                                          setMoveMode(null);
                                        }, [shopOpen]);
                                      useEffect(() => {
                                        setMoveMode(null);
                                      }, [shopOpen]);
                                    useEffect(() => {
                                      setMoveMode(null);
                                    }, [shopOpen]);
                                  useEffect(() => {
                                    setMoveMode(null);
                                  }, [shopOpen]);
                                useEffect(() => {
                                  setMoveMode(null);
                                }, [shopOpen]);
                              useEffect(() => {
                                setMoveMode(null);
                              }, [shopOpen]);
                            useEffect(() => {
                              setMoveMode(null);
                            }, [shopOpen]);
                          useEffect(() => {
                            setMoveMode(null);
                          }, [shopOpen]);
                        useEffect(() => {
                          setMoveMode(null);
                        }, [shopOpen]);
                      useEffect(() => {
                        setMoveMode(null);
                      }, [shopOpen]);
                    useEffect(() => {
                      setMoveMode(null);
                    }, [shopOpen]);
                  useEffect(() => {
                    setMoveMode(null);
                  }, [shopOpen]);
                useEffect(() => {
                  setMoveMode(null);
                }, [shopOpen]);
              useEffect(() => {
                setMoveMode(null);
              }, [shopOpen]);
            useEffect(() => {
              setMoveMode(null);
            }, [shopOpen]);
          useEffect(() => {
            setMoveMode(null);
          }, [pattern]);
        useEffect(() => {
          setMoveMode(null);
        }, [dishes]);
      useEffect(() => {
        setMoveMode(null);
      }, [inventory]);
    useEffect(() => {
      setMoveMode(null);
    }, [userId]);
  const [pattern, setPattern] = useState(Array(9).fill(null));
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [coins, setCoins] = useState(1000);
  const [shopOpen, setShopOpen] = useState(false);
  const [dishes, setDishes] = useState([null, null, null]);
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
  async function tryDiscover() {
    try {
      const res = await axios.post('http://localhost:4000/lab/discover', {
        pattern,
        userId
      });
      if (res.data.success) {
        // Le plat prend toute la place des 9 cases
        alert(`Félicitations ! Vous avez cuisiné : ${res.data.dish.name}`);
        // On propose de déplacer le plat ou de le servir
        setPattern(Array(9).fill(null)); // Vide la grille après cuisine
        setMoveMode({ dish: res.data.dish }); // Remplace le plat en attente si un nouveau est cuisiné
        // Rafraîchir l'inventaire
        const invRes = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(invRes.data.inventory || []);
      } else {
        alert('Aucune recette ne correspond à ce motif. Essayez autre chose !');
      }
    } catch (err) {
      console.error('Erreur lors de la découverte', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
  // Mode déplacement plat après cuisine
  const [moveMode, setMoveMode] = useState(null);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'url(/images/decors/fond.png) center/cover no-repeat, #fff'
    }}>
      {/* Colonne de droite : plats préparés + inventaire */}
      <div style={{
        position: 'absolute',
        right: '3vw',
        top: '10vh',
        zIndex: 3000,
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
          {/* Si un plat vient d'être cuisiné, proposer de le déplacer ou servir */}
          {moveMode && moveMode.dish && (
            <div style={{ marginTop: 18, background: '#f7fff7', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px #cde8c9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SmartImg srcs={[`/images/ingredients/${moveMode.dish.key}.png`]} alt={moveMode.dish.name} style={{ width: 48, height: 48 }} />
                <span style={{ fontWeight: 700, fontSize: 17 }}>{moveMode.dish.name}</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
                {[0,1,2].map(idx => (
                  <button key={idx} style={{ padding: '6px 12px', borderRadius: 8, background: !!dishes[idx] ? '#bbb' : '#4CAF50', color: '#fff', fontWeight: 600, cursor: !!dishes[idx] ? 'not-allowed' : 'pointer' }}
                    onClick={() => {
                      if (!!dishes[idx]) return;
                      setDishes(arr => {
                        const newArr = [...arr];
                        if (!newArr[idx]) newArr[idx] = moveMode.dish;
                        return newArr;
                      });
                      setMoveMode(null);
                    }}
                    disabled={!!dishes[idx]}
                  >
                    Mettre dans l'emplacement {idx+1}
                  </button>
                ))}
                <button style={{ padding: '6px 12px', borderRadius: 8, background: '#FF6B6B', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                  onClick={async () => {
                    if (!moveMode || !moveMode.dish) return;
                    alert('Plat servi au client !');
                    setMoveMode(null);
                    // Optionnel : rafraîchir l'inventaire après avoir servi
                    const invRes = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
                    setInventory(invRes.data.inventory || []);
                  }}
                >Servir au client</button>
              </div>
            </div>
          )}
        </div>
        {/* Inventaire */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          boxShadow: '0 4px 24px #bbb',
          padding: 18,
        }}>
          <h3 style={{ marginBottom: 8 }}>Mon Inventaire</h3>
          {inventory.length === 0 ? (
            <div style={{ color: '#888', fontSize: 14 }}>Aucun ingrédient</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {inventory.map((inv, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('ingredientKey', inv.key);
                    e.dataTransfer.effectAllowed = 'copyMove';
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 8,
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    background: '#fff',
                    cursor: 'grab',
                    minHeight: 48
                  }}
                >
                  <SmartImg srcs={[`/images/ingredients/${inv.key}.png`]} alt={inv.key} style={{ width: 32, height: 32 }} />
                  <div style={{ fontSize: 13, flex: 1 }}>{inv.key}</div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    background: '#e8f5e9',
                    padding: '2px 8px',
                    borderRadius: 4
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
        justifyContent: 'center',
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
          position: 'relative'
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
          {/* Affichage pièces et bouton boutique */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 8px 0', justifyContent: 'center' }}>
            <SmartImg srcs={['/images/object/piece.png']} style={{ width: 28, height: 28 }} />
            <span style={{ fontWeight: 700, fontSize: 18 }}>{coins}</span>
            <button
              onClick={() => setShopOpen(true)}
              style={{
                padding: '6px 14px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 15,
                marginLeft: 8
              }}
            >
              <SmartImg srcs={['/images/object/achat.png']} style={{ width: 22, height: 22, marginRight: 6 }} />
              Boutique
            </button>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12 }}>
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
            onClick={() => setPattern(Array(9).fill(null))}
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
          {/* Poubelle */}
          <div style={{ position: 'fixed', right: '3vw', bottom: '2vh', zIndex: 1002 }}>
            <TrashBin
              onDrop={handleTrashDrop}
              onClick={() => alert('Glisse un ingrédient ou un plat ici pour le jeter !')}
              decorMode
            />
          </div>
        </div>
      </div>
    </div>
  );

  async function tryDiscover() {
    try {
      const res = await axios.post('http://localhost:4000/lab/discover', {
        pattern,
        userId
      });
      if (res.data.success) {
        alert(`Félicitations ! Vous avez découvert : ${res.data.dish.name}`);
        setDishes(prev => {
          const newDishes = [...prev];
          const emptyIndex = newDishes.findIndex(d => d === null);
          if (emptyIndex !== -1) {
            newDishes[emptyIndex] = res.data.dish;
          }
          return newDishes;
        });
        // Rafraîchir l'inventaire
        const invRes = await axios.get(`http://localhost:4000/lab/inventory/${userId}`);
        setInventory(invRes.data.inventory || []);
      } else {
        alert('Aucune recette ne correspond à ce motif. Essayez autre chose !');
      }
    } catch (err) {
      console.error('Erreur lors de la découverte', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  function handleDishDrop(dish, index) {
    // Ici on pourrait implémenter une action sur le plat (ex: le servir pour gagner des pièces)
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
      // Supprimer l'ingrédient de l'inventaire
      setInventory(prev => prev.filter(inv => inv.key !== key));
    } else if (type === 'dish') {
      // Supprimer le plat (ici on suppose que key est l'index du plat dans le stockage)
      const index = parseInt(key);
      handleDishRemove(index);
    }
  } 
  function handleBuySuccess(newInventory, newCoins) {
    setInventory(newInventory);
    setCoins(newCoins);
  }
}