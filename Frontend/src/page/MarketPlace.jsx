import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "../context/LanguageContext";
import { ChevronLeft, Filter, X } from "lucide-react";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { translations: t } = useTranslation();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Mobile Filter State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || "";

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/products");
        
        const fetchedProducts = res.data.data || [];
        setProducts(fetchedProducts);

        const categorySet = new Set();
        fetchedProducts.forEach(product => {
          if (product.category) categorySet.add(product.category.trim());
        });

        const sortedCategories = Array.from(categorySet).sort((a, b) => a.localeCompare(b));
        setCategories(["All", ...sortedCategories]);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setCategories(["All"]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((product) =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    result = result.filter((product) => {
      const price = product.price || 0;
      return price >= minPrice && price <= maxPrice;
    });

    if (showPremiumOnly) {
      result = result.filter((product) => product.isPremium === true || product.premium === true);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice, showPremiumOnly]);

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
  <section className="max-w-[1500px] mx-auto px-4 py-8 bg-gray-100 min-h-screen">
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="group cursor-pointer flex items-center gap-1 mb-6 ml-2 text-gray-500 hover:text-emerald-600 transition-all duration-200"
    >
      <ChevronLeft
        size={20}
        className="transform group-hover:-translate-x-1 transition-transform duration-200"
      />
      <span className="font-medium border-b-2 border-transparent group-hover:border-emerald-600">
        {t.back || "Back"}
      </span>
    </button>

    {/* Mobile Filter Button */}
    <div className="md:hidden flex items-center justify-between mb-6">
      <p className="text-gray-600 font-medium">
        {filteredProducts.length} Products Found
      </p>
      <button
        onClick={() => setShowMobileFilters(true)}
        className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
      >
        <Filter size={20} />
        Filters
      </button>
    </div>

    <div className="flex gap-6">
      <div className="hidden md:block w-72 bg-white p-5 rounded-xl shadow-sm h-fit sticky top-6 self-start">
        <h2 className="font-bold text-xl mb-6 text-gray-800 border-b pb-3">
          Filters
        </h2>

        {/* Premium Filter */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer bg-emerald-50 hover:bg-emerald-100 p-3 rounded-xl transition">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="w-5 h-5 accent-emerald-600"
            />
            <div>
              <p className="font-semibold text-emerald-700">
                Premium Products Only
              </p>
              <p className="text-xs text-emerald-600">
                High quality &amp; verified
              </p>
            </div>
          </label>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
          <div className="space-y-2 max-h-60 overflow-auto pr-2">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  className="accent-emerald-600"
                />
                <span className="text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            Price Range (₹)
          </h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex-1">
              <label className="text-xs text-gray-500">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedCategory("All");
            setMinPrice(0);
            setMaxPrice(10000);
            setShowPremiumOnly(false);
          }}
          className="w-full mt-4 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-700 py-3 rounded-xl font-medium transition-all"
        >
          Clear All Filters
        </button>
      </div>

      <div className="flex-1">
        <div className="hidden md:flex mb-6 justify-between items-center">
          <p className="text-gray-600 font-medium">
            {filteredProducts.length} Products Found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                key={product._id || product.id}
                to={`/detail/${product._id || product.id}`}
                state={{ product }}
                className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden"
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
                      e.target.src =
                        "https://media.istockphoto.com/id/2211020890/photo/businesswoman-doing-digital-marketing-and-online-advertising-to-target-customers-online-sales.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z9a0Pl7tBfI4JebhhMptU43bpfmQQAt9eV_xtVctI2U=";
                    }}
                  />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <h3 className="text-lg font-medium text-gray-800">
                No Products Found
              </h3>
              <p className="text-gray-500 mt-2">
                Try changing your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {showMobileFilters && (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileFilters(false)}
        />

        <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto transition-transform duration-300">
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-2xl text-gray-800">
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={28} />
              </button>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer bg-emerald-50 hover:bg-emerald-100 p-4 rounded-2xl transition">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="w-6 h-6 accent-emerald-600"
                />
                <div>
                  <p className="font-semibold text-emerald-700">
                    Premium Products Only
                  </p>
                  <p className="text-sm text-emerald-600">
                    High quality &amp; verified
                  </p>
                </div>
              </label>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Categories
              </h3>

              <div className="space-y-2 max-h-64 overflow-auto pr-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-emerald-600 w-5 h-5"
                    />
                    <span className="text-gray-700 text-lg">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-3">
                Price Range (₹)
              </h3>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory("All");
                setMinPrice(0);
                setMaxPrice(10000);
                setShowPremiumOnly(false);
              }}
              className="w-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-700 py-4 rounded-2xl font-medium transition-all"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </>
    )}
  </section>
);
}

export default ProductSection;