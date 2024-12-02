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
  { 
    value: "duplicate_photo", 
    label: "Tekrarlanan (Mükerrer) Fotoğraf",
    description: "Gönderilen görsel, başka bir kullanıcı tarafından daha önce başvuruda kullanılmıştır."
  },
  { 
    value: "inappropriate_photo", 
    label: "Uygun Olmayan Fotoğraf",
    description: "Fotoğraf, sokak hayvanlarını besleme faaliyetini net bir şekilde göstermiyor veya başvuru koşullarına uygun değildir."
  },
  { 
    value: "invalid_username", 
    label: "Hatalı Kullanıcı Adı",
    description: "Başvuru sırasında belirtilen kullanıcı adı eksik ya da yanlış girilmiştir."
  },
  { 
    value: "copied_photo", 
    label: "Kopya (Replika) Fotoğraf",
    description: "Gönderilen fotoğraf, internet üzerinden alınmış bir görsel olarak tespit edilmiştir."
  }
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
        reason: selectedReason // Doğrudan seçilen nedeni gönderiyoruz
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
            className="flex flex-col space-y-4"
          >
            {rejectionReasons.map((reason) => (
              <div key={reason.value} className="flex items-start space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor={reason.value} className="font-medium">
                    {reason.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
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