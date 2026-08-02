import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Star, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const FarmerReviewSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Naya Unique State Name taaki purane tabs se conflict na ho
  const [reviewListData, setReviewListData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // Isko use karenge UI toggle karne ke liye
  const [currentSection, setCurrentSection] = useState("reviews_view"); 

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

  useEffect(() => {
    const getFarmerReviews = async () => {
      setIsPageLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/comment/farmer/${id}`,
  config
);
        
        setReviewListData(response.data.comments || []);
        
      } catch (err) {
        console.error("Fetch Error:", err);
        setFetchError("Reviews load nahi ho paye");
      } finally {
        setIsPageLoading(false);
      }
    };

    if (id) getFarmerReviews();
  }, [id]);

  if (isPageLoading) return   <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="animate-spin text-emerald-600" size={50} />
      </div>

  return (
    <div className="w-full">
      {currentSection === "reviews_view" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
            
            {reviewListData && reviewListData.length > 0 ? (
              reviewListData.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 p-5 md:p-7 hover:shadow-sm transition-all group ">
                  
                  <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.userId?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        className="w-12 h-12 rounded-full object-cover ring-4 ring-emerald-50 shadow-sm" 
                        alt="user" 
                      />
                      <div className="flex flex-col">
                        <h4 className="font-black text-gray-900 text-sm md:text-base leading-tight">
                          {item.userId?.fullName || "Kharidne Wala"}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400  tracking-widest mt-1">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    {item.productId && (
                      <div 
                        onClick={() => navigate(`/detail/${item.productId._id}`)}
                        className="flex items-center gap-3 cursor-pointer group/prod text-right  p-2 rounded-xl  transition-colors"
                      >
                        <div className="flex flex-col items-end">
                          <h4 className="font-black text-black text-[12px] md:text-sm leading-tight hover:border-b">
                            {item.productId.name}
                          </h4>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={10} 
                                fill={(item.rating || 5) >= i + 1 ? "#fbbf24" : "none"} 
                                color={(item.rating || 5) >= i + 1 ? "#fbbf24" : "#e5e7eb"} 
                              />
                            ))}
                          </div>
                        </div>
                        <img 
                          src={item.productId.productImageUrl || "https://via.placeholder.com/150"} 
                          className="w-12 h-12 rounded-full object-cover border border-gray-200 " 
                          alt="product" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="bg-slate-50 p-4 border border-slate-100  relative">
                      <p className="text-gray-700 leading-relaxed font-medium  text-sm md:text-base">
                        {item.comment}
                      </p>
                      
                      <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-50 rotate-45 border-l border-t border-slate-100"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-gray-50  border-2 border-dashed border-gray-200">
                <Star size={48} className="mx-auto mb-4 text-gray-300 opacity-50" />
                <p className="text-gray-400 font-bold italic tracking-wide">
                   No reviews yet. Be the first!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerReviewSection;