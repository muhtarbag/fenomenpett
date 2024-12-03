import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Index = lazy(() => import("@/pages/Index"));
const Submit = lazy(() => import("@/pages/Submit"));
const Blog = lazy(() => import("@/pages/Blog"));
const Admin = lazy(() => import("@/pages/Admin"));
const Login = lazy(() => import("@/pages/Login"));
const CheckStatus = lazy(() => import("@/pages/CheckStatus"));

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Yükleniyor...</div>}>
            <Index />
          </Suspense>
        }
      />
      <Route
        path="/submit"
        element={
          <Suspense fallback={<div>Yükleniyor...</div>}>
            <Submit />
          </Suspense>
        }
      />
      <Route
        path="/blog"
        element={
          <Suspense fallback={<div>Yükleniyor...</div>}>
            <Blog />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<div>Yükleniyor...</div>}>
            {isAuthenticated ? <Admin /> : <Login />}
          </Suspense>
        }
      />
      <Route
        path="/check-status"
        element={
          <Suspense fallback={<div>Yükleniyor...</div>}>
            <CheckStatus />
          </Suspense>
        }
      />
    </Routes>
  );
};