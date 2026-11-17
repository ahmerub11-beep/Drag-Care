import CustomRoutes from './pages/Routes';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <CustomRoutes />
    </AuthProvider>
  );
}
