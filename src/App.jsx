import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/LoginPage"; 
import Register from "./pages/RegisterPage/RegisterPage"
import Dashboard from "./pages/DashboardPage/DashboardPage"
import NotFoundPage from "./pages/Components/NotFound";
import ProtectedRoute from "./pages/Components/ProtectedRoute";
import Logout from "./pages/Components/LogoutUser";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ### Rutas públicas ### */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* ### Rutas protegidas ### */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Ruta genérica para páginas no encontradas */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
