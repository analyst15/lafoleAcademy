export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim());
  const emailFrom = process.env.EMAIL_FROM || "Lafole Academy <noreply@lafole.net>";

  res.status(200).json({
    status: "ok",
    provider: "vercel",
    emailConfig: {
      hasResendApiKey: hasResend,
      senderFrom: emailFrom,
      adminNotificationRecipient: "info@lafole.net"
    },
    timestamp: new Date().toISOString()
  });
}
