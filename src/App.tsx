import { Route, Routes, useLocation } from "react-router";
import Home from "./pages/home/Home";
import Checkout from "./pages/checkout/Checkout";
import Login from "./pages/onBoarding/Login";
import SignUp from "./pages/onBoarding/SignUp";
import EmailVerification from "./pages/onBoarding/EmailVerification";
import Profile from "./pages/profile";
import { useEffect } from "react";
import PrivateRoute from "./utils/privateRoute";
import EventDetails from "./pages/EventDetails/EventDetailContainer";
import Confirmation from "./pages/Confirmation/TicketConfirmation";
import VerificationRoute from "./utils/verificationRoute";
import ForgotPassword from "./pages/onBoarding/forgotPassword/ForgotPassword";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/signup"
        element={
          <VerificationRoute>
            <SignUp />
          </VerificationRoute>
        }
      />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route path="/event-details/:slug" element={<EventDetails />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
