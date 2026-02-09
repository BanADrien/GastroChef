const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const router = express.Router();

// Check a 3x3 pattern: array of 9 ingredient keys
router.post('/discover', async (req, res) => {
  const { pattern } = req.body; // expect array of strings (length 9)
  if (!Array.isArray(pattern) || pattern.length !== 9) return res.status(400).json({ error: 'pattern' });
  // naive matching: find recipe with same pattern
  const recipes = await Recipe.find();
  const found = recipes.find(r => JSON.stringify(r.pattern) === JSON.stringify(pattern));
  if (found) {
    return res.json({ success: true, recipe: found });
  }
  // on fail, ingredients destroyed (caller will handle)
  return res.json({ success: false });
});

router.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

router.get('/ingredients', async (req, res) => {
  const items = await Ingredient.find();
  res.json(items);
});

module.exports = router;
