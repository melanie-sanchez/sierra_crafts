// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from 'react';
// import { useAuth } from './AuthContext.tsx';
// import {
//   addToWishlist as addToWishlistFirebase,
//   removeFromWishlist as removeFromWishlistFirebase,
//   getWishlist as getWishlistFirebase,
// } from '../utils/firebase.ts';
// import { useNavigate } from 'react-router-dom';

// interface WishlistContextType {
//   wishlist: any[];
//   addToWishlist: (productId: string) => Promise<void>;
//   removeFromWishlist: (productId: string) => Promise<void>;
//   isInWishlist: (productId: string) => boolean;
// }

// const WishlistContext = createContext<WishlistContextType | undefined>(
//   undefined
// );

// export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [wishlist, setWishlist] = useState<any[]>([]);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (user) {
//         const items = await getWishlistFirebase(user.uid);
//         setWishlist(items);
//       } else {
//         setWishlist([]);
//       }
//     };
//     fetchWishlist();
//   }, [user]);

//   const addToWishlist = async (productId: string) => {
//     if (!user) {
//       return false; // Return false to indicate login is needed
//     }

//     await addToWishlistFirebase(user.uid, productId);
//     const updatedWishlist = await getWishlistFirebase(user.uid);
//     setWishlist(updatedWishlist);
//   };

//   const removeFromWishlist = async (productId: string) => {
//     if (!user) return;
//     await removeFromWishlistFirebase(user.uid, productId);
//     const updatedWishlist = await getWishlistFirebase(user.uid);
//     setWishlist(updatedWishlist);
//   };

//   const isInWishlist = (productId: string) => {
//     return wishlist.some((item) => item.id === productId);
//   };

//   return (
//     <WishlistContext.Provider
//       value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error('useWishlist must be used within a WishlistProvider');
//   }
//   return context;
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext.tsx';
import {
  addToWishlist as addToWishlistFirebase,
  removeFromWishlist as removeFromWishlistFirebase,
  getWishlist as getWishlistFirebase,
} from '../utils/firebase.ts';
import { useNavigate } from 'react-router-dom';

interface WishlistContextType {
  wishlist: any[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        const items = await getWishlistFirebase(user.uid);
        setWishlist(items);
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      await addToWishlistFirebase(user.uid, productId);
      const updatedWishlist = await getWishlistFirebase(user.uid);
      setWishlist(updatedWishlist);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    await removeFromWishlistFirebase(user.uid, productId);
    const updatedWishlist = await getWishlistFirebase(user.uid);
    setWishlist(updatedWishlist);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
