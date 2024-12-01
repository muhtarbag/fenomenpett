import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/logo.gif" 
                alt="FenomenPet Logo" 
                className="h-8 w-auto"
                style={{
                  imageRendering: 'pixelated',
                  WebkitImageRendering: 'pixelated',
                  MozImageRendering: 'pixelated',
                  msImageRendering: 'pixelated'
                } as React.CSSProperties}
              />
            </Link>
            <Navigation />
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};