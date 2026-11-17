import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './resgister';
import ForgotPassword from './forgotpassword';
import ResetPassword from './';

const Auth = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="resgister" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default Auth;
