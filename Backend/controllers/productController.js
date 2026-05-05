import Product from "../models/Product.js";


export const addProduct = async (req, res) => {
  try {
    const { name, price, unit, category, description, productImageUrl, stock } = req.body;

    const product = await Product.create({
      farmerId: req.user._id, 
      name,
      price,
      unit,
      category,
      description,
      productImageUrl,
      stock
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmerId", "fullName farmName farmLocation farmImageUrl identifier isVerified")
      .sort("-createdAt");

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};