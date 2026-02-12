const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  coins: { type: Number, default: 1000 },
  satisfaction: { type: Number, default: 20 },
  stars: { type: Number, default: 3 },
  inventory: [{
    key: String, 
    count: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
  }],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
