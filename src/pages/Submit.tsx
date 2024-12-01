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
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Thank you for your submission! It will be reviewed within 48 hours.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Submit Your Stray Animal Care Photo
        </h1>

        {/* Rules Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-up">
          <h2 className="text-xl font-semibold mb-4">Rules of Participation</h2>
          <ul className="space-y-2 text-gray-600">
            <li>1. No deposit required</li>
            <li>2. Photo must show you feeding/giving water to stray cats or dogs</li>
            <li>3. No face or surroundings details required</li>
            <li>4. Username required before photo upload</li>
            <li>5. 500 TL bonus will be credited within 48 hours</li>
            <li>6. Bonus requires reaching 5000 TL and 1000 TL shooting transaction</li>
            <li>7. Internet replica photos are not accepted</li>
            <li>8. Thank you for helping stray animals!</li>
            <li className="font-medium text-primary">9. Don't forget to write your comment!</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md animate-fade-up">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {preview ? (
                <div className="space-y-2">
                  <img
                    src={preview}
                    alt="Preview"
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
                    Remove photo
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <div className="text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                    >
                      <span>Upload a photo</span>
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
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe how you helped the stray animal..."
                required
              />
              <div className="text-sm text-gray-500">
                <p className="font-medium">Example comments:</p>
                <p>#Fenomenpet Fenomenbet Paw Friendly</p>
                <p>#Fenomenbet - Fenomenbet Paws also wins!</p>
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
            {isSubmitting ? "Submitting..." : "Submit Photo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Submit;