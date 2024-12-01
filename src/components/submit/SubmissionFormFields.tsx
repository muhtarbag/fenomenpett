import { ImageUpload } from "./ImageUpload";

interface SubmissionFormFieldsProps {
  username: string;
  setUsername: (username: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  isSubmitting: boolean;
}

export const SubmissionFormFields = ({
  username,
  setUsername,
  comment,
  setComment,
  image,
  setImage,
  isSubmitting
}: SubmissionFormFieldsProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kullanıcı Adı *
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

      <ImageUpload image={image} setImage={setImage} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yorum *
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
    </>
  );
};