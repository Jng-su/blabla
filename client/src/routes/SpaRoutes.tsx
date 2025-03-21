import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Chat from "../pages/Chat";

export const SpaRoutes = (isAuthenticated: boolean): RouteObject[] => [
  {
    path: "/",
    element: isAuthenticated ? <Navigate to="/chat" /> : <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/chat",
    element: isAuthenticated ? <Chat /> : <Navigate to="/" />,
  },
];
