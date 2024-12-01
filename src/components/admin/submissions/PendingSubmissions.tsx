import { useState } from "react";
import { Submission } from "../hooks/useSubmissions";
import { SubmissionCard } from "../SubmissionCard";
import { Button } from "@/components/ui/button";
import { CheckSquare, Check, X } from "lucide-react";
import { useSubmissionMutation } from "../hooks/useSubmissionMutation";
import { toast } from "sonner";

interface PendingSubmissionsProps {
  submissions: Submission[];
  isLoading: boolean;
}

export const PendingSubmissions = ({ submissions, isLoading }: PendingSubmissionsProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const mutation = useSubmissionMutation();

  const handleToggleSelect = () => {
    setShowSelect(!showSelect);
    setSelectedIds([]);
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev => {
      const newIds = prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id];
      return newIds;
    });
  };

  const handleBulkAction = async (status: 'approved' | 'rejected') => {
    if (selectedIds.length === 0) {
      toast.error("Lütfen en az bir gönderi seçin");
      return;
    }

    const action = status === 'approved' ? 'onaylanıyor' : 'reddediliyor';
    const loadingToast = toast.loading(`Seçili gönderiler ${action}...`);

    try {
      for (const id of selectedIds) {
        await mutation.mutateAsync({ id, status });
      }

      const actionCompleted = status === 'approved' ? 'onaylandı' : 'reddedildi';
      toast.success(`${selectedIds.length} gönderi başarıyla ${actionCompleted}`);
      setShowSelect(false);
      setSelectedIds([]);
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  if (isLoading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900">Bekleyen Gönderiler</h2>
        <div className="flex items-center gap-2">
          {showSelect && selectedIds.length > 0 && (
            <>
              <Button
                variant="default"
                onClick={() => handleBulkAction('approved')}
                className="bg-success hover:bg-success/90 text-white flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Seçilenleri Onayla ({selectedIds.length})
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleBulkAction('rejected')}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Seçilenleri Reddet ({selectedIds.length})
              </Button>
            </>
          )}
          <Button
            variant={showSelect ? "secondary" : "outline"}
            onClick={handleToggleSelect}
            className="flex items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            {showSelect ? 'Seçimi İptal Et' : 'Toplu İşlem'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {submissions.map((submission) => (
          <SubmissionCard 
            key={submission.id} 
            submission={submission}
            showSelect={showSelect}
            isSelected={selectedIds.includes(submission.id)}
            onSelect={handleSelect}
          />
        ))}
        {submissions.length === 0 && (
          <div className="text-center text-gray-500 p-4 bg-white rounded-lg">
            Bekleyen gönderi bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
};