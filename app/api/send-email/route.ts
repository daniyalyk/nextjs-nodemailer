
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (
      typeof email !== 'string' ||
      !email.trim() ||
      email.length > 320
    ) {
      return NextResponse.json(
        { error: 'Invalid request data.' },
        { status: 400 },
      );
    }

    const recipient = process.env.MAIL_TO;

    if (!recipient) {
      throw new Error('Missing MAIL_TO configuration');
    }

    const result = await sendEmail({
      to: recipient,
      subject: 'Email address submission',
      text: `Email: ${email.trim()}`,
      html: `
        <h2>New Neurofab message</h2>
        <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
      `,
    });

    console.info('Email accepted by SMTP provider', {
      messageId: result.messageId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);

    return NextResponse.json(
      { error: 'Unable to send email. Please try again.' },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}
