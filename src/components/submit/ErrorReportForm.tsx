import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ErrorReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "05",
    errorMessage: "",
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Ensure the value starts with 05
    if (!value.startsWith('05')) {
      value = '05';
    }
    
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    
    // Limit to 11 digits (05 + 9 digits)
    value = value.slice(0, 11);
    
    setFormData({ ...formData, contact: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number length
    if (formData.contact.length !== 11) {
      toast.error("Telefon numarası 11 haneli olmalıdır (05 ile başlayıp 9 rakam)");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-error-report', {
        body: formData
      });

      if (error) {
        throw error;
      }

      toast.success("Hata raporu başarıyla gönderildi!");
      setFormData({
        username: "",
        email: "",
        contact: "05",
        errorMessage: "",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending report:", error);
      toast.error("Hata raporu gönderilirken bir sorun oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-white rounded-lg shadow-md"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50"
        >
          <span className="text-xl font-semibold">Hata Bildir</span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı *
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Kullanıcı adınızı girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="E-posta adresinizi girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İletişim *
            </label>
            <Input
              type="tel"
              value={formData.contact}
              onChange={handleContactChange}
              required
              pattern="05[0-9]{9}"
              minLength={11}
              maxLength={11}
              placeholder="05__ ___ __ __"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hata Açıklaması *
            </label>
            <Textarea
              value={formData.errorMessage}
              onChange={(e) => setFormData({ ...formData, errorMessage: e.target.value })}
              required
              placeholder="Karşılaştığınız hatayı detaylı bir şekilde açıklayın"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Gönderiliyor..." : "Hata Bildir"}
          </Button>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
};