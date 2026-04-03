export type MoneyColumnId = 'all' | 'important' | 'secondary' | 'bonus';

export interface MoneyItem {
  id: string;
  title: string;
  amount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoneyColumn {
  id: MoneyColumnId;
  title: string;
  itemIds: string[];
}

export interface MoneyBoard {
  items: Record<string, MoneyItem>;
  columns: Record<MoneyColumnId, MoneyColumn>;
  columnOrder: MoneyColumnId[];
}