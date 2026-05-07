import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import { jwtDecode } from "jwt-decode";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations: t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setAllProducts(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
  }, [product]);


  // token decode
const token = localStorage.getItem("token");

let loggedInUserId = null;

if (token) {
  try {
    const decoded = jwtDecode(token);

    loggedInUserId = decoded.id || decoded._id;
  } catch (error) {
    console.log("Invalid token");
  }
}


  if (!product) {
  return (
    <section className="max-w-[1500px] mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-1 mb-8 text-gray-500 hover:text-emerald-600 transition-all duration-200"
      >
        <ChevronLeft 
          size={20} 
          className="transform group-hover:-translate-x-1 transition-transform duration-200" 
        />
        <span className="font-medium border-b-2 border-transparent group-hover:border-emerald-600">
          {t.back || "Back"}
        </span>
      </button>

      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-green-700 font-medium animate-pulse">
          {t.loading || "Loading products..."}
        </p>
      </div>
    </section>
  );
}


  const farmer = product.farmerId;
  const farmerImage = farmer?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  //for self farmer
  const isOwnProfile = loggedInUserId === farmer?._id;

  return (
    <section className="max-w-[1500px] mx-auto px-4 py-10 bg-gray-50">
      <button onClick={() => navigate(-1)} className="group cursor-pointer flex items-center gap-1 mb-8 ml-2 text-gray-500 hover:text-emerald-600 transition-all duration-200">
     <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
      <span className="font-medium border-b-2 border-transparent group-hover:border-emerald-600">
        {t.back || "Back"}
    </span>
    </button>
      <div className="grid lg:grid-cols-2 gap-12 bg-white p-6 rounded-3xl shadow-sm">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={product.productImageUrl}
            alt={product.name}
            className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col">
          <Link to={  isOwnProfile ? `/farmer-dashboard/${farmer?._id}` : `/farmerProfile/${farmer?._id}`}
          className="inline-block"
          >
            <div className="flex items-center gap-3 mb-6 p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
    
    <img
      src={farmerImage}
      className="w-12 h-12 rounded-full border border-gray-200 object-cover"
      alt="farmer"
    />

    <div>
      <h3 className="font-bold text-gray-900 border-b-2 border-transparent group-hover:border-emerald-600 inline-block transition-all">
        {farmer?.fullName}
      </h3>

      <p className="text-sm text-gray-500">
        {farmer?.farmName}
      </p>
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
            Availability: <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="flex items-center gap-6 mt-8">
            <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">Quantity</span>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 gap-6">
              <button 
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="font-bold w-4 text-center">{qty}</span>
              <button 
                onClick={() => { if (qty < product.stock) setQty(qty + 1); }}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button className="flex-1 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Buy Now
            </button>
            <button className="flex items-center justify-center gap-2 border-2 border-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Recommended Products
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {allProducts
            .filter((p) => p._id !== product._id)
            .slice(0, 10)
            .map((item) => (
              <Link
                key={item._id}
                to={`/detail/${item._id}`}
                className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-sm transition-shadow duration-200 group border border-transparent hover:border-gray-100"
              >
                <div className="h-[40px] mb-3 overflow-hidden">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h3>
                </div>

                <div className="relative w-full h-[250px] bg-white flex items-center justify-center overflow-hidden ">
                  <img
                    src={item.productImageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover  duration-300 "
                    onError={(e) => {
                      e.target.src = "https://media.istockphoto.com/id/2211020890/photo/businesswoman-doing-digital-marketing-and-online-advertising-to-target-customers-online-sales.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z9a0Pl7tBfI4JebhhMptU43bpfmQQAt9eV_xtVctI2U=";
                    }}
                  />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}