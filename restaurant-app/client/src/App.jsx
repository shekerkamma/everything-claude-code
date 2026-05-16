import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Menu from './pages/Menu.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Favorites from './pages/Favorites.jsx';
import Reservations from './pages/Reservations.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="*" element={<div className="p-8 text-center text-slate-500">404 — page not found.</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
