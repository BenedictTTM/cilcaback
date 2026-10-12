import * as React from 'react';
import { Section, Text, Img, Row, Column } from '@react-email/components';
import { MealListProps } from '../types/newsletter.types';

export const MealListComponent = ({ props }: { props: MealListProps }) => {
  return (
    <Section style={containerStyle}>
      {props.items?.map((meal, index) => (
        <Row key={index} style={rowStyle}>
          <Column style={imageColumnStyle}>
            {/* Provide fallback width/height if needed */}
            <Img src={meal.image} alt={meal.name} style={imageStyle} width="80" height="80" />
          </Column>
          <Column style={contentColumnStyle}>
            <Text style={nameStyle}>{meal.name}</Text>
            <Text style={priceStyle}>{meal.price}</Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
};

const containerStyle = {
  padding: '10px 0',
  marginBottom: '20px',
};

const rowStyle = {
  marginBottom: '15px',
  borderBottom: '1px solid #eeeeee',
  paddingBottom: '15px',
};

const imageColumnStyle = {
  width: '100px',
};

const imageStyle = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
};

const contentColumnStyle = {
  paddingLeft: '15px',
  verticalAlign: 'top',
};

const nameStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#222222',
  margin: '0 0 5px 0',
};

const priceStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#ff6b6b',
  margin: '0',
};
