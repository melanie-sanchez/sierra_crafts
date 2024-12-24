import React from 'react';
import styled from 'styled-components';
import { useWishlist } from '../contexts/WishlistContext.tsx';
import { useCart } from '../contexts/CartContext.tsx';

const WishlistContainer = styled.div`
  padding: 2rem;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
`;

const WishlistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`;

const ItemDetails = styled.div`
  display: flex;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
  border-radius: 4px;
`;

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <WishlistContainer>
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        wishlist.map((item) => (
          <WishlistItem key={item.id}>
            <ItemDetails>
              <ItemImage src={item.imageUrl} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
              </div>
            </ItemDetails>
            <ItemActions>
              <Button onClick={() => handleAddToCart(item)}>Add to Cart</Button>
              <Button onClick={() => removeFromWishlist(item.id)}>
                Remove
              </Button>
            </ItemActions>
          </WishlistItem>
        ))
      )}
    </WishlistContainer>
  );
};
