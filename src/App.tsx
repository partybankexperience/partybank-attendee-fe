import { Route, Routes } from "react-router"
import Home from "./pages/home/Home"
import Checkout from "./pages/checkout/Checkout"
import Login from "./pages/onBoarding/Login"
import SignUp from "./pages/onBoarding/SignUp"
import EmailVerification from "./pages/onBoarding/EmailVerification"


function App() {
  

  return (
    <Routes>
      <Route
        path="/"
        element={<Home/>} // Replace with your Home component
      />
      <Route
        path="/login"
        element={<Login/>} // Replace with your Home component
      />
      <Route
        path="/signup"
        element={<SignUp/>} // Replace with your Home component
      />
      <Route
        path="/email-verification"
        element={<EmailVerification/>} // Replace with your Home component
      />
      <Route
        path="/checkout"
        element={<Checkout/>} // Replace with your About component
      />
    </Routes>
  )
}

export default App
