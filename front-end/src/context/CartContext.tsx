import { createContext, useContext, useState } from 'react';

// defines what one item in the cart looks like
export interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
}

// defines what the cart context provides to the rest of the app
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookID: number) => void;
    clearCart: () => void;
    updateQuantity: (bookID: number, quantity: number) => void; // update quantity of an item
  }

// create the context - starts as undefined until the provider wraps the app
const CartContext = createContext<CartContextType | undefined>(undefined);

// the provider wraps the app and holds all the cart state
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]); // cart starts empty

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.bookID === item.bookID); // check if already in cart
      if (existing) {
        return prevCart.map((c) =>
          c.bookID === item.bookID
            ? { ...c, quantity: c.quantity + 1 } // increment quantity if already there
            : c
        );
      }
      return [...prevCart, { ...item, quantity: 1 }]; // add new item with quantity 1
    });
  };

  const removeFromCart = (bookID: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookID !== bookID)); // remove by bookID
  };

  const clearCart = () => setCart([]); // reset cart to empty
  const updateQuantity = (bookID: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.bookID === bookID ? { ...c, quantity } : c // update quantity for matching item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

// custom hook so any component can easily access the cart
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider'); // safety check
  return context;
}