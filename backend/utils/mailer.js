const nodemailer = require("nodemailer");
const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

let transporter = null;

if (smtpConfigured) {
transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  family: 4,
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

    console.log(
      `\n[DEV EMAIL] No SMTP configured. OTP for ${to} (${subject}): ${otp}\n`
    );
    return;
  }

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
  <div style="
    margin: 0;
    padding: 40px 20px;
    background: #f8fafc;
    font-family: Arial, Helvetica, sans-serif;
  ">
    
    <div style="
      max-width: 520px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 22px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
    ">

      <!-- Header -->
      <div style="
        padding: 30px 34px 24px;
        background: #0f172a;
        text-align: center;
      ">

        <div style="
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        ">
          DevHub
        </div>

        <div style="
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 18px;
        ">
          Developer Community Platform
        </div>

        <!-- Personal signature -->
        <div style="
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 23px;
          font-style: italic;
          color: #60a5fa;
          letter-spacing: 1px;
        ">
          𝐿𝒶𝓇𝒶𝒾𝒷
        </div>

      </div>


      <!-- Main Content -->
      <div style="
        padding: 36px 34px 32px;
      ">

        <h1 style="
          margin: 0 0 14px;
          color: #0f172a;
          font-size: 24px;
          line-height: 1.3;
          font-weight: 700;
        ">
          ${heading}
        </h1>

        <p style="
          margin: 0 0 28px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.7;
        ">
          ${intro}
        </p>


        <!-- OTP Box -->
        <div style="
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 16px;
          padding: 25px 18px;
          text-align: center;
          margin-bottom: 25px;
        ">

          <div style="
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            margin-bottom: 12px;
          ">
            Your Verification Code
          </div>

          <div style="
            color: #2563eb;
            font-size: 34px;
            font-weight: 700;
            letter-spacing: 9px;
            line-height: 1.2;
          ">
            ${otp}
          </div>

        </div>


        <!-- Expiry Notice -->
        <div style="
          background: #f8fafc;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 28px;
        ">
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 13px;
            line-height: 1.6;
            text-align: center;
          ">
            This verification code will expire in <strong style="color: #334155;">10 minutes</strong>.
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>


        <!-- Divider -->
        <div style="
          height: 1px;
          background: #e2e8f0;
          margin: 0 0 24px;
        "></div>


        <!-- Help Section -->
        <div style="text-align: center;">

          <p style="
            margin: 0 0 8px;
            color: #334155;
            font-size: 14px;
            font-weight: 600;
          ">
            Need help?
          </p>

          <p style="
            margin: 0;
            color: #94a3b8;
            font-size: 13px;
            line-height: 1.6;
          ">
            If you are facing an issue with DevHub,
            feel free to connect with Laraib on LinkedIn.
          </p>

          <a
            href="https://www.linkedin.com/in/laraib-sarwar-a248a2379/"
            target="_blank"
            style="
              display: inline-block;
              margin-top: 14px;
              padding: 10px 18px;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 9px;
              font-size: 13px;
              font-weight: 600;
            "
          >
            Connect on LinkedIn
          </a>

        </div>

      </div>


      <!-- Footer -->
      <div style="
        padding: 18px 25px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        text-align: center;
      ">

        <p style="
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.6;
        ">
          This is an automated message from DevHub.
          Please do not reply directly to this email.
        </p>

      </div>

    </div>

  </div>
  `;
}


module.exports = {
  sendOtpEmail,
  smtpConfigured,
};


