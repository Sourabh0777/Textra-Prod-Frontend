// app/api/waitlist/send-email/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, name } = await request.json();
  
  // Send email directly from Next.js
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Thanks for joining!',
    html: `<p>Welcome ${name || 'there'}!</p>`
  });
  
  return NextResponse.json({ success: true });
}