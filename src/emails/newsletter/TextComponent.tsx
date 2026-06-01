import * as React from 'react';
import { Section, Text } from '@react-email/components';
import { TextProps } from '../types/newsletter.types';

export const TextComponent = ({ props }: { props: TextProps }) => {
  return (
    <Section style={containerStyle}>
      <Text style={textStyle}>{props.content}</Text>
    </Section>
  );
};

const containerStyle = {
  padding: '0 20px',
  marginBottom: '16px',
};

const textStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#444444',
  margin: '0',
};
