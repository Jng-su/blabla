import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dev from "../pages/Dev";
import Main from "../pages/Main";

export const SpaRoutes = (isAuthenticated: boolean): RouteObject[] => [
  {
    path: "/dev",
    element: <Dev />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: isAuthenticated ? <Navigate to="/main" /> : <SignIn />,
  },
  {
    path: "/main",
    element: isAuthenticated ? <Main /> : <Navigate to="/" />,
  },
];
