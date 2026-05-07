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
    type: String,
    required: true
  },
  category: {
    type: String, 
    required: true
  },
  description: {
    type: String,
    required: true
  },
  productImageUrl: {
    type: String, 
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