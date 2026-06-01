import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Row, Column, Hr } from '@react-email/components';

interface OrderConfirmationProps {
  orderId: string;
  name: string;
  total: string;
  items: Array<{ name: string; quantity: number; price: string }>;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId, name, total, items = [] }) => {
  return (
    <Html>
      <Head />
      <Preview>Your Order Confirmation - #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Text style={logoText}>🐼 abyList</Text>
            <Text style={logoSubtitle}>BABY LIST SHOP</Text>
          </Section>
          <Section style={content}>
            <Text style={h1}>Order Confirmed!</Text>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thank you for your order! Your order <strong>#{orderId}</strong> has been confirmed and is being processed.
            </Text>

            <Hr style={hr} />
            
            <Section style={orderSummary}>
              <Text style={h2}>Order Summary</Text>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column>
                    <Text style={itemName}>{item.quantity}x {item.name}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={itemPrice}>{item.price}</Text>
                  </Column>
                </Row>
              ))}
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column align="right">
                  <Text style={totalValue}>{total}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Text style={text}>
              We'll send you another email when your order ships.
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

export default OrderConfirmation;

const main = { backgroundColor: '#FAFAFA', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' };
const container = { margin: '40px auto', maxWidth: '600px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA', borderTop: '6px solid #F4C542', overflow: 'hidden' };
const brandHeader = { padding: '30px 20px', textAlign: 'center' as const, backgroundColor: '#FFFFFF', borderBottom: '1px solid #EAEAEA' };
const logoText = { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0', letterSpacing: '-0.5px' };
const logoSubtitle = { fontSize: '12px', fontWeight: '600', color: '#6B6B6B', margin: '4px 0 0', letterSpacing: '1.5px' };
const content = { padding: '30px 40px' };
const h1 = { color: '#1A1A1A', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px', textAlign: 'center' as const };
const h2 = { color: '#1A1A1A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px' };
const text = { color: '#6B6B6B', fontSize: '16px', lineHeight: '24px', margin: '0 0 20px' };
const hr = { borderColor: '#EAEAEA', margin: '20px 0' };

const orderSummary = {
  backgroundColor: '#FEF9EC',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #F4C542',
  margin: '20px 0',
};

const itemRow = {
  borderBottom: '1px solid #EAEAEA',
  padding: '12px 0',
};

const itemName = { ...text, margin: '0', color: '#1A1A1A' };
const itemPrice = { ...text, margin: '0', fontWeight: 'bold', color: '#1A1A1A' };

const totalRow = {
  paddingTop: '16px',
};

const totalLabel = {
  ...text,
  margin: '0',
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#1A1A1A',
};

const totalValue = {
  ...totalLabel,
};

const footer = { padding: '20px', textAlign: 'center' as const, backgroundColor: '#FAFAFA', borderTop: '1px solid #EAEAEA' };
const footerText = { color: '#6B6B6B', fontSize: '14px', margin: '0' };
