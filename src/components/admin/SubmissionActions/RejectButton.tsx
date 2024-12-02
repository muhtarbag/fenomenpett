import { X } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { Submission } from "../hooks/useSubmissions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface RejectButtonProps {
  submissionId: number;
  mutation: UseMutationResult<
    Submission[],
    Error,
    { id: number; status: 'approved' | 'rejected'; reason?: string },
    unknown
  >;
}

const rejectionReasons = [
  { value: "duplicate", label: "Mükerrer Fotoğraf" },
  { value: "inappropriate", label: "Uygun olmayan Fotoğraf veya içerik" },
  { value: "invalid_username", label: "Kullanıcı Adı Bulunamadı" }
];

export const RejectButton = ({ submissionId, mutation }: RejectButtonProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleReject = () => {
    if (!selectedReason) return;

    console.log('👎 Starting rejection process for submission:', {
      id: submissionId,
      reason: selectedReason,
      timestamp: new Date().toISOString()
    });
    
    mutation.mutate(
      { 
        id: submissionId, 
        status: 'rejected',
        reason: rejectionReasons.find(r => r.value === selectedReason)?.label
      },
      {
        onSuccess: (data) => {
          console.log('✅ Successfully rejected submission:', { 
            id: submissionId, 
            data,
            timestamp: new Date().toISOString()
          });
        },
        onError: (error) => {
          console.error('❌ Error rejecting submission:', { 
            id: submissionId, 
            error,
            timestamp: new Date().toISOString()
          });
        }
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={mutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
          {mutation.isPending ? 'İşleniyor...' : 'Reddet'}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gönderiyi Reddet</AlertDialogTitle>
          <AlertDialogDescription>
            Lütfen reddetme nedenini seçin. Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="flex flex-col space-y-3"
          >
            {rejectionReasons.map((reason) => (
              <div key={reason.value} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label htmlFor={reason.value}>{reason.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            className="bg-danger hover:bg-danger/90"
            disabled={!selectedReason}
          >
            Reddet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};