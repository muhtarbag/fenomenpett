import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, FileText, Search, Menu, Home } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      to: "/",
      icon: <Home size={20} />,
      label: "Ana Sayfa",
    },
    {
      to: "/submit",
      icon: <Upload size={20} />,
      label: "Fotoğraf Gönder",
    },
    {
      to: "/check-status",
      icon: <Search size={20} />,
      label: "Durum Sorgula",
    },
    {
      to: "/blog",
      icon: <FileText size={20} />,
      label: "Blog",
    },
  ];

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menü</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          {navigationItems.map((item) => (
            <SheetClose asChild key={item.to}>
              <Link to={item.to}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            </SheetClose>
          ))}
          {user?.email === "admin@fenomenpet.com" && (
            <SheetClose asChild>
              <Link to="/admin">
                <Button variant="ghost" className="w-full justify-start h-12 text-base">
                  Yönetim
                </Button>
              </Link>
            </SheetClose>
          )}
          {user && (
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => logout()}
              >
                <LogOut size={20} />
                Çıkış Yap
              </Button>
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex items-center gap-4">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {navigationItems.map((item) => (
          <Link key={item.to} to={item.to} className="text-gray-600 hover:text-gray-900">
            <Button variant="ghost" className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </Button>
          </Link>
        ))}
        
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
            onClick={() => logout()}
          >
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </div>
  );
};