import { useAuth } from "./contexts/AuthProvider";
import { Navigate } from "react-router-dom";

function App({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
