import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
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
  const { isAuthenticated } = useAuth();

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
      {isAuthenticated && (
        <Button variant="ghost" asChild>
          <Link
            to="/admin"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Yönetici
          </Link>
        </Button>
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
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/d2dc077f-45fe-4cc7-8a4e-162eee6e4314.png" 
                alt="FenomenPet Logo" 
                className="h-8"
              />
            </Link>
            <Navigation />
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/submit" element={<Submit />} />
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;