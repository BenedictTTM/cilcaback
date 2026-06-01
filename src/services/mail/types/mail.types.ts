export interface SendMailOptions {
  to: string;
  subject?: string;
  template: string;
  data: Record<string, any>;
}

export interface TemplateProps {
  [key: string]: any;
}
