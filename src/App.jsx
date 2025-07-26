import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/LoginPage"; 
import Register from "./pages/RegisterPage/RegisterPage"
import Dashboard from "./pages/DashboardPage/DashboardPage"
import NotFoundPage from "./pages/Components/NotFound";
import ProtectedRoute from "./pages/Components/ProtectedRoute";
import Logout from "./pages/Components/LogoutUser.js";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage"
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ### Rutas públicas ### */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ### Rutas protegidas ### */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Ruta genérica para páginas no encontradas */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
