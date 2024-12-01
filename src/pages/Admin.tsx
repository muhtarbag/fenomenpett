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
  // In a real app, this would fetch from an API
  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["pending-submissions"],
    queryFn: () =>
      Promise.resolve([
        {
          id: 1,
          username: "pending_user",
          imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
          comment: "Check out this amazing view!",
          timestamp: "2024-02-20T10:00:00Z",
        },
      ]),
  });

  const handleApprove = async (id: number) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Post approved!");
  };

  const handleReject = async (id: number) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Post rejected");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Moderate Submissions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up"
            >
              <img
                src={submission.imageUrl}
                alt={`Submitted by ${submission.username}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      @{submission.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(submission.timestamp).toLocaleString()}
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
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(submission.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors"
                  >
                    <X size={20} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No pending submissions to review
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;