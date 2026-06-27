import { Resend } from 'resend'

let resend = null

const getResend = () => {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export const sendOtpEmail = async (to, otp) => {
  await getResend().emails.send({
    from: 'StockSense <onboarding@resend.dev>',
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
