import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Submission {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  updated_at: string;
}

export const SubmissionCard = ({ submission }: { submission: Submission }) => {
  const queryClient = useQueryClient();
  
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      const action = variables.status === 'approved' ? 'onaylandı' : 'reddedildi';
      toast.success(`Fotoğraf ${action}`);
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error) => {
      toast.error("Bir hata oluştu: " + error.message);
    }
  });

  const handleApprove = (id: number) => {
    updateStatus({ id, status: 'approved' });
  };

  const handleReject = (id: number) => {
    updateStatus({ id, status: 'rejected' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up">
      <img
        src={submission.image_url}
        alt={`${submission.username} tarafından gönderildi`}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-semibold text-gray-900">
              @{submission.username}
            </p>
            <p className="text-sm text-gray-500">
              Gönderim: {formatDate(submission.created_at)}
            </p>
            {submission.updated_at !== submission.created_at && (
              <p className="text-sm text-gray-500">
                İşlem: {formatDate(submission.updated_at)}
              </p>
            )}
          </div>
          {submission.status !== 'pending' && (
            <span className={`px-3 py-1 rounded-full text-sm ${
              submission.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {submission.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{submission.comment}</p>
        {submission.status === 'pending' && (
          <div className="flex gap-4">
            <button
              onClick={() => handleApprove(submission.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-success text-white rounded-md hover:bg-success/90 transition-colors"
            >
              <Check size={20} />
              Onayla
            </button>
            <button
              onClick={() => handleReject(submission.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors"
            >
              <X size={20} />
              Reddet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const SubmissionsList = () => {
  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  return {
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    SubmissionCard
  };
};