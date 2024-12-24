import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase.ts';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext.tsx';
import { useWishlist } from '../contexts/WishlistContext.tsx';

import { useAuth } from '../contexts/AuthContext.tsx';
const CategoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;

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

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #dc3545;
  font-size: 1.2rem;
`;

const NoProductsMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const LowStockLabel = styled.span`
  color: #ffa500; // Orange color for warning
  font-weight: bold;
  font-size: 0.875rem;
`;
const Button = styled.button`
  padding: 1rem 2rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

interface CategoryPageProps {
  category: 'candles' | 'earrings' | 'stickers';
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlistToggle = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(product);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'products'),
      where('category', '==', category)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [category]);

  if (loading) {
    return <LoadingMessage>Loading products...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (products.length === 0) {
    return (
      <CategoryContainer>
        <Header>
          <Title>{category.charAt(0).toUpperCase() + category.slice(1)}</Title>
        </Header>
        <NoProductsMessage>
          Sorry, there are currently no products in this category.
        </NoProductsMessage>
      </CategoryContainer>
    );
  }

  return (
    <CategoryContainer>
      <Header>
        <Title>{category.charAt(0).toUpperCase() + category.slice(1)}</Title>
        <p>Discover our handcrafted {category} collection</p>
      </Header>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <Link to={`/product/${product.id}`}>
              <ProductImage src={product.imageUrl} alt={product.name} />
              <ProductInfo>
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </ProductInfo>
            </Link>
            <ButtonContainer>
              <ActionButtons>
                <CartButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(product, e);
                  }}
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </CartButton>
                <WishlistButton
                  onClick={(e) => handleWishlistToggle(product, e)}
                >
                  {isInWishlist(product.id) ? '❤️' : '🤍'}
                </WishlistButton>
              </ActionButtons>
            </ButtonContainer>
          </ProductCard>
        ))}
      </ProductGrid>
    </CategoryContainer>
  );
};
