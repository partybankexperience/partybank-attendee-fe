// routes/VerificationRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

type VerificationRouteProps = {
  children: React.ReactNode;
};

const VerificationRoute = ({ children }: VerificationRouteProps) => {
  const navigate = useNavigate();
  const verificationToken = useAuthStore((state) => state.verificationToken);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!verificationToken) {
      const message = encodeURIComponent("You must verify your email first.");
      navigate(`/login?state=notAuthenticated&message=${message}`, { replace: true });
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
  }, []);

  if (authorized === null) return null; // optionally loading spinner
  if (authorized === false) return null; // redirected already

  return <>{children}</>;
};

export default VerificationRoute;
