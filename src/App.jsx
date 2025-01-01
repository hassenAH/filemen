import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuthContext } from 'hooks/useAuthContext';
import { useCartContext } from 'hooks/useCartContext';

import ProductProvider from 'context/product/ProductProvider';
import CheckoutProvider from 'context/checkout/CheckoutProvider';

import { Layout } from 'components/layouts';
import { ProtectedRoutes } from 'components/routes';

import {
  HomePage,
  AccountPage,
  AddressesPage,
  LoginPage,
  SignUpPage,
  CollectionPage,
  ProductPage,
  CartPage,
  CheckoutPage,
} from './components/pages';

import { Loader } from './components/common';

import './App.scss';
import 'swiper/css';

const App = () => {
  const { authIsReady } = useAuthContext();
  const { cartIsReady } = useCartContext();

  const location = useLocation();

  // Scroll to the top on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Debugging: Log states for auth and cart readiness
  useEffect(() => {
    console.log('[App] authIsReady:', authIsReady);
    console.log('[App] cartIsReady:', cartIsReady);
  }, [authIsReady, cartIsReady]);

  // Optional Fallback logic to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!authIsReady || !cartIsReady) {
        console.warn('[App] Fallback triggered: Loading taking too long.');
        if (!authIsReady) console.warn('[App] authIsReady still false.');
        if (!cartIsReady) console.warn('[App] cartIsReady still false.');
      }
    }, 10000); // 10-second timeout

    return () => clearTimeout(timeout);
  }, [authIsReady, cartIsReady]);

  return (
    <>
      <div className="fonts_license">
        Font made from{' '}
        <a href="http://www.onlinewebfonts.com" target="_blank" rel="noopener noreferrer">
          oNline Web Fonts
        </a>{' '}
        is licensed by CC BY 3.0
      </div>
      {/* Show loader until both states are ready */}
      {(!authIsReady || !cartIsReady) && <Loader />}
      {/* Render routes only when ready */}
      {authIsReady && cartIsReady && (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="collections/:id" element={<CollectionPage />} />
            <Route
              path="products/:id"
              element={
                <ProductProvider>
                  <ProductPage />
                </ProductProvider>
              }
            />
            <Route path="cart" element={<CartPage />} />

            {/* Protected Routes for authenticated users */}
            <Route element={<ProtectedRoutes needAuth={true} />}>
              <Route
                path="checkout"
                element={
                  <CheckoutProvider>
                    <CheckoutPage />
                  </CheckoutProvider>
                }
              />
              <Route path="account" element={<AccountPage />} />
              <Route path="account/addresses" element={<AddressesPage />} />
            </Route>

            {/* Routes for unauthenticated users */}
            <Route element={<ProtectedRoutes needAuth={false} />}>
              <Route path="account/login" element={<LoginPage />} />
              <Route path="account/signup" element={<SignUpPage />} />
            </Route>

            {/* Fallback to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;
