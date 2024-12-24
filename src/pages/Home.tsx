import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PromoBanner } from '../components/PromoBanner.tsx';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.div`
  background-image: url('https://images.unsplash.com/photo-1469521669194-babb45599def');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroContent = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 8px;
`;

const FeaturedSection = styled.section`
  margin: 4rem 0;
  text-align: center;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CategoryCard = styled(Link)`
  background-color: ${(props) => props.theme.colors.white};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;
export const Home: React.FC = () => {
  return (
    <>
      <PromoBanner />
      <HomeContainer>
        <Hero>
          <HeroContent>
            <h1>Welcome to Sierra Crafts</h1>
            <p>Handcrafted products inspired by the Sierra Nevada</p>
          </HeroContent>
        </Hero>

        <FeaturedSection>
          <h2>Our Collections</h2>
          <CategoryGrid>
            <CategoryCard to="/candles">
              <h3>Natural Candles</h3>
              <p>Handmade with pure essential oils</p>
            </CategoryCard>
            <CategoryCard to="/earrings">
              <h3>Nature-Inspired Earrings</h3>
              <p>Crafted with sustainable materials</p>
            </CategoryCard>
            <CategoryCard to="/stickers">
              <h3>Sierra Nevada Stickers</h3>
              <p>Featuring local flora and fauna</p>
            </CategoryCard>
          </CategoryGrid>
        </FeaturedSection>
      </HomeContainer>
    </>
  );
};
