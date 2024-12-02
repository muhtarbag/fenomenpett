import { SubmissionForm } from "@/components/submit/SubmissionForm";
import { SubmissionRules } from "@/components/submit/SubmissionRules";
import { useState } from "react";
import { Helmet } from "react-helmet";

const Submit = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      <Helmet>
        <title>Sokak Hayvanlarına Yardım Et | FenomenPet Fotoğraf Gönder</title>
        <meta name="description" content="Sokak hayvanlarına yardım ederek bonus kazanın! Mama ve su verdiğiniz anları fotoğraflayıp paylaşın, FenomenPet topluluğuna katılın." />
        <meta name="keywords" content="sokak hayvanları yardım, fenomenpet fotoğraf gönder, hayvan yardımı, bonus kazan" />
        <link rel="canonical" href="https://fenomenpet.com/submit" />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "FenomenPet Fotoğraf Gönder",
            "description": "Sokak hayvanlarına yardım ederek bonus kazanın! Mama ve su verdiğiniz anları fotoğraflayıp paylaşın.",
            "publisher": {
              "@type": "Organization",
              "name": "FenomenPet",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fenomenpet.com/lovable-uploads/a06650c0-2ee1-42dd-9217-cef8bdd67039.png"
              }
            }
          })}
        </script>
      </Helmet>

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
    </>
  );
};

export default Submit;