export interface CartItem {
  /** Product id. */
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  /** Colour variant id; cart lines are keyed by this. */
  colorId: string;
  color: string;
  /** Stock for the chosen colour, when known. */
  availableQuantity?: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}
