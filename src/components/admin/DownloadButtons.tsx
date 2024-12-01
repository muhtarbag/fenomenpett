import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Submission } from "./hooks/useSubmissions";

interface DownloadButtonsProps {
  approvedSubmissions: Submission[];
}

export const DownloadButtons = ({ approvedSubmissions }: DownloadButtonsProps) => {
  const downloadAsExcel = () => {
    try {
      if (!approvedSubmissions || approvedSubmissions.length === 0) {
        toast.error("İndirilecek onaylanmış gönderi bulunmuyor");
        return;
      }

      const submissionData = formatSubmissionData(approvedSubmissions);
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(submissionData);
      
      XLSX.utils.book_append_sheet(wb, ws, "Onaylanan Kullanıcılar");
      XLSX.writeFile(wb, "onaylanan-kullanicilar.xlsx");
      
      toast.success("Excel dosyası başarıyla indirildi");
    } catch (error) {
      console.error('Excel indirme hatası:', error);
      toast.error("Excel dosyası indirilirken bir hata oluştu");
    }
  };

  const downloadAsCSV = () => {
    try {
      if (!approvedSubmissions || approvedSubmissions.length === 0) {
        toast.error("İndirilecek onaylanmış gönderi bulunmuyor");
        return;
      }

      const submissionData = formatSubmissionData(approvedSubmissions);
      
      const headers = Object.keys(submissionData[0]).join(',');
      const rows = submissionData.map(data => 
        Object.values(data).map(value => `"${value}"`).join(',')
      ).join('\n');
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "onaylanan-kullanicilar.csv");
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("CSV dosyası başarıyla indirildi");
    } catch (error) {
      console.error('CSV indirme hatası:', error);
      toast.error("CSV dosyası indirilirken bir hata oluştu");
    }
  };

  const formatSubmissionData = (submissions: Submission[]) => {
    return submissions.map(sub => ({
      'Kullanıcı Adı': sub.username || '',
      'Gönderim Tarihi': new Date(sub.created_at).toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      'Onay Tarihi': new Date(sub.updated_at).toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={downloadAsExcel}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Download className="h-4 w-4" />
        Excel Olarak İndir
      </Button>
      <Button
        onClick={downloadAsCSV}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Download className="h-4 w-4" />
        CSV Olarak İndir
      </Button>
    </div>
  );
};