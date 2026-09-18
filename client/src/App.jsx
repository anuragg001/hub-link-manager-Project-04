import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';
import LinkLibrary from './pages/LinkLibrary';
import BioBuilder from './pages/BioBuilder';
import PublicBioPage from './pages/PublicBioPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          
          <Route path="/bio/:username" element={<PublicBioPage />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="links" element={<LinkLibrary />} />
            <Route path="bio" element={<BioBuilder />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;