
export interface TransactionDto {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}


