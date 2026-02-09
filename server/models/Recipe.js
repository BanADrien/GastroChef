const mongoose = require('mongoose');

// recipe uses a 3x3 craft pattern stored as array of 9 strings (ingredient keys or null)
const RecipeSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  pattern: [{ type: String }],
  price: { type: Number, default: 5 }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
