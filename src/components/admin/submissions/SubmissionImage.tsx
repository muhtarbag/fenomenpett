interface SubmissionImageProps {
  imageUrl: string;
  username: string;
}

export const SubmissionImage = ({ imageUrl, username }: SubmissionImageProps) => {
  return (
    <img
      src={imageUrl}
      alt={`${username} tarafından gönderildi`}
      className="w-full h-64 object-cover"
      onError={(e) => {
        console.error('❌ Image load error:', imageUrl);
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  );
};