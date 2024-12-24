import React from 'react';
import styled from 'styled-components';
import { useWishlist } from '../contexts/WishlistContext.tsx';

const HeartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${(props) => (props.active ? 'red' : '#ccc')};
`;

interface HeartIconProps {
  product: Product;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <HeartButton onClick={toggleWishlist} active={isInWishlist(product.id)}>
      ♥
    </HeartButton>
  );
};
