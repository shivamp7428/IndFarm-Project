import { Leaf, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

const Footer = () => {
  const { translations: t } = useTranslation();

  return (
    <footer className="bg-[#111827] text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#16A34A] rounded-2xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                <span className="text-[#16A34A]">{t.kisan}</span>
                <span className="text-white">{t.mitra}</span>
              </h2>
            </div>
            
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-md">
              {t.connectingFarmers}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm">
              <div className="px-3 py-1 bg-[#1F2937] rounded-full text-[#16A34A] text-xs font-medium border border-[#16A34A]/30">
                {t.madeInIndia}
              </div>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 tracking-wide">{t.quickLinks}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">{t.home}</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">{t.products}</a></li>
              <li><a href="/categories" className="hover:text-white transition-colors">Categories</a></li>
              <li><a href="/sell" className="hover:text-white transition-colors">{t.sell}</a></li>
              <li><a href="/orders" className="hover:text-white transition-colors">{t.orders}</a></li>
            </ul>
          </div>

          {/* 3. COMPANY */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 tracking-wide">{t.company}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">{t.aboutUs}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">{t.contactUs}</a></li>
              <li><a href="/careers" className="hover:text-white transition-colors">{t.careers}</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">{t.blog}</a></li>
            </ul>
          </div>

          {/* 4. SUPPORT */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 tracking-wide">{t.support}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/help" className="hover:text-white transition-colors">{t.helpCenter}</a></li>
              <li><a href="/faqs" className="hover:text-white transition-colors">{t.faqs}</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">{t.termsConditions}</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">{t.privacyPolicy}</a></li>
              <li><a href="/refund" className="hover:text-white transition-colors">{t.refundPolicy}</a></li>
            </ul>
          </div>

          {/* 5. CONTACT INFO + NEWSLETTER */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold mb-5 tracking-wide">{t.getInTouch}</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#16A34A] mt-0.5" />
                <div className="text-sm">
                  Bhopal, Madhya Pradesh - 462001
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#16A34A]" />
                <span className="text-sm">+91 9876543210</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#16A34A]" />
                <span className="text-sm">support@kisanmitra.in</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-medium mb-3">{t.stayUpdated}</h4>
              <p className="text-xs text-gray-400 mb-4">
                Get fresh produce alerts, price updates &amp; seasonal offers
              </p>
              
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-[#1F2937] border border-gray-700 focus:border-[#16A34A] rounded-l-2xl px-5 py-3 text-sm flex-1 outline-none transition-colors"
                />
                <button className="bg-[#16A34A] hover:bg-[#15803D] px-6 rounded-r-2xl font-semibold text-sm transition-all active:scale-95">
                  {t.subscribe}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-400">
            © 2026 KisanMitra. {t.allRightsReserved}
          </div>
          
          <div className="flex items-center gap-6 text-xs">
            <a href="/privacy" className="hover:text-white transition-colors">{t.privacyPolicy}</a>
            <a href="/terms" className="hover:text-white transition-colors">{t.termsConditions}</a>
            <a href="/sitemap" className="hover:text-white transition-colors">{t.sitemap}</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;