import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { rejectionReasons } from "@/components/admin/SubmissionActions/RejectButton";

interface Submission {
  id: number;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  comment: string;
  rejection_reason: string | null;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusTranslations = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

const statusDescriptions = {
  pending: "Gönderiniz inceleme aşamasındadır. Lütfen sabırla bekleyiniz.",
  approved: "Tebrikler! Gönderiniz onaylanmıştır.",
  rejected: "", // Removed the redundant message
};

export default function CheckStatus() {
  const [username, setUsername] = useState("");
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null);

  const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["submissions", searchedUsername],
    queryFn: async () => {
      if (!searchedUsername) return [];
      
      console.log('🔍 Fetching submissions for username:', searchedUsername);
      
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("submissions")
        .select("*")
        .eq("username", searchedUsername)
        .order("created_at", { ascending: false });

      if (submissionsError) {
        console.error('❌ Error fetching submissions:', submissionsError);
        toast.error("Gönderiler yüklenirken bir hata oluştu");
        throw submissionsError;
      }

      console.log('✅ Fetched submissions:', submissionsData);
      return submissionsData || [];
    },
    enabled: !!searchedUsername,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Lütfen kullanıcı adı girin");
      return;
    }
    setSearchedUsername(username.trim());
  };

  const getRejectionReason = (reason: string | null) => {
    if (!reason) return 'Red sebebi belirtilmemiş';
    return rejectionReasons[reason as keyof typeof rejectionReasons]?.description || 'Red sebebi belirtilmemiş';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Gönderi Durumu Sorgula</h1>
        
        <form onSubmit={handleSearch} className="space-y-4 mb-8">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full">Sorgula</Button>
        </form>

        {isLoadingSubmissions && (
          <div className="text-center text-gray-500 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Yükleniyor...</p>
          </div>
        )}

        {searchedUsername && submissions.length === 0 && !isLoadingSubmissions && (
          <div className="text-center text-gray-500 bg-gray-50 rounded-lg p-8">
            <p className="text-lg">Gönderi bulunamadı</p>
            <p className="text-sm mt-2">Lütfen bilgilerinizi kontrol edip tekrar deneyin</p>
          </div>
        )}

        {submissions.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Detay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[submission.status || 'pending']}>
                          {statusTranslations[submission.status || 'pending']}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm font-medium mb-1">
                          {statusDescriptions[submission.status || 'pending']}
                        </p>
                        {submission.status === 'rejected' && (
                          <p className="text-sm text-red-600">
                            {getRejectionReason(submission.rejection_reason)}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}