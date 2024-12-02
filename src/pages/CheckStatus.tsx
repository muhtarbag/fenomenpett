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
}

interface RejectedSubmission {
  id: number;
  username: string;
  reason: string;
  created_at: string;
  comment: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusTranslations = {
  pending: "Değerlendirme Sürecinde",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export default function CheckStatus() {
  const [username, setUsername] = useState("");
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null);

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["submissions", searchedUsername],
    queryFn: async () => {
      if (!searchedUsername) return [];
      
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("submissions")
        .select("*")
        .eq("username", searchedUsername)
        .order("created_at", { ascending: false });

      if (submissionsError) {
        toast.error("Gönderiler yüklenirken bir hata oluştu");
        throw submissionsError;
      }

      const { data: rejectedData, error: rejectedError } = await supabase
        .from("rejected_submissions")
        .select("*")
        .eq("username", searchedUsername)
        .order("created_at", { ascending: false });

      if (rejectedError) {
        toast.error("Reddedilen gönderiler yüklenirken bir hata oluştu");
        throw rejectedError;
      }

      return [...(submissionsData || []), ...(rejectedData || [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!searchedUsername,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Lütfen bir kullanıcı adı girin");
      return;
    }
    setSearchedUsername(username.trim());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gönderi Durumu Sorgula</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4 max-w-md">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adınızı girin"
            className="flex-1"
          />
          <Button type="submit">Sorgula</Button>
        </div>
      </form>

      {isLoadingSubmissions && (
        <div className="text-center text-gray-500">Yükleniyor...</div>
      )}

      {searchedUsername && submissions?.length === 0 && !isLoadingSubmissions && (
        <div className="text-center text-gray-500">
          Bu kullanıcı adına ait gönderi bulunamadı
        </div>
      )}

      {submissions && submissions.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Açıklama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {new Date(submission.created_at).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        "reason" in submission
                          ? statusColors.rejected
                          : statusColors[submission.status]
                      }
                    >
                      {"reason" in submission
                        ? statusTranslations.rejected
                        : statusTranslations[submission.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {submission.comment}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {"reason" in submission ? submission.reason : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}