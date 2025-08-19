// import  {  useEffect, useState, type ReactNode } from "react";
// import { useNavigate } from "react-router";
// import { Storage } from "../stores/InAppStorage";

// type PrivateRouteProps = {
//   children: ReactNode;
// };

// const PrivateRoute = ({ children }: PrivateRouteProps) => {
//   const navigate = useNavigate();
//   const [authorized, setAuthorized] = useState<boolean | null>(null);

//   useEffect(() => {
//     const token = Storage.getItem("token");

//     if (!token) {
//       // Redirect to login with query params
//       const message = encodeURIComponent("You must be logged in to access this page.");
//       navigate(`/login?state=notAuthenticated&message=${message}`, { replace: true });
//       setAuthorized(false);
//       return;
//     }

//     // Token exists — optionally verify here...

//     setAuthorized(true);
//   }, [navigate]);

//   if (authorized === null) {
//     return null; // or loading spinner
//   }

//   if (authorized === false) {
//     return null; // redirected already, don’t render children
//   }

//   return <>{children}</>;
// };

// export default PrivateRoute;
// PrivateRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      const message = encodeURIComponent("You must be logged in to access this page.");
      navigate(`/login?state=notAuthenticated&message=${message}`, { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null; // optionally loading spinner

  return <>{children}</>;
};

export default PrivateRoute;
