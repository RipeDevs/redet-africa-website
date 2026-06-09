// Prevent XSS in email HTML template
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  // Only allow secure POST data transfers
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  // Server-side validation check
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    await resend.emails.send({
      from: "Redet Africa <hello@redetafrica.com>",
      to: "hello@redetafrica.com",
      subject: `Website enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.5;">
          <h2 style="color: #0a0c10; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Website Enquiry</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin: 20px 0 5px 0;"><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error execution tracking:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to securely transmit email" });
  }
};
