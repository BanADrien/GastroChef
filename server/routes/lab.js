const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
const router = express.Router();

// Check a 3x3 pattern: array of 9 ingredient keys
router.post('/discover', async (req, res) => {
  const { pattern, userId } = req.body; // expect array of strings (length 9)
  if (!Array.isArray(pattern) || pattern.length !== 9) return res.status(400).json({ error: 'pattern' });
  
  // Extract non-null ingredients from the user's pattern and sort for comparison
  const userIngredients = pattern.filter(ing => ing !== null && ing !== undefined).sort();
  
  // Find recipe with matching ingredient set (order-insensitive)
  const recipes = await Recipe.find();
  const found = recipes.find(r => {
    const recipeIngredients = r.pattern.filter(ing => ing !== null && ing !== undefined).sort();
    return JSON.stringify(userIngredients) === JSON.stringify(recipeIngredients);
  });
  
  if (found) {
    // Add to user's unlocked recipes if userId provided
    if (userId) {
      const user = await User.findById(userId);
      if (user && !user.recipes.includes(found._id)) {
        user.recipes.push(found._id);
        await user.save();
      }
    }
    return res.json({ success: true, recipe: found });
  }
  // on fail, ingredients destroyed (caller will handle)
  return res.json({ success: false });
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

module.exports = router;
