import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, blogImageUrl } = req.body;

    const blog = await Blog.create({
      farmerId: req.user._id,
      title,
      content,
      blogImageUrl
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("farmerId", "fullName farmName farmImageUrl")
      .sort("-createdAt");

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getBlogsByFarmer = async (req, res) => {
  try {
    const { id } = req.params; 
    const blogs = await Blog.find({ farmerId: id })
      .sort("-createdAt");

    if (!blogs) {
      return res.status(404).json({ 
        success: false, 
        message: "No blogs found for this farmer" 
      });
    }

    res.status(200).json({ 
      success: true, 
      count: blogs.length, 
      data: blogs 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};