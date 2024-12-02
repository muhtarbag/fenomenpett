import { SubmissionForm } from "@/components/submit/SubmissionForm";
import { SubmissionRules } from "@/components/submit/SubmissionRules";
import { useState } from "react";

const Submit = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {!isSubmitted && (
          <>
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
              Patili Dostlarımıza Destek Oluyoruz. FenomenPet Kazandırır !
            </h1>
            <SubmissionRules />
          </>
        )}
        <div className="space-y-8">
          <SubmissionForm onSubmitSuccess={() => setIsSubmitted(true)} />
        </div>
      </div>
    </div>
  );
};

export default Submit;