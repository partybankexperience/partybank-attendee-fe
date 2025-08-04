import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null; // This component doesn't render anything
}
