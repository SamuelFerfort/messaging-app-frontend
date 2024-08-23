import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

function PublicRoute({ children }) {
  const { user } = useAuth();
  console.log(user)
  
  if (user) {
    return <Navigate to="/chats" replace />;
  }

  return children;
}

export default PublicRoute;