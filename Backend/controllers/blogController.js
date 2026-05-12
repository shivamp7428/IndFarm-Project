import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.create({
      farmerId: req.user._id,
      title,
      content,
      blogImageUrl: req.file ? req.file.path : ""
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({success: false,message: error.message});
  }
};
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("farmerId", "fullName farmName img") 
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

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    // check owner
    if (blog.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this blog"
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message
    });
  }
};

