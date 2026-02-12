const mongoose = require('mongoose');

// recipe uses a 3x2 craft pattern stored as array of 6 strings (ingredient keys or null)
const RecipeSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  pattern: [{ type: String }], // always 6 elements
  price: { type: Number, default: 5 }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
