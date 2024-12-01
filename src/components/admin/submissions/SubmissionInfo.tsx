import { formatDateTime } from "@/utils/dateFormatters";

interface SubmissionInfoProps {
  username: string;
  createdAt: string;
  updatedAt: string;
}

export const SubmissionInfo = ({ username, createdAt, updatedAt }: SubmissionInfoProps) => {
  return (
    <div>
      <p className="font-semibold text-gray-900">
        @{username || 'İsimsiz Kullanıcı'}
      </p>
      <p className="text-sm text-gray-500">
        Gönderim: {formatDateTime(createdAt)}
      </p>
      {updatedAt && updatedAt !== createdAt && (
        <p className="text-sm text-gray-500">
          İşlem: {formatDateTime(updatedAt)}
        </p>
      )}
    </div>
  );
};