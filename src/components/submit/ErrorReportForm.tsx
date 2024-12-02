import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ErrorReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    errorMessage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://dwzevlymqzpstliaxxgo.supabase.co/functions/v1/send-error-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Hata raporu gönderilemedi");
      }

      toast.success("Hata raporu başarıyla gönderildi!");
      setFormData({
        username: "",
        email: "",
        contact: "",
        errorMessage: "",
      });
    } catch (error) {
      console.error("Error sending report:", error);
      toast.error("Hata raporu gönderilirken bir sorun oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Hata Bildir</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kullanıcı Adı
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
          E-posta
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
          İletişim
        </label>
        <Input
          type="text"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required
          placeholder="İletişim bilgilerinizi girin"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hata Açıklaması
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
  );
};