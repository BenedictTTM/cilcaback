export type NewsletterBlockType = 'hero' | 'meal_list' | 'cta' | 'text';

export interface BaseBlock {
  id: string;
  type: NewsletterBlockType;
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  props: HeroProps;
}

export interface MealItem {
  name: string;
  image: string;
  price: string;
}

export interface MealListProps {
  items: MealItem[];
}

export interface MealListBlock extends BaseBlock {
  type: 'meal_list';
  props: MealListProps;
}

export interface CTAProps {
  text: string;
  link: string;
}

export interface CTABlock extends BaseBlock {
  type: 'cta';
  props: CTAProps;
}

export interface TextProps {
  content: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  props: TextProps;
}

export type NewsletterBlock = HeroBlock | MealListBlock | CTABlock | TextBlock;

export interface NewsletterContent {
  blocks: NewsletterBlock[];
}
