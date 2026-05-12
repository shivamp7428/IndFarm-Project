import { ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FarmerHub = () => {
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Get logged in user ID (assuming it's stored in localStorage)
  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser._id || parsedUser.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Fetch farmers from API
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/farmers');
        const data = await response.json();
        
        if (data.success && data.farmers) {
          setFarmers(data.farmers);
          setFilteredFarmers(data.farmers);
        }
      } catch (error) {
        console.error('Error fetching farmers:', error);
        setFarmers([]);
        setFilteredFarmers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFarmers(farmers);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    const filtered = farmers.filter((farmer) => {
      return (
        farmer.fullName?.toLowerCase().includes(query) ||
        farmer.farmName?.toLowerCase().includes(query) ||
        farmer.farmLocation?.toLowerCase().includes(query)
      );
    });

    setFilteredFarmers(filtered);
  }, [searchQuery, farmers]);

  const defaultImage = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";

  // Handle Card Click with Smart Navigation
  const handleFarmerClick = (farmer) => {
    const isOwnProfile = currentUserId && (currentUserId === farmer._id);

    if (isOwnProfile) {
      navigate(`/farmer-dashboard/${farmer._id}`);
    } else {
      navigate(`/farmerProfile/${farmer._id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading farmers...</div>
      </div>
    );
  }

  return (
    <section className="max-w-[1500px] mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group"
        >
          <div className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full border border-gray-300 group-hover:border-gray-400 transition-colors">
            <ArrowLeft size={24} />
          </div>
        </button>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Farmer Hub
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search farmers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6 px-1">
        <p className="text-sm text-gray-600">
          {filteredFarmers.length} Farmers Found
        </p>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer._id}
            onClick={() => handleFarmerClick(farmer)}
            className="bg-white flex flex-col h-[355px] p-4 shadow-none hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            {/* Name & Farm Name */}
            <div className="h-[45px] mb-3 overflow-hidden">
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">
                {farmer.fullName}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {farmer.farmName}
              </p>
            </div>

            {/* Image Container */}
            <div className="relative w-full h-[260px] bg-white flex items-center justify-center overflow-hidden">
              <img
                src={farmer.img || farmer.farmImageUrl || defaultImage}
                alt={farmer.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFarmers.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No farmers found matching your search.</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-[#007185] hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
};

export default FarmerHub;