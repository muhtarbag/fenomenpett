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
import { VisitorChart } from "@/components/admin/VisitorChart";
import { LocationMap } from "@/components/admin/LocationMap";
import { Stats } from "@/components/admin/Stats";

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
          username: "animal_lover_2024",
          imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
          comment: "Sokakta bulduğum kediye mama verdim",
          timestamp: "2024-02-20T10:00:00Z",
          status: 'pending'
        },
        {
          id: 2,
          username: "pet_rescuer",
          imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
          comment: "Yaralı köpeği veterinere götürdüm",
          timestamp: "2024-02-19T15:30:00Z",
          status: 'approved',
          actionTimestamp: "2024-02-19T16:00:00Z"
        },
        {
          id: 3,
          username: "cat_whisperer",
          imageUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467",
          comment: "Kedi maması dağıttım",
          timestamp: "2024-02-18T09:15:00Z",
          status: 'rejected',
          actionTimestamp: "2024-02-18T10:00:00Z"
        },
        {
          id: 4,
          username: "dog_friend",
          imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
          comment: "Köpeklere su kabı bıraktım",
          timestamp: "2024-02-17T14:20:00Z",
          status: 'approved',
          actionTimestamp: "2024-02-17T15:00:00Z"
        },
        {
          id: 5,
          username: "helping_paws",
          imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
          comment: "Sokak hayvanlarına yemek verdim",
          timestamp: "2024-02-16T11:45:00Z",
          status: 'pending'
        },
        {
          id: 6,
          username: "animal_aid",
          imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006",
          comment: "Hasta kediyi tedavi ettirdim",
          timestamp: "2024-02-15T16:30:00Z",
          status: 'approved',
          actionTimestamp: "2024-02-15T17:00:00Z"
        },
        {
          id: 7,
          username: "street_feeder",
          imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec",
          comment: "Kuşlara yem verdim",
          timestamp: "2024-02-14T13:10:00Z",
          status: 'rejected',
          actionTimestamp: "2024-02-14T14:00:00Z"
        },
        {
          id: 8,
          username: "pet_guardian",
          imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803",
          comment: "Sokak köpeğine kulübe yaptım",
          timestamp: "2024-02-13T09:00:00Z",
          status: 'pending'
        },
        {
          id: 9,
          username: "animal_protector",
          imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7",
          comment: "Yaralı kuşu veterinere götürdüm",
          timestamp: "2024-02-12T15:45:00Z",
          status: 'approved',
          actionTimestamp: "2024-02-12T16:30:00Z"
        },
        {
          id: 10,
          username: "kind_heart",
          imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
          comment: "Sokak kedilerine süt verdim",
          timestamp: "2024-02-11T10:20:00Z",
          status: 'pending'
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

  const TransactionSummary = () => (
    <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">İşlem Özeti</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-700">Bekleyen</h3>
          <p className="text-2xl font-bold text-yellow-800">{pendingSubmissions.length}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-700">Onaylanan</h3>
          <p className="text-2xl font-bold text-green-800">{approvedSubmissions.length}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold text-red-700">Reddedilen</h3>
          <p className="text-2xl font-bold text-red-800">{rejectedSubmissions.length}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Admin Dashboard
        </h1>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Stats />
        </div>

        {/* Charts and Maps */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-8">
          <VisitorChart />
          <LocationMap />
        </div>

        {/* Submissions Management */}
        <h2 className="text-2xl font-bold mb-8">Submissions Management</h2>
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

        <TransactionSummary />
      </div>
    </div>
  );
};

export default Admin;
