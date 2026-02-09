const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['purchase','sale','penalty'], required: true },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
