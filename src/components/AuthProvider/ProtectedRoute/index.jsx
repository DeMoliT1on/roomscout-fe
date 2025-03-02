import { Navigate } from "react-router-dom";
import { useAuth } from "..";

export const ProtectedRoute = ({ children }) => {
  const { user, token, refreshToken } = useAuth();
  if (!user || user.role === -1 || !token || !refreshToken) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
