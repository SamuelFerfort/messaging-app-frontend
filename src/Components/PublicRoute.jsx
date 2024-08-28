import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import PropTypes from "prop-types";

PublicRoute.propTypes = {
  children: PropTypes.node,
};

function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/chats" replace />;
  }

  return children;
}

export default PublicRoute;
