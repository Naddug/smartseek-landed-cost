/**
 * Email client — Brevo SMTP (primary) with optional SendGrid fallback.
 *
 * Required env vars (Brevo):
 *   BREVO_SMTP_USER   — SMTP login (your Brevo login email)
 *   BREVO_SMTP_PASS   — SMTP password (Brevo SMTP key, NOT your account password)
 *   FROM_EMAIL        — sender address (must be verified in Brevo)
 *   FROM_NAME         — optional sender display name (default: "SmartSeek")
 *
 * Optional env vars (SendGrid fallback — kept for backward compat):
 *   SENDGRID_API_KEY
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// ─── Brevo SMTP transporter (created once, reused) ───────────────────────────

let _transporter: Transporter | null = null;

function getBrevoTransporter(): Transporter {
  if (_transporter) return _transporter;

  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      'Brevo SMTP not configured. Set BREVO_SMTP_USER and BREVO_SMTP_PASS environment variables.'
    );
  }

  _transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // STARTTLS
    auth: { user, pass },
  });

  return _transporter;
}

function getSenderAddress(): string {
  const email = process.env.FROM_EMAIL || process.env.BREVO_SMTP_USER || 'noreply@smartseek.app';
  const name = process.env.FROM_NAME || 'SmartSeek';
  return `"${name}" <${email}>`;
}

// ─── Generic send helper ──────────────────────────────────────────────────────

async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const transport = getBrevoTransporter();
  await transport.sendMail({
    from: getSenderAddress(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}

// ─── Shared HTML wrapper ──────────────────────────────────────────────────────

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">SmartSeek</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">AI-Powered Sourcing Intelligence</p>
    </div>
    <div style="padding: 32px;">
      ${body}
    </div>
    <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        &copy; ${new Date().getFullYear()} SmartSeek. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function sendVerificationEmail(
  toEmail: string,
  verificationToken: string,
  baseUrl: string
): Promise<boolean> {
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

  const html = emailWrapper(`
    <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">Verify Your Email</h2>
    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for signing up for SmartSeek! Please click the button below to verify your email address and activate your account.
    </p>
    <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Verify Email Address
    </a>
    <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0 0; line-height: 1.5;">
      If you didn't create a SmartSeek account, you can safely ignore this email.
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0;">
      This link expires in 24 hours.
    </p>
  `);

  await sendMail({
    to: toEmail,
    subject: 'Verify your SmartSeek account',
    html,
    text: `Verify Your SmartSeek Account\n\nThank you for signing up! Please visit the link below to verify your email:\n\n${verificationLink}\n\nIf you didn't create a SmartSeek account, you can safely ignore this email.\n\nThis link expires in 24 hours.`,
  });

  return true;
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string,
  baseUrl: string
): Promise<boolean> {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = emailWrapper(`
    <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">Reset Your Password</h2>
    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px 0;">
      We received a request to reset your password. Click the button below to create a new password.
    </p>
    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Reset Password
    </a>
    <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0 0; line-height: 1.5;">
      If you didn't request a password reset, you can safely ignore this email.
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0;">
      This link expires in 1 hour.
    </p>
  `);

  await sendMail({
    to: toEmail,
    subject: 'Reset your SmartSeek password',
    html,
    text: `Reset Your SmartSeek Password\n\nWe received a request to reset your password. Visit the link below:\n\n${resetLink}\n\nIf you didn't request a password reset, you can safely ignore this email.\n\nThis link expires in 1 hour.`,
  });

  return true;
}

export async function sendSubscribeConfirmationEmail(toEmail: string): Promise<boolean> {
  const html = emailWrapper(`
    <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">You're Subscribed!</h2>
    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px 0;">
      Thanks for subscribing to SmartSeek. You'll be the first to hear about new features, supplier intelligence insights, and platform updates.
    </p>
    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px 0;">
      In the meantime, explore our AI-powered sourcing tools at <a href="https://smartseek.app" style="color: #3b82f6;">smartseek.app</a>.
    </p>
    <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0 0; line-height: 1.5;">
      You can unsubscribe at any time by replying to this email with "Unsubscribe".
    </p>
  `);

  await sendMail({
    to: toEmail,
    subject: "You're subscribed to SmartSeek",
    html,
    text: `You're Subscribed!\n\nThanks for subscribing to SmartSeek. You'll be the first to hear about new features, supplier intelligence insights, and platform updates.\n\nVisit us at https://smartseek.app\n\nYou can unsubscribe at any time by replying to this email with "Unsubscribe".`,
  });

  return true;
}

export async function sendRfqConfirmationEmail(
  toEmail: string,
  rfqId: string,
  productName: string
): Promise<boolean> {
  const html = emailWrapper(`
    <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">RFQ received</h2>
    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
      Your sourcing request has been received for <strong>${productName}</strong>.
    </p>
    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
      RFQ ID: <strong>${rfqId}</strong><br/>
      Our sourcing operator will review and route it to relevant verified suppliers.
    </p>
  `);

  await sendMail({
    to: toEmail,
    subject: "SmartSeek RFQ received",
    html,
    text: `RFQ received\n\nProduct: ${productName}\nRFQ ID: ${rfqId}\n\nOur sourcing operator will review and route your request to relevant verified suppliers.`,
  });
  return true;
}

export async function sendOpsAlertEmail(subject: string, details: Record<string, unknown>): Promise<boolean> {
  const opsEmail = process.env.OPS_ALERT_EMAIL || process.env.FROM_EMAIL || process.env.BREVO_SMTP_USER;
  if (!opsEmail) return false;
  const body = Object.entries(details)
    .map(([k, v]) => `<p style="margin:0 0 8px 0;"><strong>${k}:</strong> ${String(v ?? "")}</p>`)
    .join("");
  const html = emailWrapper(`
    <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">${subject}</h2>
    ${body}
  `);
  await sendMail({
    to: opsEmail,
    subject,
    html,
    text: `${subject}\n\n${Object.entries(details).map(([k, v]) => `${k}: ${String(v ?? "")}`).join("\n")}`,
  });
  return true;
}

/**
 * Verify SMTP connectivity. Call this on startup to surface misconfigurations early.
 * Returns true if OK, false (with logged warning) if not.
 */
export async function verifySmtpConnection(): Promise<boolean> {
  try {
    const transport = getBrevoTransporter();
    await transport.verify();
    console.log('[email] Brevo SMTP connection verified OK');
    return true;
  } catch (err: any) {
    console.warn('[email] Brevo SMTP connection check failed:', err?.message ?? err);
    return false;
  }
}
