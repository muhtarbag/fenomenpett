import { useState } from "react";
import { Submission } from "../hooks/useSubmissions";
import { SubmissionCard } from "../SubmissionCard";
import { Button } from "@/components/ui/button";
import { CheckSquare, Trash2 } from "lucide-react";
import { useDeleteSubmissionMutation } from "../hooks/useDeleteSubmissionMutation";
import { toast } from "sonner";

interface ApprovedSubmissionsProps {
  submissions: Submission[];
  isLoading: boolean;
}

export const ApprovedSubmissions = ({ submissions, isLoading }: ApprovedSubmissionsProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const deleteMutation = useDeleteSubmissionMutation();

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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Lütfen en az bir gönderi seçin");
      return;
    }

    const loadingToast = toast.loading("Seçili gönderiler siliniyor...");

    try {
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id);
      }

      toast.success(`${selectedIds.length} gönderi başarıyla silindi`);
      setShowSelect(false);
      setSelectedIds([]);
    } catch (error) {
      toast.error("Silme işlemi sırasında bir hata oluştu");
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
        <h2 className="text-lg font-semibold text-gray-900">Onaylanan Gönderiler</h2>
        <div className="flex items-center gap-2">
          {showSelect && selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Seçilenleri Sil ({selectedIds.length})
            </Button>
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
            Onaylanmış gönderi bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
};