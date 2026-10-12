import * as React from 'react';
import { Html, Head, Body, Container, Preview } from '@react-email/components';
import { NewsletterContent, NewsletterBlock } from './types/newsletter.types';
import { HeroComponent } from './newsletter/HeroComponent';
import { MealListComponent } from './newsletter/MealListComponent';
import { CTAComponent } from './newsletter/CTAComponent';
import { TextComponent } from './newsletter/TextComponent';

const blockToComponentMap: Record<string, React.FC<{ props: any }>> = {
  hero: HeroComponent,
  meal_list: MealListComponent,
  cta: CTAComponent,
  text: TextComponent,
};

interface NewsletterTemplateProps {
  content: NewsletterContent;
  subject?: string;
}

export const NewsletterTemplate = ({ content, subject }: NewsletterTemplateProps) => {
  return (
    <Html>
      <Head />
      {subject && <Preview>{subject}</Preview>}
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {content.blocks?.map((block: NewsletterBlock, index: number) => {
            const Component = blockToComponentMap[block.type];
            if (!Component) {
              return null; // Ignore unknown block types to avoid crashes
            }
            return <Component key={block.id || index} props={block.props} />;
          })}
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterTemplate;

const mainStyle = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};
