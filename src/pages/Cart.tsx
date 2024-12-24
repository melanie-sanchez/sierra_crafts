import React from 'react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext.tsx';

const CartContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
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

const EmptyCartMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

const RemoveButton = styled(QuantityButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
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

const CheckoutButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
`;

const WishlistButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-left: 1rem;
`;

export const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleWishlistToggle = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
      removeFromCart(productId);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <h1>Your Cart</h1>
      {cartItems.map(({ product, quantity }) => (
        <CartItem key={product.id}>
          <ItemDetails>
            <ItemImage src={product.imageUrl} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          </ItemDetails>
          <QuantityControl>
            <QuantityButton
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              -
            </QuantityButton>
            <span>{quantity}</span>
            <QuantityButton
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              +
            </QuantityButton>
            <RemoveButton onClick={() => removeFromCart(product.id)}>
              Remove
            </RemoveButton>
            <WishlistButton onClick={() => handleWishlistToggle(product.id)}>
              {isInWishlist(product.id) ? '❤️' : '🤍'}
            </WishlistButton>
          </QuantityControl>
        </CartItem>
      ))}

      <div>
        <h2>
          Total: $
          {cartItems
            .reduce(
              (total, item) => total + item.product.price * item.quantity,
              0
            )
            .toFixed(2)}
        </h2>
      </div>
      <CheckoutButton onClick={handleCheckout}>
        Proceed to Checkout
      </CheckoutButton>
    </CartContainer>
  );
};
