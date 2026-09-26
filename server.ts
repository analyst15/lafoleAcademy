import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Helper to guarantee sender display name is always "Lafole Academy"
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Real Email Dispatch Route (supports Resend or local fallback)
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, fullName, verificationUrl, courseTitle } = req.body;

      const recipient = typeof to === "string" ? to.trim().toLowerCase() : "";
      if (!recipient || !recipient.includes("@")) {
        return res.status(400).json({ success: false, message: "Valid recipient email is required" });
      }

      const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : "";
      const hashFallbackUrl = verificationUrl && !verificationUrl.includes('#') 
        ? verificationUrl.replace('/verify-email', '/#/verify-email') 
        : (verificationUrl || "");

      if (resendApiKey) {
        // Attempt delivery via Resend API
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
              text: `Hello ${fullName || "Student"},\n\nThank you for beginning your enrollment in ${courseTitle || "your course"} at Lafole Academy. Please click the link below to verify your email address:\n${verificationUrl}\n\nAlternative direct link:\n${hashFallbackUrl}\n\nThis link is valid for 24 hours.`,
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

          const resendData = await emailResponse.json();

          if (emailResponse.ok) {
            console.log(`[Email Service] Delivered via Resend to ${recipient} (ID: ${resendData.id})`);
            return res.json({ 
              success: true, 
              delivered: true, 
              provider: "resend",
              id: resendData.id,
              message: `Verification email delivered to ${recipient}` 
            });
          }

          // Handle Resend testing domain / validation restrictions cleanly without logging fatal warnings
          const isValidationError = resendData?.name === "validation_error" || resendData?.statusCode === 422;
          console.info(`[Email Service] Resend response for ${recipient}: ${resendData?.message || "Non-delivery response"}`);
          
          return res.json({
            success: true,
            delivered: false,
            restricted: isValidationError,
            simulated: true,
            verificationUrl,
            message: isValidationError 
              ? (resendData?.message || "Resend testing mode restriction. For non-owner test addresses, use 1-click verification or configure custom domain.")
              : (resendData?.message || "Verification link generated.")
          });
        } catch (resendErr: any) {
          console.info("[Email Service] Resend connection note:", resendErr?.message);
        }
      }

      // Fallback when RESEND_API_KEY is not configured
      console.log(`[Email Service] Generated verification link for ${recipient}: ${verificationUrl}`);
      return res.json({
        success: true,
        delivered: false,
        simulated: true,
        verificationUrl,
        message: "Verification link generated. You can activate directly or configure RESEND_API_KEY."
      });
    } catch (err: any) {
      console.error("[Email Service] Server error in send-email:", err);
      return res.status(500).json({ success: false, message: err?.message || "Failed to process email" });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback handler for client-side routing on page refresh or direct navigation
    // (e.g., /catalog, /verify-email, /diplomas, /dashboard, etc.)
    app.use("*", async (req, res, next) => {
      if (req.method !== "GET" || req.originalUrl.startsWith("/api/")) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        if (!fs.existsSync(indexPath)) {
          return next();
        }
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api/")) {
        return next();
      }
      const distIndex = path.join(distPath, "index.html");
      if (fs.existsSync(distIndex)) {
        res.sendFile(distIndex);
      } else {
        const rootIndex = path.resolve(process.cwd(), "index.html");
        res.sendFile(rootIndex);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
