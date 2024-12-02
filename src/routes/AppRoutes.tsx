import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Submit from "@/pages/Submit";
import Blog from "@/pages/Blog";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import CheckStatus from "@/pages/CheckStatus";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/check-status" element={<CheckStatus />} />
    </Routes>
  );
};