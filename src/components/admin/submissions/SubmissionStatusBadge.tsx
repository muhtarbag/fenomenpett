import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { rejectionReasons } from "../SubmissionActions/RejectButton";
import { differenceInDays } from "date-fns";

interface SubmissionStatusBadgeProps {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  created_at?: string;
}

export const SubmissionStatusBadge = ({ status, rejectionReason, created_at }: SubmissionStatusBadgeProps) => {
  const getDaysRemaining = () => {
    if (!created_at || status !== 'rejected') return null;
    
    const createdDate = new Date(created_at);
    const deleteDate = new Date(createdDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days from creation
    const daysRemaining = differenceInDays(deleteDate, new Date());
    
    return Math.max(0, daysRemaining);
  };

  const daysRemaining = getDaysRemaining();

  const badge = (
    <span className={`px-3 py-1 rounded-full text-sm cursor-help ${
      status === 'approved' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'approved' ? 'Onaylandı' : (
        <span className="flex items-center gap-1">
          Reddedildi
          {daysRemaining !== null && (
            <span className="text-xs bg-red-200 px-1.5 py-0.5 rounded-full ml-1">
              {daysRemaining} gün
            </span>
          )}
        </span>
      )}
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
            {daysRemaining !== null && (
              <p className="text-sm text-red-600 mt-1">
                {daysRemaining} gün sonra otomatik silinecek
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
};