// Vercel Serverless Function for Admin Payment Approval
// Endpoint: POST /api/admin/approve-payment

function getFormattedSender(fromEnv?: string): string {
  if (fromEnv && fromEnv.trim()) {
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
  return "Lafole Academy <noreply@lafole.net>";
}

export default async function handler(req: any, res: any) {
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
    const { paymentId, studentEmail, studentName, courseTitle, verifiedBy } = body;
    const recipient = typeof studentEmail === "string" ? studentEmail.trim().toLowerCase() : "";
    const name = studentName || "Student";
    const course = courseTitle || "English A1";

    console.log(`[Admin Payment] Approving payment ${paymentId} for ${name} (${recipient}) by ${verifiedBy || "Admin"}`);

    if (recipient && recipient.includes("@")) {
      const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : "";
      const sender = getFormattedSender(process.env.EMAIL_FROM);
      const subject = `Payment verified! Your enrollment in ${course} has been activated.`;
      const text = `Hello ${name},\n\nPayment verified! Your enrollment in ${course} has been activated.\n\nYou now have full access to your course, including hosted HD video lectures, technical quizzes, and diploma certificates.\n\nTo begin learning, navigate to:\nDashboard → My Courses → ${course} → Start Course\n\nWarm regards,\nLafole Academy Admissions & Registrar`;

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #22c55e; color: #ffffff; font-weight: 900; font-size: 24px;">L</div>
            <h2 style="color: #0f172a; margin-top: 14px; margin-bottom: 4px; font-size: 22px; font-weight: 700;">Payment Verified!</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0;">Lafole Academy Enrollment Activation</p>
          </div>

          <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;"><strong>Payment verified! Your enrollment in ${course} has been activated.</strong></p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px 20px; margin: 24px 0;">
            <p style="color: #166534; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">
              🎉 How to access your course:
            </p>
            <p style="color: #15803d; font-size: 14px; margin: 0; font-family: monospace; font-weight: 600;">
              Dashboard → My Courses → ${course} → Start Course
            </p>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="/#dashboard" style="background-color: #22c55e; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2);">Go to My Courses &amp; Start Learning</a>
          </div>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">Questions? Contact admissions directly on WhatsApp: +252 61 9290900.</p>
        </div>
      `;

      if (resendApiKey) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: sender,
              reply_to: "admissions@lafole.net",
              to: [recipient],
              subject,
              text,
              html
            })
          });
          console.log(`[Admin Payment] Sent verification email via Resend to ${recipient}`);
        } catch (err: any) {
          console.info("[Admin Payment] Resend email note:", err?.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      paymentId,
      paymentStatus: "PAID",
      orderStatus: "COMPLETED",
      enrollmentStatus: "ACTIVE",
      courseAccessGranted: true,
      message: `Payment verified! Your enrollment in ${course} has been activated.`
    });
  } catch (err: any) {
    console.error("[Admin Payment] Error in approve-payment:", err);
    return res.status(500).json({ success: false, message: err?.message || "Failed to approve payment" });
  }
}
