// Vercel Serverless Function for Admin Payment Rejection
// Endpoint: POST /api/admin/reject-payment

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
    const { paymentId, reason, verifiedBy } = body;
    console.log(`[Admin Payment] Rejecting payment ${paymentId} by ${verifiedBy || "Admin"}: ${reason || "No reason specified"}`);

    return res.status(200).json({
      success: true,
      paymentId,
      paymentStatus: "REJECTED",
      orderStatus: "REJECTED",
      enrollmentStatus: "SUSPENDED",
      message: "Payment rejected"
    });
  } catch (err: any) {
    console.error("[Admin Payment] Error in reject-payment:", err);
    return res.status(500).json({ success: false, message: err?.message || "Failed to reject payment" });
  }
}
