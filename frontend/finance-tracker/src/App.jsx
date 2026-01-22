import React, { useContext } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserProvider, { UserContext } from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import InstallPWA from "./components/InstallPWA";
import { Suspense, lazy } from "react";

// Lazy load pages
const Login = lazy(() => import("./pages/Auth/Login"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));
const AIInsights = lazy(() => import("./pages/Dashboard/AIInsights"));
const Landing = lazy(() => import("./pages/Landing/Landing"));

// Loading component while checking auth
const AuthLoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// App content that uses UserContext
const AppContent = () => {
  const { isAuthChecking } = useContext(UserContext);

  // Show loading screen while checking authentication
  if (isAuthChecking) {
    return <AuthLoadingScreen />;
  }

  return (
    <div>
      <Router>
        <InstallPWA />
        <Suspense fallback={<AuthLoadingScreen />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/ai-insights" exact element={<AIInsights />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;
