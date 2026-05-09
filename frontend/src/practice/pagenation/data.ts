import { type Item } from "./type";
export const data: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: `Item_${i + 1}`,
}));
