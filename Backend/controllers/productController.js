import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, price, unit, category, description, stock } = req.body;

    const product = await Product.create({
      farmerId: req.user._id,
      name,
      price,
      unit,
      category,
      description,
      stock,
      productImageUrl: req.file ? req.file.path : ""
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id });
    res.status(200).json({ success: true, data: products });
  } catch (error){
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductsByFarmer = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Product.find({ farmerId: id });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product"
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const updates = { ...req.body };

    if (req.file) {
      updates.productImageUrl = req.file.path;
    }
    if (updates.stock !== undefined) {
      updates.isAvailable = updates.stock > 0;
     }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProduct
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {

    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("farmerId", "fullName farmName farmLocation farmImageUrl img identifier isVerified");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {

    console.log("Error on getProduct" , error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};