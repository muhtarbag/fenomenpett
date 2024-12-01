import { SubmissionForm } from "@/components/submit/SubmissionForm";
import { SubmissionRules } from "@/components/submit/SubmissionRules";

const Submit = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Sokak Hayvanı Yardım Fotoğrafı Gönder
        </h1>
        <SubmissionRules />
        <SubmissionForm />
      </div>
    </div>
  );
};

export default Submit;