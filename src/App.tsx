import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                <div className="flex gap-4">
                  <Link
                    to="/submit"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Fotoğraf Gönder
                  </Link>
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Yönetici
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;