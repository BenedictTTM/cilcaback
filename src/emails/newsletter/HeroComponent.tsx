import * as React from 'react';
import { Section, Text, Img, Heading } from '@react-email/components';
import { HeroProps } from '../types/newsletter.types';

export const HeroComponent = ({ props }: { props: HeroProps }) => {
  return (
    <Section style={heroStyle}>
      {props.image && (
        <Img src={props.image} alt={props.title} style={heroImageStyle} width="100%" />
      )}
      <Heading style={titleStyle}>{props.title}</Heading>
      {props.subtitle && <Text style={subtitleStyle}>{props.subtitle}</Text>}
    </Section>
  );
};

const heroStyle = {
  padding: '20px',
  textAlign: 'center' as const,
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  marginBottom: '20px',
};

const heroImageStyle = {
  borderRadius: '8px',
  marginBottom: '16px',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333333',
  margin: '0 0 8px 0',
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#666666',
  margin: '0',
};
