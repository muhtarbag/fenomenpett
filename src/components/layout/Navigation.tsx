import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, FileText, Search, Menu } from "lucide-react";
import { ErrorReportForm } from "@/components/submit/ErrorReportForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const { user, logout } = useAuth();

  const navigationItems = [
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
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          {navigationItems.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button variant="ghost" className="w-full justify-start gap-2">
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
          {user?.email === "admin@fenomenpet.com" && (
            <Link to="/admin">
              <Button variant="ghost" className="w-full justify-start">
                Yönetim
              </Button>
            </Link>
          )}
          {user && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => logout()}
            >
              <LogOut size={20} />
              Çıkış Yap
            </Button>
          )}
          
          <div className="mt-4 border-t pt-4">
            <ErrorReportForm />
          </div>
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