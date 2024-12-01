import { useState } from "react";
import { toast } from "sonner";
import { convertToWebP } from "@/utils/imageProcessing";

interface ImageUploadProps {
  image: File | null;
  setImage: (file: File | null) => void;
}

export const ImageUpload = ({ image, setImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        console.log('Processing image...', file);
        const webpFile = await convertToWebP(file);
        setImage(webpFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(webpFile);

        console.log('Image processed successfully');
        toast.success("Fotoğraf başarıyla yüklendi!");
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error("Fotoğraf yüklenirken bir hata oluştu.");
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fotoğraf *
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
  );
};