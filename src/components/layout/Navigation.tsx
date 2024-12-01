import { Link } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const NavItems = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated, logout } = useAuth();

  return (
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
            onClick={() => logout()}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </>
      )}
    </div>
  );
};

export const Navigation = () => {
  const isMobile = useIsMobile();

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