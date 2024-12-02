interface SubmissionImageProps {
  imageUrl: string;
  username: string;
  transactionId?: string;
}

export const SubmissionImage = ({ imageUrl, username, transactionId }: SubmissionImageProps) => {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={`${username} tarafından gönderildi`}
        className="w-full h-64 object-cover"
        onError={(e) => {
          console.error('❌ Image load error:', imageUrl);
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      {transactionId && (
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm font-mono">
          {transactionId}
        </div>
      )}
    </div>
  );
};