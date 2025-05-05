import { Navigate, Outlet } from 'react-router-dom';
import { useAuthProvider } from "../hook/use-auth-provider.js";

const ProtectedLayout = () => {
  const { user } = useAuthProvider();
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

export default ProtectedLayout;