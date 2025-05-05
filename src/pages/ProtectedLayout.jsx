import { Navigate, Outlet } from 'react-router-dom';
import { useAuthProvider } from "../hook/use-auth-provider.js";

const ProtectedLayout = () => {
  console.log("Rendering ProtectedLayout");
  
  // This component is used to protect routes that require authentication
  const { user } = useAuthProvider();
  console.log("User in ProtectedLayout:", user);
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

export default ProtectedLayout;