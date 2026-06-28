import nodemailer from 'nodemailer'

let transporter = null

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY
      }
    })
  }
  return transporter
}

export const sendOtpEmail = async (to, otp) => {
  await getTransporter().sendMail({
    from: '"StockSense" <anmoldua33763@gmail.com>',
    to,
    subject: 'Your StockSense verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #185FA5;">📈 StockSense</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #378ADD; letter-spacing: 4px;">${otp}</h1>
        <p style="color: #888;">This code expires in 10 minutes.</p>
      </div>
    `
  })
}
