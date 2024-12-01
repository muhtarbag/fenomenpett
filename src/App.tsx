import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const Navigation = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const NavItems = () => (
    <div className={`${isMobile ? 'flex flex-col space-y-4 p-4' : 'flex items-center gap-4'}`}>
      <Button variant="ghost" asChild>
        <Link
          to="/submit"
          className="text-gray-600 hover:text-primary transition-colors"
        >
          Fotoğraf Gönder
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link
          to="/blog"
          className="text-gray-600 hover:text-primary transition-colors"
        >
          Blog
        </Link>
      </Button>
      {isAuthenticated && (
        <>
          <Button variant="ghost" asChild>
            <Link
              to="/admin"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Yönetici
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <NavItems />
        </DrawerContent>
      </Drawer>
    );
  }

  return <NavItems />;
};

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {location.pathname !== '/login' && (
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
                    WebkitImageRendering: 'pixelated' as 'pixelated'
                  }}
                />
              </Link>
              <Navigation />
            </div>
          </div>
        </nav>
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;