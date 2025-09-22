import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({ user, url, token }: { user: any; url: string; token: string }) {
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'TxtPaste <no-reply@txtpaste.com>',
      to: [user.email],
      subject: 'Verify your email address',
      html: `
        <h1>Verify your email address</h1>
        <p>Please click the button below to verify your email address.</p>
        <a href="${url}" style="
          background-color: #000000;
          border-radius: 5px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          display: block;
          padding: 12px;
          margin: 16px 0;
        ">Verify Email</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error in sendVerificationEmail:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

export async function sendResetPasswordEmail({ user, url, token }: { user: any; url: string; token: string }) {

  
  try {
    const { data, error } = await resend.emails.send({
      from: 'TxtPaste <no-reply@txtpaste.com>',
      to: [user.email],
      subject: 'Reset your password',
      html: `
        <h1>Reset your password</h1>
        <p>Please click the button below to reset your password.</p>
        <a href="${url}" style="
          background-color: #000000;
          border-radius: 5px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          display: block;
          padding: 12px;
          margin: 16px 0;
        ">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(`Failed to send reset password email: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error in sendResetPasswordEmail:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
} 