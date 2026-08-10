import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  // =====================================================
  // Not Logged In
  // =====================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // =====================================================
  // Role Not Allowed
  // =====================================================

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // -------------------------------------------------
    // Redirect User To Their Own Dashboard
    // -------------------------------------------------

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "farmer") {
      return <Navigate to="/farmer/dashboard" replace />;
    }

    if (user.role === "buyer") {
      return <Navigate to="/buyer" replace />;
    }

    // -------------------------------------------------
    // Unknown Role
    // -------------------------------------------------

    return <Navigate to="/" replace />;
  }

  // =====================================================
  // Authorized
  // =====================================================

  return <Outlet />;
}

export default ProtectedRoute;
