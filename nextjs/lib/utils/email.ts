import { Resend } from 'resend'
import { APP_CONFIG } from '../config'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

/**
 * Send email using Resend
 */
export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email not sent:', { to, subject })
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: from || `Advance IT Traders <noreply@${process.env.RESEND_DOMAIN || 'yourdomain.com'}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html
    })

    return { success: true, id: result.id }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  orderTotal: number,
  orderItems: Array<{ title: string; quantity: number; price: number }>
) {
  const itemsHtml = orderItems
    .map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs ${item.price.toLocaleString('en-PK')}</td>
      </tr>
    `)
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Thank you for your order!</p>
          <p>Your order <strong>${orderNumber}</strong> has been received and is being processed.</p>
          
          <div class="order-details">
            <h2>Order Summary</h2>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #0ea5e9;">Product</th>
                  <th style="text-align: center; padding: 8px; border-bottom: 2px solid #0ea5e9;">Quantity</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 2px solid #0ea5e9;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">Total: Rs ${orderTotal.toLocaleString('en-PK')}</div>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          <p>If you have any questions, please contact us at ${APP_CONFIG.contact.email}</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${APP_CONFIG.url}/reset-password?token=${resetToken}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html
  })
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, firstName?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to ${APP_CONFIG.name}!</h1>
        <p>Hi ${firstName || 'there'},</p>
        <p>Thank you for joining us! We're excited to have you as part of our community.</p>
        <p>Start shopping for the best gaming accessories and computer hardware in Pakistan.</p>
        <p>Happy shopping!</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Welcome to ${APP_CONFIG.name}!`,
    html
  })
}

