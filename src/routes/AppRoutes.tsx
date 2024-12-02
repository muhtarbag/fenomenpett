import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Submit from "@/pages/Submit";
import Blog from "@/pages/Blog";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import CheckStatus from "@/pages/CheckStatus";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/blog" element={<Blog />} />
      <Route 
        path="/admin" 
        element={
          isAuthenticated ? <Admin /> : <Login />
        } 
      />
      <Route path="/check-status" element={<CheckStatus />} />
    </Routes>
  );
};