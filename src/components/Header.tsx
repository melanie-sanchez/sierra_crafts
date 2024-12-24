import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useWishlist } from '../contexts/WishlistContext.tsx';

const UserMenu = styled.div`
  position: relative;
  cursor: pointer;
  color: white;
`;

const UserMenuTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserMenuDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 1000;
  min-width: 150px;
  margin-top: 0.5rem;

  /* Reset styles for child elements */
  & > * {
    color: initial;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  color: ${(props) => props.theme.colors.primary} !important;
  background: none;
  border: none;
  text-align: left;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;

  &&& {
    color: ${(props) => props.theme.colors.primary};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryLight};
    color: ${(props) => props.theme.colors.text} !important;
  }
`;

const HeaderContainer = styled.header`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  a {
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
`;

const CartIcon = styled(Link)`
  position: relative;
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -12px;
  background-color: #ff4d4d;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const AuthButton = styled(Link)`
  color: ${(props) => props.theme.colors.white};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.white};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  color: ${(props) => props.theme.colors.primary} !important;
  background: none;
  border: none;
  text-align: left;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &&& {
    color: ${(props) => props.theme.colors.primary};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryLight};
    color: ${(props) => props.theme.colors.text} !important;
  }
`;

const MyOrdersLink = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  color: ${(props) => props.theme.colors.primary} !important;
  background: none;
  border: none;
  text-align: left;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;

  &&& {
    color: ${(props) => props.theme.colors.primary};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryLight};
    color: ${(props) => props.theme.colors.text} !important;
  }
`;

const AdminDashboardLink = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  color: ${(props) => props.theme.colors.primary} !important;
  background: none;
  border: none;
  text-align: left;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;

  &&& {
    color: ${(props) => props.theme.colors.primary};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryLight};
    color: ${(props) => props.theme.colors.text} !important;
  }
`;

export const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, isAdminUser, logout } = useAuth();

  const { cartCount } = useCart();

  const { wishlist } = useWishlist();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Sierra Crafts</Logo>
        <NavLinks>
          <Link to="/about">About</Link>
          <Link to="/calendar">Events</Link>
          <Link to="/candles">Candles</Link>
          <Link to="/earrings">Earrings</Link>
          <Link to="/stickers">Stickers</Link>
          <Link to="/wishlist">❤️ Wishlist ({wishlist.length})</Link>

          <CartIcon to="/cart">
            🛒
            {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
          </CartIcon>

          {user ? (
            <UserMenu ref={menuRef}>
              <UserMenuTrigger onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <span>👤 {user.email}</span>
              </UserMenuTrigger>
              <UserMenuDropdown isOpen={userMenuOpen}>
                {isAdminUser ? (
                  <>
                    <AdminDashboardLink to="/admin">
                      Admin Dashboard
                    </AdminDashboardLink>
                    <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
                  </>
                ) : (
                  <>
                    <MyOrdersLink to="/my-orders">My Orders</MyOrdersLink>
                    <DropdownItem to="/cart">Cart</DropdownItem>
                    <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
                  </>
                )}
              </UserMenuDropdown>
            </UserMenu>
          ) : (
            <AuthLinks>
              <AuthButton to="/login">Login</AuthButton>
              <AuthButton to="/register">Sign Up</AuthButton>
            </AuthLinks>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};
