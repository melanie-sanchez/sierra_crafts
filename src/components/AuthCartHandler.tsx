import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useCart } from '../contexts/CartContext.tsx';

export const AuthCartHandler: React.FC = () => {
  const { user } = useAuth();
  const { clearCart, loadSavedCart, saveCart } = useCart();

  // First useEffect
  useEffect(() => {
    if (user) {
      loadSavedCart(user.uid);
    } else {
      clearCart();
    }
  }, [user, loadSavedCart, clearCart]); // Add missing dependencies

  // Second useEffect
  useEffect(() => {
    if (user) {
      saveCart(user.uid);
    }
  }, [user, saveCart]);

  return null;
};
