import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product } from '../types';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);

export const auth = getAuth(app);

const adminEmails = ['admin@gmail.com'];

// User authentication functions
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Modify createOrder to include user ID
export const createOrder = async (order) => {
  try {
    console.log('Creating order:', order); // For debugging
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...order,
      createdAt: serverTimestamp(), // Add this for proper timestamp
    });
    console.log('Order created with ID:', docRef.id); // For debugging
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get orders for a specific user
export const getUserOrders = async (userId: string) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
// Product CRUD operations
export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    console.log('Adding product to Firebase:', product);
    const docRef = await addDoc(collection(db, 'products'), product);
    console.log('Product added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    await updateDoc(doc(db, 'products', id), product);
  } catch (error) {
    console.error('Error updating product: ', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product: ', error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  } catch (error) {
    console.error('Error fetching products: ', error);
    throw error;
  }
};

// Image upload function
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `product_images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    return ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching orders: ', error);
    throw error;
  }
};

export const addEvent = async (event) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), event);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event: ', error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    return eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching events: ', error);
    throw error;
  }
};

export const updateEvent = async (id, event) => {
  try {
    await updateDoc(doc(db, 'events', id), event);
  } catch (error) {
    console.error('Error updating event: ', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    console.error('Error deleting event: ', error);
    throw error;
  }
};

export const isAdmin = (email: string): boolean => {
  return adminEmails.includes(email);
};

type BannerSettings = {
  isEnabled: boolean;
  title: string;
  message: string;
  linkUrl?: string;
  imageUrl?: string;
};

export const setBannerSettings = async (settings: BannerSettings) => {
  try {
    // If imageUrl is empty, remove it from the settings object
    if (!settings.imageUrl) {
      delete settings.imageUrl;
    }
    await setDoc(doc(db, 'settings', 'banner'), settings);
  } catch (error) {
    console.error('Error setting banner settings:', error);
    throw error;
  }
};
export const getBannerSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'banner');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting banner settings:', error);
    return null; // Return null instead of throwing error
  }
};

export const uploadBannerImage = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `banner_images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw error;
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      return { id: orderDoc.id, ...orderDoc.data() };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const getProductDetails = async (productId: string) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (productDoc.exists()) {
      return { id: productDoc.id, ...productDoc.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const addToWishlist = async (userId: string, productId: string) => {
  try {
    const wishlistRef = doc(db, 'wishlists', userId);
    const wishlistDoc = await getDoc(wishlistRef);

    if (wishlistDoc.exists()) {
      // Update existing wishlist
      await updateDoc(wishlistRef, {
        items: [...wishlistDoc.data().items, productId],
      });
    } else {
      // Create new wishlist
      await setDoc(wishlistRef, {
        items: [productId],
      });
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove wishlist item
export const removeFromWishlist = async (userId: string, productId: string) => {
  try {
    const wishlistRef = doc(db, 'wishlists', userId);
    const wishlistDoc = await getDoc(wishlistRef);

    if (wishlistDoc.exists()) {
      const updatedItems = wishlistDoc
        .data()
        .items.filter((id: string) => id !== productId);
      await updateDoc(wishlistRef, {
        items: updatedItems,
      });
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Get wishlist items
export const getWishlist = async (userId: string) => {
  try {
    const wishlistRef = doc(db, 'wishlists', userId);
    const wishlistDoc = await getDoc(wishlistRef);

    if (wishlistDoc.exists()) {
      const productIds = wishlistDoc.data().items;
      const products = await Promise.all(
        productIds.map(async (id: string) => {
          const productDoc = await getDoc(doc(db, 'products', id));
          return { id, ...productDoc.data() };
        })
      );
      return products;
    }
    return [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
