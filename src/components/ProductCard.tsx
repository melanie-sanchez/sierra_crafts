import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';
import { HeartIcon } from './HeartIcon';
import { useWishlist } from '../contexts/WishlistContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const Price = styled.p`
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  margin: 0.5rem 0;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ProductCardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const CartButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const WishlistButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const HeartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  opacity: 1; // Always visible
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    onAddToCart(product);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <ProductCardContainer>
      <Link to={`/product/${product.id}`}>
        <ProductImage src={product.imageUrl} alt={product.name} />
      </Link>
      <ProductInfo>
        <h3>{product.name}</h3>
        <p>${product.price.toFixed(2)}</p>
        <ButtonContainer>
          <CartButton onClick={handleAddToCart}>Add to Cart</CartButton>
          <WishlistButton onClick={handleWishlistToggle}>
            {isInWishlist(product.id) ? '❤️' : '🤍'}
          </WishlistButton>
        </ButtonContainer>
      </ProductInfo>
    </ProductCardContainer>
  );
};

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import { Product } from '../types';
// import { HeartIcon } from './HeartIcon';
// import { useWishlist } from '../contexts/WishlistContext.tsx';
// import { useAuth } from '../contexts/AuthContext.tsx';

// const Card = styled.div`
//   background-color: ${(props) => props.theme.colors.white};
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   overflow: hidden;
//   transition: transform 0.2s;

//   &:hover {
//     transform: translateY(-5px);
//   }
// `;

// const ProductImage = styled.img`
//   width: 100%;
//   height: 200px;
//   object-fit: cover;
// `;

// const ProductInfo = styled.div`
//   padding: 1rem;
// `;

// const Price = styled.p`
//   font-weight: bold;
//   color: ${(props) => props.theme.colors.primary};
//   margin: 0.5rem 0;
// `;

// const Button = styled.button`
//   background-color: ${(props) => props.theme.colors.primary};
//   color: white;
//   border: none;
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: opacity 0.2s;

//   &:hover {
//     opacity: 0.9;
//   }
// `;

// const ProductCardContainer = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: column;
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1rem;
// `;

// const CartButton = styled.button`
//   background-color: ${(props) => props.theme.colors.primary};
//   color: white;
//   border: none;
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   cursor: pointer;
// `;

// const WishlistButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 1.5rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// interface ProductCardProps {
//   product: Product;
//   onAddToCart: (product: Product) => void;
// }

// const HeartButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 1.5rem;
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   z-index: 10;
//   opacity: 1; // Always visible
// `;

// export const ProductCard: React.FC<ProductCardProps> = ({
//   product,
//   onAddToCart,
// }) => {
//   const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const handleAddToCart = () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     onAddToCart(product);
//   };

//   const handleWishlistToggle = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     if (isInWishlist(product.id)) {
//       removeFromWishlist(product.id);
//     } else {
//       addToWishlist(product.id);
//     }
//   };

//   return (
//     <ProductCardContainer>
//       <Link to={`/product/${product.id}`}>
//         <ProductImage src={product.imageUrl} alt={product.name} />
//         <ProductInfo>
//           <h3>{product.name}</h3>
//           <p>${product.price.toFixed(2)}</p>
//         </ProductInfo>
//       </Link>
//       <ButtonContainer>
//         <CartButton onClick={handleAddToCart}>Add to Cart</CartButton>
//         <WishlistButton onClick={handleWishlistToggle}>
//           {isInWishlist(product.id) ? '❤️' : '🤍'}
//         </WishlistButton>
//       </ButtonContainer>
//     </ProductCardContainer>
//   );
// };
