import type { ReactNode } from "react";

export interface GenericListProps<T> {
  items: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  renderItem: (item: T) => ReactNode;
  showCounter?: boolean;
}