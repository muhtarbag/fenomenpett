import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { rejectionReasons } from "../SubmissionActions/RejectButton";

interface SubmissionStatusBadgeProps {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export const SubmissionStatusBadge = ({ status, rejectionReason }: SubmissionStatusBadgeProps) => {
  const badge = (
    <span className={`px-3 py-1 rounded-full text-sm cursor-help ${
      status === 'approved' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
    </span>
  );

  if (status === 'rejected' && rejectionReason) {
    const reason = rejectionReasons[rejectionReason as keyof typeof rejectionReasons];
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">
            <p className="font-medium">{reason?.label}</p>
            <p className="text-sm text-muted-foreground">{reason?.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
};