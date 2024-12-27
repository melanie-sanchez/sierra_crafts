import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme.ts'; // Updated import
import { GlobalStyles } from './styles/GlobalStyles.ts';

import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { Home } from './pages/Home.tsx';
import { About } from './pages/About.tsx';
import { Admin } from './pages/Admin.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import { Cart } from './pages/Cart.tsx';
import { Checkout } from './pages/Checkout.tsx';

import { Calendar } from './pages/Calendar.tsx';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { Login } from './components/Login.tsx';
import { Register } from './pages/Register.tsx';
import styled from 'styled-components';
import { MyOrders } from './pages/MyOrders.tsx';

import { ProtectedRoute } from './components/ProtectedRoute.tsx';

import { OrderDetails } from './pages/OrderDetails.tsx';
import { Wishlist } from './pages/Wishlist.tsx';
import { WishlistProvider } from './contexts/WishlistContext.tsx';
import { AuthCartHandler } from './components/AuthCartHandler.tsx';
import { ForgotPassword } from './components/ForgotPassword.tsx';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1 0 auto;
`;

export const App: React.FC = () => {
  return (
    <Router basename="/sierra_crafts">
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              <AuthCartHandler />

              <AppContainer>
                <Header />
                <MainContent>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/candles"
                      element={<CategoryPage category="candles" />}
                    />
                    <Route
                      path="/earrings"
                      element={<CategoryPage category="earrings" />}
                    />
                    <Route
                      path="/stickers"
                      element={<CategoryPage category="stickers" />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly>
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-orders"
                      element={
                        <ProtectedRoute>
                          <MyOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/order/:orderId" element={<OrderDetails />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                  </Routes>
                </MainContent>
                <Footer />
              </AppContainer>
            </ThemeProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
};
