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

interface Submission {
  id: number;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  comment: string;
  transaction_id: string;
}

interface RejectedSubmission {
  id: number;
  username: string;
  reason: string;
  created_at: string;
  comment: string;
  original_submission_id: number | null;
}

type CombinedSubmission = Submission | (RejectedSubmission & { status: 'rejected' });

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

export default function CheckStatus() {
  const [username, setUsername] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null);
  const [searchedTransactionId, setSearchedTransactionId] = useState<string | null>(null);

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["submissions", searchedUsername, searchedTransactionId],
    queryFn: async () => {
      if (!searchedUsername && !searchedTransactionId) return [];
      
      let query = supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchedUsername) {
        query = query.eq("username", searchedUsername);
      }
      if (searchedTransactionId) {
        query = query.eq("transaction_id", searchedTransactionId);
      }

      const { data: submissionsData, error: submissionsError } = await query;

      if (submissionsError) {
        toast.error("Gönderiler yüklenirken bir hata oluştu");
        throw submissionsError;
      }

      // Only fetch rejected submissions if we're searching by username
      if (searchedUsername) {
        const { data: rejectedData, error: rejectedError } = await supabase
          .from("rejected_submissions")
          .select("*")
          .eq("username", searchedUsername)
          .order("created_at", { ascending: false });

        if (rejectedError) {
          toast.error("Reddedilen gönderiler yüklenirken bir hata oluştu");
          throw rejectedError;
        }

        // Transform rejected submissions to include status
        const transformedRejectedData = (rejectedData || []).map(rejected => ({
          ...rejected,
          status: 'rejected' as const
        }));

        return [...(submissionsData || []), ...transformedRejectedData].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) as CombinedSubmission[];
      }

      // If searching by transaction ID, only return submissions data
      return (submissionsData || []) as CombinedSubmission[];
    },
    enabled: !!(searchedUsername || searchedTransactionId),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() && !transactionId.trim()) {
      toast.error("Lütfen kullanıcı adı veya işlem numarası girin");
      return;
    }
    setSearchedUsername(username.trim());
    setSearchedTransactionId(transactionId.trim());
  };

  const getSubmissionInfo = (submission: CombinedSubmission) => {
    if ('reason' in submission) {
      return {
        transactionId: '-',
        status: 'rejected' as const,
        description: submission.reason
      };
    }
    return {
      transactionId: submission.transaction_id,
      status: submission.status || 'pending', // Ensure pending is the default status
      description: '-'
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Gönderi Durumu Sorgula</h1>
        
        <form onSubmit={handleSearch} className="space-y-4 mb-8">
          <div className="space-y-4">
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
            
            <div>
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                İşlem Numarası
              </label>
              <Input
                id="transactionId"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="TRX-XXXXXXXXXXXXXX"
                className="w-full"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Sorgula</Button>
        </form>

        {isLoadingSubmissions && (
          <div className="text-center text-gray-500 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Yükleniyor...</p>
          </div>
        )}

        {(searchedUsername || searchedTransactionId) && submissions?.length === 0 && !isLoadingSubmissions && (
          <div className="text-center text-gray-500 bg-gray-50 rounded-lg p-8">
            <p className="text-lg">Gönderi bulunamadı</p>
            <p className="text-sm mt-2">Lütfen bilgilerinizi kontrol edip tekrar deneyin</p>
          </div>
        )}

        {submissions && submissions.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İşlem No</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Açıklama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const info = getSubmissionInfo(submission);
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-sm">
                        {info.transactionId}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[info.status]}>
                          {statusTranslations[info.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {info.description}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}