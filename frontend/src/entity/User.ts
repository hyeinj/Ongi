export type Category = 'self' | 'growth' | 'routine' | 'relationship';

export interface User {
  id: string;
  category: Category;
}
