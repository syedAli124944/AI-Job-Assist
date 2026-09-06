import { isAuthenticated } from "../../lib/mockAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}
