const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
const router = express.Router();

// Check a 3x3 pattern: array of 9 ingredient keys
router.post('/discover', async (req, res) => {
  try {
    const { pattern, userId } = req.body; // expect array of strings (length 9)
    if (!Array.isArray(pattern) || pattern.length !== 9) return res.status(400).json({ error: 'pattern' });
    
    const user = userId ? await User.findById(userId) : null;
    
    // Extract non-null ingredients from the user's pattern
    const userIngredients = pattern.filter(ing => ing !== null && ing !== undefined);
    
    // Verify user has all required ingredients in inventory
    if (user) {
      for (const key of userIngredients) {
        const inv = user.inventory.find(i => i.key === key);
        if (!inv || inv.count < 1) {
          return res.status(400).json({ success: false, error: `Missing ingredient: ${key}` });
        }
      }
    }
    
    // Find recipe with matching ingredient set (order-insensitive)
    const recipes = await Recipe.find();
    const userIngredientsSet = userIngredients.sort();
    const found = recipes.find(r => {
      const recipeIngredients = r.pattern.filter(ing => ing !== null && ing !== undefined).sort();
      return JSON.stringify(userIngredientsSet) === JSON.stringify(recipeIngredients);
    });
    
    // Consume ingredients either way
    if (user) {
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
    }
    
    if (found) {
      // Add to user's unlocked recipes if userId provided
      if (user && !user.recipes.includes(found._id)) {
        user.recipes.push(found._id);
        await user.save();
      }
      return res.json({ success: true, recipe: found, inventory: user?.inventory || [] });
    }
    // on fail, ingredients already destroyed
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
    res.json({ inventory: user.inventory, coins: user.coins });
  } catch (err) {
    console.error('Inventory error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
