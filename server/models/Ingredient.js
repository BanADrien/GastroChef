const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, default: 1 }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
