import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Chats from "./Pages/Chats";
import ProtectedRoute from "./components/ProtectedRoute";

const routes = (isAuthenticated) => [
  {
    path: "/",
    element: isAuthenticated ? <Navigate to="/chats" replace /> : <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: isAuthenticated ? <Navigate to="/chats" replace /> : <Login />,
  },
  {
    path: "/sign-up",
    element: isAuthenticated ? <Navigate to="/chats" replace /> : <SignUp />,
  },
  {
    path: "/chats",
    element: <ProtectedRoute><Chats /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

const createRouter = (isAuthenticated) => createBrowserRouter(routes(isAuthenticated));

export default createRouter;
