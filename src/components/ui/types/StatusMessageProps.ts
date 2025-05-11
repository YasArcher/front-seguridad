import type { ReactNode } from 'react';

export interface StatusMessageProps {
  isLoading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children?: ReactNode;
}