import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft, Star, Trash2, Send, MessageSquare, ChevronDown, ChevronUp, StarHalf, Ban } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations: t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [qty, setQty] = useState(1);

  // Comment States
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Token decode
  const token = localStorage.getItem("token");
  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUserId = decoded.id || decoded._id;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comment/product/${id}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setAllProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching all products:", err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
  }, [product]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const userToken = localStorage.getItem("token");
    if (!userToken) {
      toast.error("Please login to post a review!");
      return;
    }

    const payload = { productId: id, comment: commentText, rating: rating };

    setCommentLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/comment/create",
        payload,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      if (res.data.success) {
        toast.success("Review posted successfully!");
        setCommentText("");
        setRating(5);
        fetchComments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    // SweetAlert2 for Confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981", // Emerald color
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      setCommentLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/comment/delete/${commentId}`, config);
        toast.success("Review deleted!");
        fetchComments();
      } catch (err) {
        toast.error("Failed to delete review");
      } finally {
        setCommentLoading(false);
      }
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hr" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " min" + (interval > 1 ? "s" : "") + " ago";
    return "just now";
  };

  if (!product) {
    return (
      <section className="max-w-[1500px] mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-1 mb-8 text-gray-400 hover:text-emerald-600 transition-all duration-200"
        >
          <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium border-b-2 border-transparent group-hover:border-emerald-600">
            {t.back || "Back"}
          </span>
        </button>

        <div className="flex flex-col items-center justify-center py-40 space-y-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div className="text-center">
            <p className="text-emerald-700 font-bold text-lg animate-pulse tracking-wide">
              {t.loading || "Fetching Product Details..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const farmer = product.farmerId;
  const farmerImage = farmer?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const isOwnProfile = loggedInUserId === farmer?._id;

  return (
    <section className="max-w-[1500px] mx-auto px-4 py-10 bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="group cursor-pointer flex items-center gap-1 mb-8 ml-2 text-gray-500 hover:text-emerald-600 transition-all duration-200">
        <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium border-b-2 border-transparent group-hover:border-emerald-600">
          {t.back || "Back"}
        </span>
      </button>

      {/* Main Product Grid */}
      <div className="grid lg:grid-cols-2 gap-12 bg-white p-6  hover:shadow-sm">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img src={product.productImageUrl} alt={product.name} className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="flex flex-col">
          <Link to={isOwnProfile ? `/farmer-dashboard/${farmer?._id}` : `/farmerProfile/${farmer?._id}`} className="inline-block">
            <div className="flex items-center gap-3 mb-6 p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
              <img src={farmerImage} className="w-12 h-12 rounded-full border border-gray-200 object-cover" alt="farmer" />
              <div>
                <h3 className="font-bold text-gray-900 border-b-2 border-transparent group-hover:border-emerald-600 inline-block transition-all">{farmer?.fullName}</h3>
                <p className="text-sm text-gray-500">{farmer?.farmName}</p>
              </div>
            </div>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">₹{product.price}</span>
            <span className="text-gray-500 font-medium">/ {product.unit}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-gray-500">
            Availability: <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>

          <div className="flex items-center gap-6 mt-8">
            <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">Quantity</span>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 gap-6">
              <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="text-gray-500 hover:text-black transition-colors"><Minus size={18} /></button>
              <span className="font-bold w-4 text-center">{qty}</span>
              <button onClick={() => { if (qty < product.stock) setQty(qty + 1); }} className="text-gray-500 hover:text-black transition-colors"><Plus size={18} /></button>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button className="flex-1 bg-black text-white md:px-8 md:py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Buy Now
            </button>
            <button className="flex items-center justify-center gap-2 border-2 border-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all">
              <ShoppingCart size={20} className="hidden md:block"/> Add to Cart
            </button>
          </div>
        </div>
      </div>

     {/* Review Section */}
<div className="mt-12 mb-12">
  <div onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="flex items-center gap-3 cursor-pointer group w-fit mb-8">
    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Reviews</h2>
    <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-emerald-100 transition-all">
      <ChevronDown size={20} className={`text-gray-600 group-hover:text-emerald-600 transition-transform duration-300 ${isCommentsOpen ? "rotate-180" : ""}`} />
    </div>
  </div>

  {isCommentsOpen && (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      {!token ? (
        <div className="bg-emerald-50 border border-emerald-100 p-10 mb-12 text-center shadow-sm">
          <MessageSquare className="mx-auto text-emerald-600 mb-4" size={40} />
          <h3 className="font-bold text-xl text-gray-900 mb-2">Share your thoughts!</h3>
          <p className="text-gray-600 mb-6">You need to be logged in to write a review and rate this product.</p>
          <button 
            onClick={() => navigate("/auth")} 
            className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            Login Now
          </button>
        </div>
      ) : isOwnProfile ? (
        <div className="bg-gray-50 border border-gray-200 p-10 mb-12 text-center hover:shadow-sm  flex flex-col items-center justify-center">
            <div className="bg-red-50 p-4 rounded-full mb-4 border border-red-100">
              <Ban size={40} className="text-red-500 stroke-[2.5px]" />
           </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2  uppercase tracking-tight">
              Action Restricted
          </h3>
           <p className="text-gray-600 font-medium italic">
              Farmers are not allowed to comment on their own product.
         </p>
      </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100  p-6 md:p-10 mb-12 hover:shadow-sm">
          <h3 className="font-bold text-xl mb-6 text-gray-900">Rate Your Experience</h3>
          <form onSubmit={handlePostComment}>
            <div className="max-w-md mb-10">
              <p className="text-sm font-bold text-emerald-600 mb-1 uppercase tracking-wider">Your Rating</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-gray-900">{rating}</span>
                <span className="text-gray-400 font-bold text-xl">/ 5</span>
              </div>
              <input type="range" min="1" max="5" step="0.5" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-600 mt-4" />
            </div>
            <div className="relative mb-6">
              <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your experience..." className="w-full p-6 bg-white border border-gray-200  focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none min-h-[120px] transition-all" required />
            </div>
            <button type="submit" disabled={commentLoading} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
              {commentLoading ? "Posting..." : <><Send size={18} /> Submit Review</>}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white border border-gray-100 p-6 hover:shadow-sm transition-all group">
              <div className="flex gap-4">
                <img src={comment.userId?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-50" alt="user" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-gray-900 leading-tight">{comment.userId?.fullName || "Verified Buyer"}</h4>
                      <span className="text-[10px] font-bold text-gray-500  tracking-tighter">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => {
                          const starVal = i + 1;
                          if (comment.rating >= starVal) return <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />;
                          if (comment.rating > i && comment.rating < starVal) return <StarHalf key={i} size={14} fill="#fbbf24" color="#fbbf24" />;
                          return <Star key={i} size={14} color="#e5e7eb" />;
                        })}
                      </div>
                      {loggedInUserId === (comment.userId?._id || comment.userId) && (
                        <button onClick={() => handleDeleteComment(comment._id)} className="cursor-pointer text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 leading-relaxed font-medium bg-gray-50/50 p-4 border border-gray-300">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 text-gray-400 italic">No reviews yet. Be the first!</div>
        )}
      </div>
    </div>
  )}
</div>

      {/* Recommended Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Recommended Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {allProducts.filter((p) => p._id !== product._id).slice(0, 10).map((item) => (
            <Link key={item._id} to={`/detail/${item._id}`} className="bg-white flex flex-col h-[320px] p-4 hover:shadow-sm transition-shadow duration-200 group border border-transparent hover:border-gray-100">
              <div className="h-[40px] mb-3 overflow-hidden">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">{item.name}</h3>
              </div>
              <div className="relative w-full h-[250px] bg-white flex items-center justify-center overflow-hidden ">
                <img src={item.productImageUrl} alt={item.name} className="w-full h-full object-cover duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}