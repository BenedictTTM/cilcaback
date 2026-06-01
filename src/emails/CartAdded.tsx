import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Button } from '@react-email/components';

interface CartAddedProps {
  name: string;
  productName: string;
  cartUrl: string;
}

export const CartAdded: React.FC<CartAddedProps> = ({ name, productName, cartUrl }) => {
  return (
    <Html>
      <Head />
      <Preview>An item was added from your cart</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Text style={logoText}>🐼 abyList</Text>
            <Text style={logoSubtitle}>BABY LIST SHOP</Text>
          </Section>
          <Section style={content}>
            <Text style={h1}>Item Added to Cart</Text>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              You recently added <strong>{productName}</strong> to your cart. 
            </Text>
            <Text style={text}>
              Don't miss out—complete your purchase before it sells out!
            </Text>
            <Section style={btnContainer}>
              <Button style={button} href={cartUrl}>
                View Cart & Checkout
              </Button>
            </Section>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} abyList. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CartAdded;

const main = { backgroundColor: '#FAFAFA', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' };
const container = { margin: '40px auto', maxWidth: '600px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA', borderTop: '6px solid #F4C542', overflow: 'hidden' };
const brandHeader = { padding: '30px 20px', textAlign: 'center' as const, backgroundColor: '#FFFFFF', borderBottom: '1px solid #EAEAEA' };
const logoText = { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0', letterSpacing: '-0.5px' };
const logoSubtitle = { fontSize: '12px', fontWeight: '600', color: '#6B6B6B', margin: '4px 0 0', letterSpacing: '1.5px' };
const content = { padding: '30px 40px' };
const h1 = { color: '#1A1A1A', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px', textAlign: 'center' as const };
const text = { color: '#6B6B6B', fontSize: '16px', lineHeight: '24px', margin: '0 0 20px' };
const btnContainer = { textAlign: 'center' as const, margin: '30px 0' };
const button = { backgroundColor: '#F4C542', borderRadius: '8px', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', padding: '14px 28px' };
const footer = { padding: '20px', textAlign: 'center' as const, backgroundColor: '#FAFAFA', borderTop: '1px solid #EAEAEA' };
const footerText = { color: '#6B6B6B', fontSize: '14px', margin: '0' };
