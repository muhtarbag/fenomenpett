import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Submission {
  id: number;
  username: string;
  imageUrl: string;
  comment: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  actionTimestamp?: string;
}

const Admin = () => {
  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: () =>
      Promise.resolve([
        {
          id: 1,
          username: "new_helper",
          imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
          comment: "Bu kediyi buldum ve biraz mama verdim",
          timestamp: "2024-02-20T10:00:00Z",
          status: 'pending'
        },
        {
          id: 2,
          username: "animal_lover",
          imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
          comment: "Sokak köpeğine yardım ettim",
          timestamp: "2024-02-19T15:30:00Z",
          status: 'approved',
          actionTimestamp: "2024-02-19T16:00:00Z"
        },
        {
          id: 3,
          username: "pet_friend",
          imageUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467",
          comment: "Uygunsuz içerik",
          timestamp: "2024-02-18T09:15:00Z",
          status: 'rejected',
          actionTimestamp: "2024-02-18T10:00:00Z"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const SubmissionCard = ({ submission }: { submission: Submission }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up">
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
              Gönderim: {formatDate(submission.timestamp)}
            </p>
            {submission.actionTimestamp && (
              <p className="text-sm text-gray-500">
                İşlem: {formatDate(submission.actionTimestamp)}
              </p>
            )}
          </div>
          {submission.status !== 'pending' && (
            <span className={`px-3 py-1 rounded-full text-sm ${
              submission.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {submission.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{submission.comment}</p>
        {submission.status === 'pending' && (
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
        )}
      </div>
    </div>
  );

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Gönderileri Yönet
        </h1>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock size={16} />
              Bekleyen ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <Check size={16} />
              Onaylanan ({approvedSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <X size={16} />
              Reddedilen ({rejectedSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingSubmissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
              {pendingSubmissions.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                  Bekleyen gönderi bulunmuyor
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedSubmissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
              {approvedSubmissions.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                  Onaylanmış gönderi bulunmuyor
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rejectedSubmissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
              {rejectedSubmissions.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                  Reddedilmiş gönderi bulunmuyor
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;