import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/476b664f-c46e-465b-8610-bf7caeabfd8e.png" 
                  alt="FenomenPet Logo" 
                  className="h-8"
                />
                <span className="text-xl font-bold text-primary">Pet</span>
              </Link>
              <div className="flex gap-4">
                <Link
                  to="/submit"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Submit Photo
                </Link>
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;