import * as React from 'react';
import { Section, Button } from '@react-email/components';
import { CTAProps } from '../types/newsletter.types';

export const CTAComponent = ({ props }: { props: CTAProps }) => {
  return (
    <Section style={containerStyle}>
      <Button href={props.link} style={buttonStyle}>
        {props.text}
      </Button>
    </Section>
  );
};

const containerStyle = {
  textAlign: 'center' as const,
  marginTop: '20px',
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '5px',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
};
