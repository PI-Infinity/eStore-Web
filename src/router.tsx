import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BarLoader, BounceLoader } from "react-spinners";
import styled from "styled-components";
import About from "./pages/about";
import Admin from "./pages/admin";
import Bag from "./pages/bag";
import Checkout from "./pages/checkout";
import FindUs from "./pages/findUs";
import Login from "./pages/login";
import MainPage from "./pages/main";
import ProductPage from "./pages/products/product/index";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { useTheme } from "./context/theme";
import Products from "./pages/products";
import AdminProducts from "./pages/admin/products/products";
import Orders from "./pages/admin/orders/orders";
import Settings from "./pages/admin/settings/settings";
import Users from "./pages/admin/users/users";
import Analytics from "./pages/admin/analytics/analytics";
import Messages from "./pages/admin/messages/messages";
import Team from "./pages/admin/team/team";
import Shipping from "./pages/admin/shipping/shipping";
import Finances from "./pages/admin/finances/finances";
import Coupons from "./pages/admin/coupons/coupons";
import Advertisements from "./pages/admin/advertisements/advertisements";
import { useCurrentUserContext } from "./context/currentUser";
import Content from "./pages/admin/content/contents";
import RouteChangeTracker from "./utils/routerChangeTracker";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
// import NotFoundPage from '../pages/404';

export const Routers = () => {
  const location = useLocation();

  const { currentUser } = useCurrentUserContext();

  function RequireLogout({ children }: any) {
    if (currentUser) {
      return <Navigate to="/profile" state={{ from: location }} />;
    }
    return children;
  }

  const { theme } = useTheme();

  const LoadingFallback = () => (
    <div
      style={{
        width: "100vw",
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BarLoader height={6} color={theme.primaryText} />;
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouteChangeTracker />
      <Routes>
        {/**
         * Welcome  routes
         */}
        <Route path="/" element={<MainPage />} />
        {/**
         * Bag  routes
         */}
        <Route path="/cart" element={<Bag />} />
        {/**
         * Checkout  routes
         */}
        <Route path="/checkout" element={<Checkout />} />
        {/**
         * Checkout  routes
         */}
        <Route
          path="/login"
          element={
            <RequireLogout>
              <Login />
            </RequireLogout>
          }
        />
        {/**
         * Checkout  routes
         */}
        <Route
          path="/register"
          element={
            <RequireLogout>
              <Register />
            </RequireLogout>
          }
        />
        {/**
         * About  routes
         */}
        <Route path="/about" element={<About />} />
        {/**
         * About  routes
         */}
        <Route path="/findus" element={<FindUs />} />
        {/**
         * Profile  routes
         */}
        <Route path="/profile" element={<Profile />} />
        {/**
         * Products  routes
         */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductPage />} />
        {/**
         * Product  routes
         */}
        <Route path="/admin" element={<Admin />}>
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="team" element={<Team />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="finances" element={<Finances />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="content" element={<Content />} />
          <Route path="advertisements" element={<Advertisements />} />
        </Route>
        {/**
         * privacy  routes
         */}
        <Route path="/privacy" element={<Privacy />} />
        {/**
         * terms  routes
         */}
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Suspense>
  );
};
