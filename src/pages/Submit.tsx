import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Submit = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !image || !comment) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Gönderiniz için teşekkürler! 48 saat içinde incelenecektir.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Sokak Hayvanı Yardım Fotoğrafı Gönder
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-up">
          <h2 className="text-xl font-semibold mb-4">Katılım Kuralları</h2>
          <ul className="space-y-2 text-gray-600">
            <li>1. Depozito gerekmiyor</li>
            <li>2. Fotoğraf sokak kedilerine veya köpeklerine mama/su verdiğinizi göstermeli</li>
            <li>3. Yüz veya çevre detayları gerekli değil</li>
            <li>4. Fotoğraf yüklemeden önce kullanıcı adı gerekli</li>
            <li>5. 500 TL bonus 48 saat içinde tanımlanacak</li>
            <li>6. Bonus için 5000 TL ve 1000 TL çekim işlemi gerekli</li>
            <li>7. İnternetten kopyalanan fotoğraflar kabul edilmez</li>
            <li>8. Sokak hayvanlarına yardım ettiğiniz için teşekkürler!</li>
            <li className="font-medium text-primary">9. Yorumunuzu yazmayı unutmayın!</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md animate-fade-up">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğraf
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {preview ? (
                <div className="space-y-2">
                  <img
                    src={preview}
                    alt="Önizleme"
                    className="max-h-64 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Fotoğrafı kaldır
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <div className="text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                    >
                      <span>Fotoğraf yükle</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG - max 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yorum
            </label>
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Sokak hayvanına nasıl yardım ettiğinizi anlatın..."
                required
              />
              <div className="text-sm text-gray-500">
                <p className="font-medium">Örnek yorumlar:</p>
                <p>#Fenomenpet Fenomenbet Pati Dostu</p>
                <p>#Fenomenbet - Fenomenbet Patiler de kazanır!</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Gönderiliyor..." : "Fotoğraf Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Submit;