// Route du marché : liste les ingrédients disponibles
const express = require('express');
const Ingredient = require('../models/Ingredient');
const router = express.Router();


// Récupère la liste des ingrédients disponibles
router.get('/list', async (req, res) => {
  const items = await Ingredient.find();
  res.json(items);
});

module.exports = router;
