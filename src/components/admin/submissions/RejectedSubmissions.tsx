import { useState } from "react";
import { Submission } from "../hooks/useSubmissions";
import { SubmissionCard } from "../SubmissionCard";
import { Button } from "@/components/ui/button";
import { CheckSquare, Check, Trash2 } from "lucide-react";
import { useSubmissionMutation } from "../hooks/useSubmissionMutation";
import { useDeleteSubmissionMutation } from "../hooks/useDeleteSubmissionMutation";
import { toast } from "sonner";

interface RejectedSubmissionsProps {
  submissions: Submission[];
  isLoading: boolean;
}

export const RejectedSubmissions = ({ submissions, isLoading }: RejectedSubmissionsProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const mutation = useSubmissionMutation();
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

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      toast.error("Lütfen en az bir gönderi seçin");
      return;
    }

    const loadingToast = toast.loading("Seçili gönderiler onaylanıyor...");

    try {
      for (const id of selectedIds) {
        await mutation.mutateAsync({ id, status: 'approved' });
      }

      toast.success(`${selectedIds.length} gönderi başarıyla onaylandı`);
      setShowSelect(false);
      setSelectedIds([]);
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
    } finally {
      toast.dismiss(loadingToast);
    }
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
      {submissions.length > 0 && (
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            {showSelect && selectedIds.length > 0 && (
              <>
                <Button
                  variant="default"
                  onClick={handleBulkApprove}
                  className="bg-success hover:bg-success/90 text-white flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Seçilenleri Onayla ({selectedIds.length})
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Seçilenleri Sil ({selectedIds.length})
                </Button>
              </>
            )}
          </div>
          <Button
            variant={showSelect ? "secondary" : "outline"}
            onClick={handleToggleSelect}
            className="flex items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            {showSelect ? 'Seçimi İptal Et' : 'Toplu İşlem'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="col-span-full text-center text-gray-500">
            Reddedilmiş gönderi bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
};