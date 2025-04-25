import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (medicine) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === medicine._id);
      if (existing) {
        return prev.map(item =>
          item._id === medicine._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
