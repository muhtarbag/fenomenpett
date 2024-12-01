interface SubmissionStatusBadgeProps {
  status: 'approved' | 'rejected';
}

export const SubmissionStatusBadge = ({ status }: SubmissionStatusBadgeProps) => {
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${
      status === 'approved' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
    </span>
  );
};