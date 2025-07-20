import { Route, Routes } from "react-router"
import Home from "./pages/home/Home"


function App() {
  

  return (
    <Routes>
      <Route
        path="/"
        element={<Home/>} // Replace with your Home component
      />
    </Routes>
  )
}

export default App
