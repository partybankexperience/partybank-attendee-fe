import { useEffect } from "react";
import { useCheckoutStore } from "../../stores/checkoutStore";
import { useNavigate } from "react-router-dom";

const useCancelOnLeave = (eventName: string) => {
  const cancelCheckout = useCheckoutStore((state) => state.cancelCheckout);
  const navigate = useNavigate();

  useEffect(() => {
    // Handler for page unload / closing tab
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const confirmationMessage = "Leaving now will cancel your checkout progress. Are you sure?";
      e.preventDefault();
      e.returnValue = confirmationMessage; // Chrome requires setting returnValue
      return confirmationMessage;
    };

    // Handler for internal navigation (back/forward or link clicks)
    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "Leaving now will cancel your checkout progress. Are you sure?"
      );
      if (confirmLeave) {
        // Cancel checkout via sendBeacon
        cancelCheckout("User left page");

        // Redirect to event page
        navigate(`/event-details/${eventName}`, { replace: true });
      } else {
        // Stay on the page: push state back so history doesn't move
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [cancelCheckout, navigate, eventName]);
};

export default useCancelOnLeave;
