import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SubmissionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center animate-fade-up">
      <img
        src="/lovable-uploads/158fdeca-b966-4efa-8ce7-4b7bdae90615.png"
        alt="Katılımınız için teşekkürler"
        className="max-w-full h-auto rounded-lg shadow-lg"
      />
      <p className="text-lg text-gray-600">
        Ana sayfaya yönlendiriliyorsunuz...
      </p>
    </div>
  );
};