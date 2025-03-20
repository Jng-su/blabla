import { Routes, Route } from "react-router-dom";
import { useAuthStatusQuery } from "./query/queries/auth";
import { SpaRoutes } from "./routes/SpaRoutes";

export default function AppContent() {
  const { data } = useAuthStatusQuery();
  const isAuthenticated = data?.isAuthenticated || false;

  return (
    <div className="max-w-[80%] mx-auto h-screen flex items-center justify-center">
      <Routes>
        {SpaRoutes(isAuthenticated).map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}
