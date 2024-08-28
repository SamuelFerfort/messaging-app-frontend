import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import PropTypes from "prop-types";

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
