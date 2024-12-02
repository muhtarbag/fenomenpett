import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ErrorReport {
  username: string;
  email: string;
  contact: string;
  errorMessage: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const report: ErrorReport = await req.json();
    
    const emailContent = `
      <h2>Yeni Hata Bildirimi</h2>
      <p><strong>Kullanıcı Adı:</strong> ${report.username}</p>
      <p><strong>E-posta:</strong> ${report.email}</p>
      <p><strong>İletişim:</strong> ${report.contact}</p>
      <h3>Hata Mesajı:</h3>
      <p>${report.errorMessage}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Fenomenpet <noreply@fenomenpet.com>",
        to: ["destek@fenomenbet.com"],
        subject: "Fenomenpet - Yeni Hata Bildirimi",
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);