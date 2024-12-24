import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const AboutImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin: 2rem 0;
`;

const Section = styled.section`
  margin: 3rem 0;
`;

const Values = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ValueCard = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const About: React.FC = () => {
  return (
    <AboutContainer>
      <h1>About Sierra Crafts</h1>
      <AboutImage
        src="https://images.unsplash.com/photo-1508923567004-3a6b8004f3d7"
        alt="Sierra Nevada mountains"
      />

      <Section>
        <h2>Our Story</h2>
        <p>
          Founded in the heart of the Sierra Nevada, Sierra Crafts brings the
          beauty of nature into your everyday life through our handcrafted
          products. Each piece is carefully created with sustainable materials
          and inspired by the magnificent landscapes that surround us.
        </p>
      </Section>

      <Section>
        <h2>Our Values</h2>
        <Values>
          <ValueCard>
            <h3>Sustainability</h3>
            <p>
              We use eco-friendly materials and packaging in all our products.
            </p>
          </ValueCard>
          <ValueCard>
            <h3>Craftsmanship</h3>
            <p>Every item is handmade with attention to detail and quality.</p>
          </ValueCard>
          <ValueCard>
            <h3>Community</h3>
            <p>
              We support local artisans and give back to environmental causes.
            </p>
          </ValueCard>
        </Values>
      </Section>
    </AboutContainer>
  );
};
