import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: ${(props) => props.theme.colors.white};
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/candles">Candles</Link>
            </li>
            <li>
              <Link to="/earrings">Earrings</Link>
            </li>
            <li>
              <Link to="/stickers">Stickers</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </FooterSection>
        <FooterSection>
          <h3>Contact Us</h3>
          <ul>
            <li>Email: info@sierracrafts.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Address: Sierra Nevada, CA</li>
          </ul>
        </FooterSection>
        <FooterSection>
          <h3>Follow Us</h3>
          <ul>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Pinterest</a>
            </li>
          </ul>
        </FooterSection>
      </FooterContent>
      <Copyright>
        <p>© 2024 Sierra Crafts. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};
