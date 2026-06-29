const nodemailer = require("nodemailer");

// Build the SMTP transporter from environment variables.
// Works with any SMTP provider (Gmail App Password, Brevo, Mailtrap, etc.).
// If SMTP credentials are not configured we fall back to a "dev" mode that
// simply logs the email to the server console so the flow stays testable
// locally without real credentials.
const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

let transporter = null;

if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    // `secure: true` for port 465, otherwise STARTTLS on 587.
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Send an OTP email. Returns nothing on success, throws on a real send failure.
async function sendOtpEmail({ to, subject, heading, intro, otp }) {
  const html = buildOtpHtml({ heading, intro, otp });

  if (!transporter) {
    // Dev fallback: no SMTP configured. Log the code so registration/reset
    // can still be tested locally. This never goes out in an API response.
    console.log(
      `\n[DEV EMAIL] No SMTP configured. OTP for ${to} (${subject}): ${otp}\n`
    );
    return;
  }

  // await transporter.sendMail({
  //   from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
  //   to,
  //   subject,
  //   html,
  // });

  try {
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  console.log("Email sent successfully");
} catch (err) {
  console.error("SMTP ERROR:", err);
  throw err;
}
}

// Minimal branded HTML matching the DevHub dark/blue theme.
function buildOtpHtml({ heading, intro, otp }) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; padding: 32px; border: 1px solid rgba(148,163,184,0.2);">
    <h1 style="color: #2563eb; font-size: 24px; margin: 0 0 8px;">DevHub</h1>
    <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 12px;">${heading}</h2>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 20px;">${intro}</p>
    <div style="background: #1e293b; border: 1px solid rgba(56,189,248,0.4); border-radius: 12px; padding: 18px; text-align: center;">
      <span style="font-size: 30px; font-weight: 700; letter-spacing: 8px; color: #2563eb;">${otp}</span>
    </div>
    <p style="color: #94a3b8; font-size: 13px; margin: 20px 0 0;">
      This code expires in 10 minutes. If you did not request this, you can safely ignore this email.
    </p>
  </div>`;
}


module.exports = {
  sendOtpEmail,
  smtpConfigured,
};
