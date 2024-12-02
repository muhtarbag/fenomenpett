import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Bu sayfaya erişmek için giriş yapmalısınız");
      navigate("/login");
      return;
    }

    if (requireAdmin && user?.email !== "admin@fenomenpet.com") {
      toast.error("Bu sayfaya erişim yetkiniz yok");
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate, requireAdmin]);

  if (!isAuthenticated || (requireAdmin && user?.email !== "admin@fenomenpet.com")) {
    return null;
  }

  return <>{children}</>;
};