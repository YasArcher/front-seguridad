import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  children?: ReactNode;
  variant?: 'default' | 'compact' | 'large';
}