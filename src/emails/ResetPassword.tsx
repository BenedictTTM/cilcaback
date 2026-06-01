import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Button } from '@react-email/components';

interface ResetPasswordProps {
  resetUrl: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ resetUrl }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Text style={logoText}>🐼 abyList</Text>
            <Text style={logoSubtitle}>BABY LIST SHOP</Text>
          </Section>
          <Section style={content}>
            <Text style={h1}>Password Reset Request</Text>
            <Text style={text}>Hello,</Text>
            <Text style={text}>
              We received a request to reset your password for your account.
            </Text>
            <Text style={text}>
              Click the button below to reset your password:
            </Text>
            <Section style={btnContainer}>
              <Button style={button} href={resetUrl}>
                Reset Password
              </Button>
            </Section>
            <Text style={text}>
              If the button doesn't work, copy and paste this link into your browser:
            </Text>
            <Text style={linkText}>
              <a href={resetUrl} style={link}>{resetUrl}</a>
            </Text>
            <Text style={boldText}>This link will expire in 1 hour.</Text>
            <Text style={text}>
              If you didn't request a password reset, please ignore this email.
            </Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} abyList. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPassword;

const main = { backgroundColor: '#FAFAFA', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' };
const container = { margin: '40px auto', maxWidth: '600px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA', borderTop: '6px solid #F4C542', overflow: 'hidden' };
const brandHeader = { padding: '30px 20px', textAlign: 'center' as const, backgroundColor: '#FFFFFF', borderBottom: '1px solid #EAEAEA' };
const logoText = { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0', letterSpacing: '-0.5px' };
const logoSubtitle = { fontSize: '12px', fontWeight: '600', color: '#6B6B6B', margin: '4px 0 0', letterSpacing: '1.5px' };
const content = { padding: '30px 40px' };
const h1 = { color: '#1A1A1A', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px', textAlign: 'center' as const };
const text = { color: '#6B6B6B', fontSize: '16px', lineHeight: '24px', margin: '0 0 20px' };
const boldText = { ...text, fontWeight: 'bold', color: '#1A1A1A' };
const btnContainer = { textAlign: 'center' as const, margin: '30px 0' };
const button = { backgroundColor: '#F4C542', borderRadius: '8px', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', padding: '14px 28px' };
const linkText = { ...text, wordBreak: 'break-all' as const, marginTop: '0' };
const link = { color: '#1A1A1A', textDecoration: 'underline' };
const footer = { padding: '20px', textAlign: 'center' as const, backgroundColor: '#FAFAFA', borderTop: '1px solid #EAEAEA' };
const footerText = { color: '#6B6B6B', fontSize: '14px', margin: '0' };
