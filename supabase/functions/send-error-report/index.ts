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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if RESEND_API_KEY is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service is not configured properly");
    }

    const report: ErrorReport = await req.json();
    
    // Validate required fields
    if (!report.username || !report.email || !report.contact || !report.errorMessage) {
      throw new Error("All fields are required");
    }
    
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
      console.error("Resend API Error:", error);
      throw new Error("Failed to send email");
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-error-report function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred"
      }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);