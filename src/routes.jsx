import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Chats from "./Pages/Chats";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import Error from "./Components/Error"; // Import the new Error component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/chats",
    element: (
      <ProtectedRoute>
        <Chats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/error",
    element: <Error statusCode={500} message="Internal Server Error" />,
  },
  {
    path: "*",
    element: <Error />, 
  },
]);

export default router;