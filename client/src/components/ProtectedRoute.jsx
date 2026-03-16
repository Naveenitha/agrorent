import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // role restriction
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;

}

export default ProtectedRoute;