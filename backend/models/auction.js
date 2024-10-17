const mongoose = require('mongoose');
const NodeRSA = require('node-rsa');

const bidSchema = new mongoose.Schema({
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  encryptedAmount: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  startingBid: { type: Number, required: true },
  minimumBid: { type: Number, required: true },
  duration: { type: String, required: true },
  endTime: { type: Date, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  bids: [bidSchema],
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true }
});

auctionSchema.methods.generateRSAKeys = function() {
  const key = new NodeRSA({b: 512});
  this.publicKey = key.exportKey('public');
  this.privateKey = key.exportKey('private');
};

auctionSchema.methods.encryptBid = function(amount) {
  const key = new NodeRSA();
  key.importKey(this.publicKey, 'public');
  return key.encrypt(amount.toString(), 'base64');
};

auctionSchema.methods.decryptBid = function(encryptedAmount) {
  const key = new NodeRSA();
  key.importKey(this.privateKey, 'private');
  return parseFloat(key.decrypt(encryptedAmount, 'utf8'));
};

module.exports = mongoose.model('Auction', auctionSchema);
