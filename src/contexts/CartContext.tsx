import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Product } from '../types';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.ts';
import { useWishlist } from './WishlistContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx'; // Add this import
import { useAuthRedirect } from '../components/AuthRedirect.tsx';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartCount: number;
  isInCart: (productId: string) => boolean;
  loadSavedCart: (userId: string) => void; // Add this line
  saveCart: (userId: string) => void; // Add this line
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isInWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadSavedCart = (userId: string) => {
    const savedCart = localStorage.getItem(`cart_${userId}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };
  const saveCart = (userId: string) => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      await updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems((prevItems) => [...prevItems, { product, quantity: 1 }]);
      await updateProductQuantity(product.id, -1);

      // Remove from wishlist if present
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const itemToRemove = cartItems.find(
      (item) => item.product.id === productId
    );
    if (itemToRemove) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product.id !== productId)
      );
      await updateProductQuantity(productId, itemToRemove.quantity);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      const quantityDiff = newQuantity - item.quantity;
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      await updateProductQuantity(productId, -quantityDiff);
    }
  };

  const updateProductQuantity = async (
    productId: string,
    quantityChange: number
  ) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        quantity: increment(quantityChange),
      });
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isInCart = (productId: string) =>
    cartItems.some((item) => item.product.id === productId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isInCart,
        loadSavedCart,
        saveCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
