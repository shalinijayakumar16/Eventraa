import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Prevent unauthorized access to admin dashboard
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default AdminRoute;