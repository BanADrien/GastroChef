const express = require('express');
const User = require('../models/User');
const Ingredient = require('../models/Ingredient');
const router = express.Router();

// Get user coins and inventory
router.get('/status', async (req, res) => {
  const userId = req.query.userId; // simplified: should be from auth token
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ coins: user.coins, inventory: user.inventory });
});

// Buy an ingredient
router.post('/buy', async (req, res) => {
  try {
    const { userId, ingredientKey, quantity } = req.body;
    if (!userId || !ingredientKey) return res.status(400).json({ error: 'userId and ingredientKey required' });
    const qty = Math.max(1, parseInt(quantity) || 1);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });

    const ingredient = await Ingredient.findOne({ key: ingredientKey });
    if (!ingredient) return res.status(404).json({ error: 'ingredient not found' });

    const totalPrice = ingredient.price * qty;
    if (user.coins < totalPrice) return res.status(400).json({ error: 'not enough coins' });

    // Deduct coins
    user.coins -= totalPrice;

    // Add to inventory with timestamp (FIFO)
    const existing = user.inventory.find(i => i.key === ingredientKey);
    if (existing) {
      existing.count += qty;
    } else {
      user.inventory.push({ 
        key: ingredientKey, 
        count: qty,
        createdAt: new Date()
      });
    }

    await user.save();
    res.json({ success: true, coins: user.coins, inventory: user.inventory });
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Use ingredient from inventory (subtract from inventory, add to craft)
router.post('/use', async (req, res) => {
  const { userId, ingredientKey } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'user not found' });
  
  const existing = user.inventory.find(i => i.key === ingredientKey);
  if (!existing || existing.count < 1) return res.status(400).json({ error: 'not in inventory' });
  
  existing.count -= 1;
  if (existing.count === 0) {
    user.inventory = user.inventory.filter(i => i.key !== ingredientKey);
  }
  
  await user.save();
  res.json({ success: true, inventory: user.inventory });
});

module.exports = router;
