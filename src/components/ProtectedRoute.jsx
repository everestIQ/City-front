import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If not logged in, go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is defined and userRole is not in it → block
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // send them back home
  }

  return children;
}

