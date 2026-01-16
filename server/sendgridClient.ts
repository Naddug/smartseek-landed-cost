import sgMail from '@sendgrid/mail';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key || !connectionSettings.settings.from_email)) {
    throw new Error('SendGrid not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email };
}

export async function getUncachableSendGridClient() {
  const { apiKey, email } = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

export async function sendVerificationEmail(toEmail: string, verificationToken: string, baseUrl: string) {
  const { client, fromEmail } = await getUncachableSendGridClient();
  
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
  
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'Verify your SmartSeek account',
    html: `
      <!DOCTYPE html>
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
          </div>
          <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} SmartSeek. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Verify Your SmartSeek Account
      
      Thank you for signing up for SmartSeek! Please click the link below to verify your email address:
      
      ${verificationLink}
      
      If you didn't create a SmartSeek account, you can safely ignore this email.
      
      This link expires in 24 hours.
    `
  };
  
  await client.send(msg);
  return true;
}

export async function sendPasswordResetEmail(toEmail: string, resetToken: string, baseUrl: string) {
  const { client, fromEmail } = await getUncachableSendGridClient();
  
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'Reset your SmartSeek password',
    html: `
      <!DOCTYPE html>
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
          </div>
          <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} SmartSeek. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Reset Your SmartSeek Password
      
      We received a request to reset your password. Click the link below to create a new password:
      
      ${resetLink}
      
      If you didn't request a password reset, you can safely ignore this email.
      
      This link expires in 1 hour.
    `
  };
  
  await client.send(msg);
  return true;
}
