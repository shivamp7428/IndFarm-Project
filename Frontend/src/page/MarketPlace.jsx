import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
import { useTranslation } from "../context/LanguageContext";
import { ChevronLeft } from "lucide-react";


function ProductSection() {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || "";

  const { translations: t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        // ✅ FIX HERE
        setProducts(res.data.data || []);

      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
      
      <p className="text-green-700 font-medium animate-pulse">
        {t.loading || "Loading products..."}
      </p>
    </div>
  );
}

  return (
    <section className="max-w-[1500px] mx-auto px-4 py-8 bg-gray-100">
     <button onClick={() => navigate(-1)} className="group cursor-pointer flex items-center gap-1 mb-8 ml-2 text-gray-500 hover:text-emerald-600 transition-all duration-200">
     <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
    <span className="font-medium border-b-2 border-transparent group-hover:border-emerald-600">
      {t.back || "Back"}
    </span>
  </button>

  <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
  <div className="flex flex-col">
    <label className="text-xs font-bold text-gray-500">Min Price</label>
    <input 
      type="number" 
      value={minPrice} 
      onChange={(e) => setMinPrice(Number(e.target.value))}
      className="border rounded px-2 py-1 w-24"
    />
  </div>
  <div className="flex flex-col">
    <label className="text-xs font-bold text-gray-500">Max Price</label>
    <input 
      type="number" 
      value={maxPrice} 
      onChange={(e) => setMaxPrice(Number(e.target.value))}
      className="border rounded px-2 py-1 w-24"
    />
  </div>
</div>
     
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
  {products.length > 0 ? (
    products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      return matchesSearch && matchesPrice;
    }).map((product) => (
      <Link
        key={product._id || product.id}
        to={`/detail/${product._id || product.id}`}
        state={{ product: product }}
        className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-sm transition-shadow duration-200"
      >
        <div className="h-[40px] mb-3 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="relative w-full h-[250px] bg-white flex items-center justify-center overflow-hidden">
          <img
            src={product.productImageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://media.istockphoto.com/id/2211020890/photo/businesswoman-doing-digital-marketing-and-online-advertising-to-target-customers-online-sales.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z9a0Pl7tBfI4JebhhMptU43bpfmQQAt9eV_xtVctI2U=";
            }}
          />
        </div>
      </Link>
    ))
  ) : (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <svg 
        className="w-16 h-16 text-green-300 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium text-green-900">
        {t.noProductsFound || "Product Not Found"}
      </h3>
      <p className="text-gray-500">Try adjusting your filters or check back later.</p>
    </div>
  )}
</div>
    </section>
  );
}

export default ProductSection;