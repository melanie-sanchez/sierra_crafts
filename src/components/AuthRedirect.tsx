import React from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  return {
    redirectToLogin: () => navigate('/login'),
  };
};
