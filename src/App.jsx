import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/LoginPage"; 


import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ### Rutas públicas ### */}
        <Route path="/" element={<Login />} />

        {/* <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
