import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, FileText, Search } from "lucide-react";

export const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <Link to="/submit" className="text-gray-600 hover:text-gray-900">
        <Button variant="ghost" className="flex items-center gap-2">
          <Upload size={20} />
          <span className="hidden sm:inline">Fotoğraf Gönder</span>
        </Button>
      </Link>
      
      <Link to="/check-status" className="text-gray-600 hover:text-gray-900">
        <Button variant="ghost" className="flex items-center gap-2">
          <Search size={20} />
          <span className="hidden sm:inline">Durum Sorgula</span>
        </Button>
      </Link>

      <Link to="/blog" className="text-gray-600 hover:text-gray-900">
        <Button variant="ghost" className="flex items-center gap-2">
          <FileText size={20} />
          <span className="hidden sm:inline">Blog</span>
        </Button>
      </Link>

      {user?.email === "admin@fenomenpet.com" && (
        <Link
          to="/admin"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Yönetim
        </Link>
      )}

      {user && (
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => signOut()}
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Çıkış Yap</span>
        </Button>
      )}
    </div>
  );
};