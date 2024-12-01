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
    console.log('🔄 Toggle select mode:', !showSelect);
    setShowSelect(!showSelect);
    setSelectedIds([]);
  };

  const handleSelect = (id: number) => {
    console.log('✨ Handling selection for submission:', id);
    setSelectedIds(prev => {
      const newIds = prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id];
      console.log('📊 Updated selection:', newIds);
      return newIds;
    });
  };

  const handleBulkAction = async (status: 'approved' | 'rejected') => {
    console.log('🔄 Starting bulk action:', { status, selectedIds });
    
    if (selectedIds.length === 0) {
      console.log('⚠️ No submissions selected');
      toast.error("Lütfen en az bir gönderi seçin");
      return;
    }

    const action = status === 'approved' ? 'onaylanıyor' : 'reddediliyor';
    const loadingToast = toast.loading(`Seçili gönderiler ${action}...`);

    try {
      console.log('📝 Processing submissions:', selectedIds);
      
      // Process each submission sequentially
      for (const id of selectedIds) {
        console.log(`🔄 Processing submission ${id}`);
        await mutation.mutateAsync({ id, status });
      }

      const actionCompleted = status === 'approved' ? 'onaylandı' : 'reddedildi';
      console.log('✅ Bulk action completed successfully');
      toast.success(`${selectedIds.length} gönderi başarıyla ${actionCompleted}`);
      
      // Reset selection state
      setShowSelect(false);
      setSelectedIds([]);
    } catch (error) {
      console.error('❌ Bulk action error:', error);
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
      {submissions.length > 0 && (
        <div className="flex justify-between items-center mb-4">
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
                  variant="default"
                  onClick={() => handleBulkAction('rejected')}
                  className="bg-danger hover:bg-danger/90 text-white flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Seçilenleri Reddet ({selectedIds.length})
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleToggleSelect}
            className="flex items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            {showSelect ? 'Seçimi İptal Et' : 'Seç'}
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
            Bekleyen gönderi bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
};