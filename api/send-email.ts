// Vercel Serverless Function for Email Dispatch
// Compatible with Vercel deployment and local serverless runtimes

function getFormattedSender(fromEnv?: string): string {
  if (!fromEnv || !fromEnv.trim()) {
    return "Lafole Academy <onboarding@resend.dev>";
  }
  const trimmed = fromEnv.trim();
  if (trimmed.includes("<") && trimmed.includes(">")) {
    const match = trimmed.match(/^([^<]*)<([^>]+)>/);
    if (match) {
      const namePart = match[1].trim().replace(/^["']|["']$/g, "");
      const emailPart = match[2].trim();
      if (!namePart || namePart.toLowerCase() === "noreply" || namePart.toLowerCase() === "no-reply") {
        return `Lafole Academy <${emailPart}>`;
      }
      return trimmed;
    }
    return trimmed;
  }
  return `Lafole Academy <${trimmed}>`;
}

export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { to, fullName, verificationUrl, courseTitle } = body;

    const recipient = typeof to === "string" ? to.trim().toLowerCase() : "";
    if (!recipient || !recipient.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid recipient email is required" });
    }

    const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : "";
    const hashFallbackUrl = verificationUrl && !verificationUrl.includes('#') 
      ? verificationUrl.replace('/verify-email', '/#/verify-email') 
      : (verificationUrl || "");

    if (resendApiKey) {
      try {
        const sender = getFormattedSender(process.env.EMAIL_FROM);
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: sender,
            reply_to: "admissions@lafole.net",
            to: [recipient],
            subject: `Verify your email for Lafole Academy - ${courseTitle || "Welcome"}`,
            text: `Hello ${fullName || "Student"},\n\nThank you for beginning your enrollment in ${courseTitle || "your course"} at Lafole Academy. Please click the link below to verify your email address:\n${verificationUrl}\n\nAlternative direct link:\n${hashFallbackUrl}\n\nThis link is valid for 24 hours.\n\nWarm regards,\nLafole Academy Registrar`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px;">Verify your email for Lafole Academy</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hello <strong>${fullName || "Student"}</strong>,</p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">Thank you for beginning your enrollment in <strong>${courseTitle || "your course"}</strong> at Lafole Academy. Please click the button below to verify your email address and activate your student account:</p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${verificationUrl}" style="background-color: #22c55e; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">Verify My Email Address</a>
                </div>
                <p style="color: #64748b; font-size: 13px; line-height: 1.5;">If the button does not work, copy and paste this URL into your browser:<br/><a href="${verificationUrl}" style="color: #16a34a; word-break: break-all;">${verificationUrl}</a></p>
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.4; margin-top: 8px;">Alternative direct link:<br/><a href="${hashFallbackUrl}" style="color: #16a34a; word-break: break-all;">${hashFallbackUrl}</a></p>
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">This link is valid for 24 hours. If you did not create this account, you can safely ignore this email.</p>
              </div>
            `
          })
        });

        const resendData = (await emailResponse.json().catch(() => ({}))) as any;

        if (emailResponse.ok) {
          return res.status(200).json({ 
            success: true, 
            delivered: true, 
            provider: "resend",
            id: resendData?.id,
            message: `Verification email delivered to ${recipient}` 
          });
        }

        const isValidationError = resendData?.name === "validation_error" || resendData?.statusCode === 422;
        return res.status(200).json({
          success: true,
          delivered: false,
          restricted: isValidationError,
          simulated: true,
          verificationUrl,
          message: isValidationError 
            ? (resendData?.message || "Resend test domain note: configure custom domain in Resend for non-verified external inboxes, or use instant 1-click verification.")
            : (resendData?.message || "Verification link generated.")
        });
      } catch (resendErr: any) {
        console.warn("[Vercel Email Function] Resend error:", resendErr?.message);
      }
    }

    // Default fallback when RESEND_API_KEY is not yet set in Vercel environment variables
    return res.status(200).json({
      success: true,
      delivered: false,
      simulated: true,
      verificationUrl,
      message: "Verification link generated. Configure RESEND_API_KEY in Vercel project settings for custom transactional SMTP delivery."
    });
  } catch (err: any) {
    console.error("[Vercel Email Function] Error:", err);
    return res.status(500).json({ success: false, message: err?.message || "Failed to process email" });
  }
}
