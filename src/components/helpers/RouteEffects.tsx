import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    console.log('App component loaded successfully');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null; // This component doesn't render anything
}
