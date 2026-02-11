const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  coins: { type: Number, default: 1000 },
  inventory: [{key: String, count: {type: Number, default: 1}}],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
