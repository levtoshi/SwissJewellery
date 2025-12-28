import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ isCartOpen, toggleCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartUI = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartUI must be used within CartProvider');
  return context;
};
