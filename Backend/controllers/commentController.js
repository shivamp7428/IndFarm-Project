import CommentModel from "../models/Comments.js";
import ProductModel from "../models/Product.js";
import UserModel from "../models/User.js";


// CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { productId, comment, rating} = req.body;

    if (!productId || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    const farmer = await UserModel.findById(product.farmerId);

   console.log("Eroror")
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found"
      });
    }

    const alreadyCommented = await CommentModel.findOne({
      userId,
      productId
    });

    if (alreadyCommented) {
      return res.status(400).json({
        success: false,
        message: "You already commented on this product"
      });
    }
    const newComment = await CommentModel.create({
      userId,
      farmerId: product.farmerId,
      productId,
      comment,
      rating
    });

    const farmerComments = await CommentModel.find({
      farmerId: product.farmerId
    });

    const totalRatings = farmerComments.reduce(
      (acc, item) => acc + item.rating,
      0
    );

    const averageRating =
      farmerComments.length > 0
        ? totalRatings / farmerComments.length
        : 0;

    farmer.stars = averageRating.toFixed(1);

    await farmer.save();
    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET COMMENTS BY PRODUCT ID

export const getCommentsByProductId = async (req, res) => {
  try {

    const { productId } = req.params;
    const comments = await CommentModel.find({
      productId
    })
      .populate("userId", "fullName img")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalComments: comments.length,
      comments
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET COMMENTS BY FARMER

export const getCommentsByFarmer = async (req, res) => {
  try {

    const { farmerId } = req.params;
    const products = await ProductModel.find({
      farmerId
    })
      .select("name productImageUrl");

    const productIds = products.map((item) => item.id || item._id);

    const comments = await CommentModel.find({
      productId: { $in: productIds }
    })
      .populate("userId", "fullName img")
      .populate("productId", "name productImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalProducts: products.length,
      totalComments: comments.length,
      comments
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { commentId } = req.params;
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await CommentModel.findByIdAndDelete(commentId);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};