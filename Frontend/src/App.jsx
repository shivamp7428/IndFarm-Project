import React, { useState } from 'react';
import { ShoppingBag, Search, Package, User, ChevronRight, CheckCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './views/Home/Hero';
import { Categories } from './views/Home/Categories';
import { ProductCard } from './components/ProductCard';
import { Stats } from './views/Home/Stats';
import { Marketplace } from './views/Marketplace';
import { ProductDetail } from './views/ProductDetail';
import { FarmerProfile } from './views/FarmerProfile';
import { UserDashboard } from './views/UserDashboard';
import { FarmerDashboard } from './views/FarmerDashboard';
import { Chat } from './views/Chat';
import { PRODUCTS as INITIAL_PRODUCTS, FARMERS } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { AIChatbot } from './components/AIChatbot';

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [currentView, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    setCart(prev => [...prev, productId]);
  };

  const addProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const navigateToProduct = (product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-12 pb-20">
            <Hero setView={setView} />
            <div className="px-6 md:px-12 max-w-7xl mx-auto -mt-16 relative z-20">
              <Categories />
            </div>
            
            <section className="px-6 md:px-12 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="font-heading text-3xl font-bold">Today's Fresh Deals</h2>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Harvested within last 12 hours</p>
                </div>
                <button 
                  onClick={() => setView('marketplace')}
                  className="text-primary font-bold hover:underline flex items-center gap-2"
                >
                  View Full Market <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => navigateToProduct(product)}
                    onAddToCart={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                  />
                ))}
              </div>
            </section>

            <Stats />

            {/* Amazon-style "KisanMitra Prime" Section */}
            <section className="px-6 md:px-12 max-w-7xl mx-auto py-16 bg-text-dark rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
              <div className="flex-1 space-y-6 z-10">
                <div className="inline-block bg-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Exclusive for Members</div>
                <h2 className="font-heading text-5xl font-bold">KisanMitra <span className="text-accent underline underline-offset-8 font-serif">Prime</span></h2>
                <p className="text-lg opacity-80 max-w-md italic">"Connecting you to the roots. Get unlimited same-day deliveries and direct video calls with your farmers."</p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <CheckCircle size={16} className="text-primary" /> <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <CheckCircle size={16} className="text-primary" /> <span>Farm Traceability</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative z-10">
                 <img src="https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=1000" className="rounded-3xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700 h-80 object-cover w-full" alt="Fresh box" />
              </div>
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            </section>
          </div>
        );
      case 'marketplace':
        return <Marketplace products={products} onProductClick={navigateToProduct} onAddToCart={addToCart} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            setView={setView}
          />
        ) : null;
      case 'farmer-profile':
        return <FarmerProfile farmer={FARMERS[0]} onProductClick={navigateToProduct} />;
      case 'user-dashboard':
        return <UserDashboard setView={setView} />;
      case 'farmer-dashboard':
        return <FarmerDashboard setView={setView} onAddProduct={addProduct} />;
      case 'chat':
        return <Chat setView={setView} />;
      default:
        return <div>View not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-bg-warm selection:bg-primary/20">
      <Navbar currentView={currentView} setView={setView} cartCount={cart.length} />
      <main className="min-h-[calc(100vh-80px)] pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AIChatbot />

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex items-center justify-around h-16 px-4 z-50 shadow-[0_-5px_20px_rgba(46,125,50,0.05)]">
        {[
          { id: 'home', icon: <div className="p-2 bg-primary/10 rounded-xl text-primary"><ShoppingBag size={20} /></div>, label: 'Home' },
          { id: 'marketplace', icon: <div className="p-2"><Search size={20} /></div>, label: 'Shop' },
          { id: 'user-dashboard', icon: <div className="p-2"><Package size={20} /></div>, label: 'Orders' },
          { id: 'farmer-profile', icon: <div className="p-2"><User size={20} /></div>, label: 'Profile' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1",
              currentView === tab.id ? "text-primary scale-110" : "text-gray-400"
            )}
          >
            {tab.id === currentView ? 
              <div className="p-2 bg-primary rounded-xl text-white shadow-lg transition-all scale-110">{tab.icon.props.children.props ? React.cloneElement(tab.icon.props.children, { size: 20 }) : tab.icon}</div> : 
              tab.icon
            }
          </button>
        ))}
      </nav>
    </div>
  );
}
