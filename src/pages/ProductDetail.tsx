import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.ts';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  margin: 1rem 0;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #dc3545;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const OutOfStockLabel = styled.div`
  color: #dc3545;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const WishlistButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
      // If adding to wishlist, remove from cart
      if (isInCart(product.id)) {
        removeFromCart(product.id);
      }
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (product) {
      addToCart(product);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Invalid product ID');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingMessage>Loading product details...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!product) {
    return <ErrorMessage>Product not found</ErrorMessage>;
  }

  return (
    <ProductContainer>
      <ProductImage
        src={product.imageUrl || '/path/to/placeholder-image.jpg'}
        alt={product.name}
      />
      <ProductInfo>
        <h1>{product.name}</h1>
        <Price>${product.price.toFixed(2)}</Price>
        <p>{product.description}</p>
        <ButtonContainer>
          {product.quantity === 0 ? (
            <OutOfStockLabel>Out of Stock</OutOfStockLabel>
          ) : (
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          )}
          <WishlistButton onClick={handleWishlistToggle}>
            {isInWishlist(product.id) ? '❤️' : '🤍'}
          </WishlistButton>
        </ButtonContainer>
      </ProductInfo>
    </ProductContainer>
  );
};

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import styled from 'styled-components';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../utils/firebase.ts';
// import { Product } from '../types';
// import { useWishlist } from '../contexts/WishlistContext.tsx';
// import { useCart } from '../contexts/CartContext.tsx';
// import { useAuth } from '../contexts/AuthContext.tsx';

// const ProductContainer = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 2rem;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 2rem;

//   @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
//     grid-template-columns: 1fr;
//   }
// `;

// const ProductImage = styled.img`
//   width: 100%;
//   height: auto;
//   border-radius: 8px;
// `;

// const ProductInfo = styled.div`
//   padding: 1rem;
// `;

// const Price = styled.p`
//   font-size: 1.5rem;
//   font-weight: bold;
//   color: ${(props) => props.theme.colors.primary};
//   margin: 1rem 0;
// `;

// const Button = styled.button`
//   background-color: ${(props) => props.theme.colors.primary};
//   color: white;
//   border: none;
//   padding: 1rem 2rem;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 1.1rem;
//   transition: opacity 0.2s;

//   &:hover {
//     opacity: 0.9;
//   }
// `;

// const LoadingMessage = styled.div`
//   text-align: center;
//   font-size: 1.2rem;
//   color: #666;
//   margin-top: 2rem;
// `;

// const ErrorMessage = styled.div`
//   text-align: center;
//   color: #dc3545;
//   font-size: 1.2rem;
//   margin-top: 2rem;
// `;

// const OutOfStockLabel = styled.div`
//   color: #dc3545;
//   font-weight: bold;
//   font-size: 1.2rem;
//   margin-top: 1rem;
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-top: 1rem;
// `;

// const WishlistButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 1.5rem;
//   padding: 0.5rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// interface ProductDetailProps {
//   products: Product[];
//   onAddToCart: (product: Product) => void;
// }

// export const ProductDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const { addToCart, removeFromCart, isInCart } = useCart();
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

//   const handleWishlistToggle = () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     if (product) {
//       if (isInWishlist(product.id)) {
//         removeFromWishlist(product.id);
//       } else {
//         addToWishlist(product.id);
//         if (isInCart(product.id)) {
//           removeFromCart(product.id);
//         }
//       }
//     }
//   };

//   const handleAddToCart = () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     if (product) {
//       addToCart(product);
//     }
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!id) {
//         setError('Invalid product ID');
//         setLoading(false);
//         return;
//       }

//       try {
//         const docRef = doc(db, 'products', id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
//         } else {
//           setError('Product not found');
//         }
//       } catch (err) {
//         console.error('Error fetching product:', err);
//         setError('Failed to fetch product details. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (loading) {
//     return <LoadingMessage>Loading product details...</LoadingMessage>;
//   }

//   if (error) {
//     return <ErrorMessage>{error}</ErrorMessage>;
//   }

//   if (!product) {
//     return <ErrorMessage>Product not found</ErrorMessage>;
//   }

//   return (
//     <ProductContainer>
//       <ProductImage
//         src={product.imageUrl || '/path/to/placeholder-image.jpg'}
//         alt={product.name}
//       />
//       <ProductInfo>
//         <h1>{product.name}</h1>
//         <Price>${product.price.toFixed(2)}</Price>
//         <p>{product.description}</p>
//         <ButtonContainer>
//           {product.quantity === 0 ? (
//             <OutOfStockLabel>Out of Stock</OutOfStockLabel>
//           ) : (
//             <Button onClick={handleAddToCart}>Add to Cart</Button>
//           )}
//           <WishlistButton onClick={handleWishlistToggle}>
//             {isInWishlist(product.id) ? '❤️' : '🤍'}
//           </WishlistButton>
//         </ButtonContainer>
//       </ProductInfo>
//     </ProductContainer>
//   );
// };
