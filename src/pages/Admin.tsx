import { useState } from "react";
import { Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Submission {
  id: number;
  username: string;
  imageUrl: string;
  comment: string;
  timestamp: string;
}

const Admin = () => {
  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["pending-submissions"],
    queryFn: () =>
      Promise.resolve([
        {
          id: 1,
          username: "new_helper",
          imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
          comment: "Bu kediyi buldum ve biraz mama verdim",
          timestamp: "2024-02-20T10:00:00Z",
        },
      ]),
  });

  const handleApprove = async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Fotoğraf onaylandı ve bonus 48 saat içinde hesabınıza tanımlanacak!");
  };

  const handleReject = async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.error("Fotoğraf reddedildi - kurallara uygun değil");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Gönderileri Yönet
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up"
            >
              <img
                src={submission.imageUrl}
                alt={`${submission.username} tarafından gönderildi`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      @{submission.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(submission.timestamp).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{submission.comment}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(submission.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-success text-white rounded-md hover:bg-success/90 transition-colors"
                  >
                    <Check size={20} />
                    Onayla
                  </button>
                  <button
                    onClick={() => handleReject(submission.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors"
                  >
                    <X size={20} />
                    Reddet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            İncelenecek gönderi bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;