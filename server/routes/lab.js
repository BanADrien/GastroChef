
const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
const router = express.Router();

// Reset discovered recipes for user
router.post('/reset-recipes', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    user.recipes = [];
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Reset recipes error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Reset satisfaction to 20 for user
router.post('/reset-satisfaction', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    user.satisfaction = 20;
    await user.save();
    res.json({ success: true, satisfaction: user.satisfaction });
  } catch (err) {
    console.error('Reset satisfaction error:', err);
    res.status(500).json({ error: err.message });
  }
});





// Clear user inventory
router.post('/clear-inventory', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    user.inventory = [];
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Clear inventory error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Remove ingredient from user inventory permanently
router.post('/remove-ingredient', async (req, res) => {
  try {
    const { userId, key } = req.body;
    if (!userId || !key) return res.status(400).json({ error: 'userId and key required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    user.inventory = user.inventory.filter(i => i.key !== key);
    await user.save();
    res.json({ success: true, inventory: user.inventory });
  } catch (err) {
    console.error('Remove ingredient error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Met à jour la satisfaction du joueur (commande honorée ou rejetée)
router.post('/order-feedback', async (req, res) => {
  try {
    const { userId, success } = req.body; // success: true (honorée), false (rejetée/expirée)
    if (!userId || typeof success !== 'boolean') {
      return res.status(400).json({ error: 'userId and success(boolean) required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    let avis = 'positif';
    if (success) {
      user.satisfaction += 1;
    } else {
      user.satisfaction -= 10;
      avis = 'negatif';
    }
    user.satisfaction = Math.max(0, user.satisfaction); // Empêche satisfaction négative
    await user.save();
    res.json({ success: true, satisfaction: user.satisfaction, avis });
  } catch (err) {
    console.error('Order feedback error:', err);
    res.status(500).json({ error: err.message });
  }
});


// Check a 3x2 pattern: array of 6 ingredient keys
router.post('/discover', async (req, res) => {
  try {
    const { pattern, userId } = req.body; // expect array of strings (length 6)
    console.log('=== DISCOVER REQUEST ===');
    console.log('Pattern received:', pattern);
    console.log('UserId:', userId);
    
    if (!Array.isArray(pattern) || pattern.length !== 6) return res.status(400).json({ error: 'pattern must be array of 6' });
    
    const user = userId ? await User.findById(userId) : null;
    console.log('User found:', user ? user._id : 'NO USER');
    if (user) {
      console.log('User inventory:', user.inventory);
    }
    
    // Extract non-null ingredients from the user's pattern
    const userIngredients = pattern.filter(ing => ing !== null && ing !== undefined);
    console.log('Extracted ingredients from pattern:', userIngredients);
    
    // Verify user has all required ingredients in inventory
    if (user && userIngredients.length > 0) {
      for (const key of userIngredients) {
        const inv = user.inventory.find(i => i.key === key);
        console.log(`Checking ingredient ${key}:`, inv ? `found (count: ${inv.count})` : 'NOT FOUND');
        if (!inv || inv.count < 1) {
          console.log(`Missing ingredient: ${key}`);
          return res.status(400).json({ success: false, error: `Missing ingredient: ${key}` });
        }
      }
    }
    
    // Find recipe with matching ingredient set (order-insensitive)
    const recipes = await Recipe.find();
    console.log('Total recipes in DB:', recipes.length);
    
    const userIngredientsSet = userIngredients.sort();
    console.log('User ingredients sorted:', userIngredientsSet);

    const found = recipes.find(r => {
      if (!Array.isArray(r.pattern) || r.pattern.length !== 6) return false;
      const recipeIngredients = r.pattern.filter(ing => ing !== null && ing !== undefined).sort();
      const matches = JSON.stringify(userIngredientsSet) === JSON.stringify(recipeIngredients);
      console.log(`Recipe ${r.key}: pattern=${r.pattern}, extracted=${recipeIngredients}, matches=${matches}`);
      return matches;
    });
    
    console.log('Recipe found:', found ? found.key : 'NONE');
    
    // Consume ingredients either way
    if (user && userIngredients.length > 0) {
      for (const key of userIngredients) {
        const inv = user.inventory.find(i => i.key === key);
        if (inv) {
          inv.count -= 1;
          if (inv.count === 0) {
            user.inventory = user.inventory.filter(i => i.key !== key);
          }
        }
      }
      await user.save();
      console.log('Ingredients consumed, inventory updated');
    }
    
    if (found) {
      // Add to user's unlocked recipes if userId provided
      if (user && !user.recipes.includes(found._id)) {
        user.recipes.push(found._id);
        await user.save();
        console.log('Recipe added to user');
      }
      return res.json({ success: true, recipe: found, inventory: user?.inventory || [] });
    }
    // on fail, ingredients already destroyed
    console.log('=== NO MATCH ===');
    return res.json({ success: false, inventory: user?.inventory || [] });
  } catch (err) {
    console.error('Discover error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

// Get user's unlocked recipes
router.get('/user-recipes/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).populate('recipes');
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json(user.recipes || []);
});

router.get('/ingredients', async (req, res) => {
  const items = await Ingredient.find();
  res.json(items);
});

// Get user inventory
router.get('/inventory/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json({ inventory: user.inventory, coins: user.coins, satisfaction: user.satisfaction });
  } catch (err) {
    console.error('Inventory error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update user coins
router.post('/update-coins', async (req, res) => {
  try {
    const { userId, coins } = req.body;
    if (!userId || typeof coins !== 'number') {
      return res.status(400).json({ error: 'userId and coins required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    user.coins = coins;
    await user.save();
    res.json({ success: true, coins: user.coins });
  } catch (err) {
    console.error('Update coins error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
