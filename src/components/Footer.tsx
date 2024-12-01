import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/476b664f-c46e-465b-8610-bf7caeabfd8e.png" 
                alt="FenomenPet Logo" 
                className="h-8"
              />
            </div>
            <p className="text-gray-300">
              Sokak hayvanlarına yardım etmek için bir fotoğraf paylaşın. Başkalarına ilham verin.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-300 hover:text-white transition-colors">
                  Fotoğraf Gönder
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-300">
              <li>E-posta: info@fenomenpet.com</li>
              <li>Telefon: +90 (555) 123-4567</li>
              <li>Adres: İstanbul, Türkiye</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Bizi Takip Edin</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a 
                href="https://instagram.com/fenomenbet_official" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://x.com/FenomenbetTRX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://youtube.com/@fenomenbet-official" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} FenomenPet. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;