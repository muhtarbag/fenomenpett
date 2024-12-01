import { useState } from "react";
import { Submission } from "../hooks/useSubmissions";
import { SubmissionCard } from "../SubmissionCard";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

interface PendingSubmissionsProps {
  submissions: Submission[];
  isLoading: boolean;
}

export const PendingSubmissions = ({ submissions, isLoading }: PendingSubmissionsProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleToggleSelect = () => {
    setShowSelect(!showSelect);
    setSelectedIds([]);
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  if (isLoading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      {submissions.length > 0 && (
        <div className="flex justify-end mb-4">
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