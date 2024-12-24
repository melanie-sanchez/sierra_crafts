import React from 'react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 1rem;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

interface SaleBannerProps {
  message: string;
  onClose: () => void;
}

export const SaleBanner: React.FC<SaleBannerProps> = ({ message, onClose }) => {
  return (
    <BannerContainer>
      {message}
      <CloseButton onClick={onClose}>×</CloseButton>
    </BannerContainer>
  );
};
