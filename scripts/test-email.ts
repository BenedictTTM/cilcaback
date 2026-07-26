/**
 * Resend smoke-test script.
 * Usage: ts-node scripts/test-email.ts
 *
 * Reads RESEND_API_KEY and EMAIL_FROM from .env, then fires a real email.
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { Resend } from 'resend';

// Load .env from project root
dotenv.config({ path: resolve(__dirname, '../.env') });

const apiKey  = process.env.RESEND_API_KEY as string;
const from    = process.env.EMAIL_FROM as string;
const to      = 'palomakut1@gmail.com';

if (!process.env.RESEND_API_KEY) {
  console.error('❌  RESEND_API_KEY is not set in .env');
  process.exit(1);
}
if (!process.env.EMAIL_FROM) {
  console.error('❌  EMAIL_FROM is not set in .env');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function main() {
  console.log(`📧  Sending test email...`);
  console.log(`    From : ${from}`);
  console.log(`    To   : ${to}`);
  console.log(`    Key  : ${apiKey!.slice(0, 8)}••••`);
  console.log('');

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: '✅ Resend Integration Test — Cilca Hair',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#111827;margin-top:0;">🎉 Resend is working!</h2>
        <p style="color:#374151;">This is an automated smoke-test email sent from the <strong>Cilca Hair</strong> backend after migrating from Nodemailer to Resend.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#6b7280;font-size:13px;">Sent at: ${new Date().toISOString()}</p>
      </div>
    `,
  });

  if (error) {
    console.error('❌  Resend returned an error:');
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log('✅  Email sent successfully!');
  console.log(`    Resend Message ID: ${data?.id}`);
}

main().catch((err) => {
  console.error('❌  Unexpected error:', err);
  process.exit(1);
});
