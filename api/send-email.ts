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
    const { type, to, fullName, verificationUrl, courseTitle, resetCode, expiresInMinutes } = body;

    const recipient = typeof to === "string" ? to.trim().toLowerCase() : "";
    if (!recipient || !recipient.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid recipient email is required" });
    }

    const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : "";
    const sender = getFormattedSender(process.env.EMAIL_FROM);

    // ==========================================
    // Flow 1: 6-Digit Password Reset OTP Code
    // ==========================================
    if (type === 'password_reset' || resetCode) {
      const code = String(resetCode || '').trim();
      const expiry = expiresInMinutes || 15;

      if (!code) {
        return res.status(400).json({ success: false, message: "6-digit reset code is required" });
      }

      if (resendApiKey) {
        try {
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
              subject: `Your Lafole Academy Password Reset Code: ${code}`,
              text: `Hello ${fullName || "Student"},\n\nYour 6-digit password reset verification code is:\n\n${code}\n\nThis verification code expires in ${expiry} minutes.\n\nIf you did not request a password reset, please ignore this email or contact support.\n\nWarm regards,\nLafole Academy Security Team`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #22c55e; color: #ffffff; font-weight: 900; font-size: 24px;">L</div>
                    <h2 style="color: #0f172a; margin-top: 14px; margin-bottom: 4px; font-size: 22px; font-weight: 700;">Password Reset Code</h2>
                    <p style="color: #64748b; font-size: 14px; margin: 0;">Lafole Academy Account Security</p>
                  </div>

                  <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Hello <strong>${fullName || "Student"}</strong>,</p>
                  <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">We received a request to reset the password for your Lafole Academy student account (<strong>${recipient}</strong>). Use the 6-digit verification code below to proceed:</p>

                  <div style="text-align: center; margin: 28px 0; background: #f8fafc; border: 2px dashed #22c55e; border-radius: 12px; padding: 24px 16px;">
                    <span style="font-family: monospace, Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0f172a; display: block;">${code}</span>
                    <span style="color: #16a34a; font-size: 13px; font-weight: 600; display: block; margin-top: 8px;">Valid for ${expiry} minutes</span>
                  </div>

                  <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
                    <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;"><strong>Security notice:</strong> Never share this code with anyone. Lafole Academy staff will never ask for your verification code.</p>
                  </div>

                  <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                  <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">If you did not request a password reset, you can safely ignore this email — your account remains completely secure.</p>
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
              message: `Password reset code sent to ${recipient}`
            });
          }

          const isValidationError = resendData?.name === "validation_error" || resendData?.statusCode === 422;
          return res.status(200).json({
            success: true,
            delivered: false,
            restricted: isValidationError,
            simulated: true,
            resetCode: code,
            message: isValidationError
              ? (resendData?.message || "Resend test domain note: configure domain in Resend for non-verified external inboxes.")
              : (resendData?.message || "Reset code generated.")
          });
        } catch (resendErr: any) {
          console.warn("[Vercel Email Function] Resend error:", resendErr?.message);
        }
      }

      return res.status(200).json({
        success: true,
        delivered: false,
        simulated: true,
        resetCode: code,
        message: `Reset code generated: ${code}`
      });
    }

    // ==========================================
    // Flow 2: 24-Hour Student Email Verification Link
    // ==========================================
    const hashFallbackUrl = verificationUrl && !verificationUrl.includes('#') 
      ? verificationUrl.replace('/verify-email', '/#/verify-email') 
      : (verificationUrl || "");

    if (resendApiKey) {
      try {
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
            subject: `Verify your email for Lafole Academy (Link expires in 24 hours) - ${courseTitle || "Welcome"}`,
            text: `Hello ${fullName || "Student"},\n\nThank you for beginning your enrollment in ${courseTitle || "your course"} at Lafole Academy. Please click the link below to verify your email address:\n${verificationUrl}\n\nAlternative direct link:\n${hashFallbackUrl}\n\nIMPORTANT: This verification link will expire in 24 hours.\n\nWarm regards,\nLafole Academy Registrar`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #22c55e; color: #ffffff; font-weight: 900; font-size: 24px;">L</div>
                  <h2 style="color: #0f172a; margin-top: 14px; margin-bottom: 4px; font-size: 22px; font-weight: 700;">Verify Your Email Address</h2>
                  <p style="color: #64748b; font-size: 14px; margin: 0;">Lafole Academy Student Enrollment</p>
                </div>

                <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello <strong>${fullName || "Student"}</strong>,</p>
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">Thank you for beginning your enrollment in <strong>${courseTitle || "your track"}</strong> at Lafole Academy. Please click the button below to verify your email address and activate your student account:</p>
                
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${verificationUrl}" style="background-color: #22c55e; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2);">Verify My Email Address</a>
                </div>

                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin: 20px 0;">
                  <p style="color: #166534; font-size: 13.5px; margin: 0; line-height: 1.5;">
                    <strong>⏰ 24-Hour Link Expiration:</strong> This secure verification link is valid for <strong>24 hours</strong>. If not activated within 24 hours, you will need to request a new link.
                  </p>
                </div>

                <p style="color: #64748b; font-size: 13px; line-height: 1.5;">If the button does not work, copy and paste this URL into your browser:<br/><a href="${verificationUrl}" style="color: #16a34a; word-break: break-all;">${verificationUrl}</a></p>
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.4; margin-top: 8px;">Alternative direct link:<br/><a href="${hashFallbackUrl}" style="color: #16a34a; word-break: break-all;">${hashFallbackUrl}</a></p>
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">This link will expire in 24 hours. If you did not create an account at Lafole Academy, you can safely ignore this email.</p>
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
      message: "Verification link generated. Valid for 24 hours."
    });
  } catch (err: any) {
    console.error("[Vercel Email Function] Error:", err);
    return res.status(500).json({ success: false, message: err?.message || "Failed to process email" });
  }
}
