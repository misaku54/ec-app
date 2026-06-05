export type RegisterForm = {
  email: string;
  password: string;
  name: string;
};

export type SearchForm = {
  name: string | null;
  maxPrice: number | null;
  minPrice: number | null;
  inStock: boolean;
};
