import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String, //kg, gram, piece, litre
    required: true
  },
  category: {
    type: String, //  Vegetables, Fruits, Grains
    required: true
  },
  description: {
    type: String,
    required: true
  },
  productImageUrl: {
    type: String, // Single image for now
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;