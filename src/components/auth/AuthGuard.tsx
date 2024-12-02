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
    console.log('🔒 AuthGuard: Checking authentication...', {
      isAuthenticated,
      userEmail: user?.email,
      requireAdmin
    });

    if (!isAuthenticated) {
      console.log('❌ AuthGuard: User not authenticated, redirecting to login');
      toast.error("Bu sayfaya erişmek için giriş yapmalısınız");
      navigate("/login");
      return;
    }

    if (requireAdmin && user?.email !== "admin@fenomenpet.com") {
      console.log('❌ AuthGuard: User not admin, redirecting to home');
      toast.error("Bu sayfaya erişim yetkiniz yok");
      navigate("/");
      return;
    }

    console.log('✅ AuthGuard: Authentication check passed');
  }, [isAuthenticated, user, navigate, requireAdmin]);

  if (!isAuthenticated || (requireAdmin && user?.email !== "admin@fenomenpet.com")) {
    return null;
  }

  return <>{children}</>;
};