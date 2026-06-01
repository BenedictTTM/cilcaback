import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Row, Column, Hr, Button } from '@react-email/components';

interface OrderStatusUpdateProps {
  orderId: string;
  name: string;
  status: string;
  total?: string;
  items?: Array<{ name: string; quantity: number; price: string }>;
}

export const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({ orderId, name, status, total, items = [] }) => {
  return (
    <Html>
      <Head />
      <Preview>Your Order Status Update - #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Text style={logoText}>🐼 abyList</Text>
            <Text style={logoSubtitle}>BABY LIST SHOP</Text>
          </Section>
          <Section style={content}>
            <Text style={h1}>Order Status Update</Text>
            <Text style={textCentered}>Hi {name},</Text>
            <Text style={textCentered}>
              There is an update on your order #{orderId}.
            </Text>

            <Section style={statusContainer}>
              <Text style={statusPill}>{status.toUpperCase()}</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={`https://optimum-babycare.vercel.app/auth/login?redirect=/orders`}>
                Track Your Order
              </Button>
            </Section>

            {items && items.length > 0 && (
              <Section style={orderSummary}>
                <Text style={h2}>Order Summary</Text>
                <Hr style={summaryHr} />
                {items.map((item, index) => (
                  <Row key={index} style={itemRow}>
                    <Column style={itemColLeft}>
                      <Text style={itemName}><span style={itemQuantity}>{item.quantity}x</span> {item.name}</Text>
                    </Column>
                    <Column style={itemColRight} align="right">
                      <Text style={itemPrice}>{item.price}</Text>
                    </Column>
                  </Row>
                ))}
                {total && (
                  <Row style={totalRow}>
                    <Column>
                      <Text style={totalLabel}>Total</Text>
                    </Column>
                    <Column align="right">
                      <Text style={totalValue}>{total}</Text>
                    </Column>
                  </Row>
                )}
              </Section>
            )}

          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              If you have any questions about this update, please don't hesitate to contact us.
            </Text>
            <Text style={footerText}>© {new Date().getFullYear()} abyList. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderStatusUpdate;

const main = { backgroundColor: '#F4F4F4', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' };
const container = { margin: '40px auto', maxWidth: '600px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #EAEAEA', overflow: 'hidden' };
const brandHeader = { padding: '30px 20px 10px', textAlign: 'center' as const, backgroundColor: '#FFFFFF' };
const logoText = { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0', letterSpacing: '-0.5px' };
const logoSubtitle = { fontSize: '12px', fontWeight: '600', color: '#999999', margin: '4px 0 0', letterSpacing: '1.5px' };

const content = { padding: '20px 40px 40px' };
const h1 = { color: '#1A1A1A', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px', textAlign: 'center' as const };
const textCentered = { color: '#4A4A4A', fontSize: '15px', lineHeight: '24px', margin: '0 0 10px', textAlign: 'center' as const };

const statusContainer = { textAlign: 'center' as const, margin: '20px 0 15px' };
const statusPill = { 
  display: 'inline-block',
  backgroundColor: '#FFF4D4', 
  color: '#B58500', 
  fontWeight: 'bold',
  padding: '8px 24px',
  borderRadius: '20px',
  fontSize: '14px',
  margin: '0',
  letterSpacing: '1px'
};

const buttonContainer = { textAlign: 'center' as const, margin: '0 0 40px' };
const button = {
  backgroundColor: '#FFD700',
  color: '#000000',
  fontWeight: 'bold',
  fontSize: '15px',
  padding: '12px 30px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block'
};

const orderSummary = {
  backgroundColor: '#FFFFFF',
  margin: '20px 0 0',
};

const h2 = { color: '#4A4A4A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' };
const summaryHr = { borderColor: '#EAEAEA', margin: '0 0 10px' };

const itemRow = {
  borderBottom: '1px solid #EAEAEA',
  padding: '14px 0',
};

const itemColLeft = { width: '70%' };
const itemColRight = { width: '30%' };

const itemName = { margin: '0', color: '#4A4A4A', fontSize: '15px', lineHeight: '22px' };
const itemQuantity = { fontWeight: 'bold', color: '#4A4A4A', marginRight: '8px' };
const itemPrice = { margin: '0', color: '#4A4A4A', fontSize: '15px' };

const totalRow = {
  paddingTop: '16px',
};

const totalLabel = {
  margin: '0',
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#1A1A1A',
};

const totalValue = {
  margin: '0',
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#1A1A1A',
};

const footer = { padding: '30px 40px', textAlign: 'center' as const, backgroundColor: '#F9F9F9', borderTop: '1px solid #EAEAEA' };
const footerText = { color: '#999999', fontSize: '13px', margin: '0 0 8px', lineHeight: '20px' };
