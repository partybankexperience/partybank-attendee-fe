import { useNavigate } from "react-router";
import { useCheckoutStore } from "../../stores/checkoutStore";
import { useEffect } from "react";
import { useTicketStore } from "../../stores/cartStore";
import { useConfirmModal, useForceLeaveModal } from "./ConfirmLeavingCheckout";

/**
 * useCheckoutLeaveGuards({ active, backTo, prompt })
 *
 * - active: boolean to arm/disarm
 * - backTo: url to navigate to if user confirms leaving (e.g. event details)
 * - prompt: optional custom confirmation text
 */

export function useCheckoutLeaveGuards({
  active,
  backTo,
  prompt = "Leaving now will cancel your checkout progress. Proceed?",
}: {
  active: boolean;
  backTo: string;
  prompt?: string;
}) {
  const cancelCheckout = useCheckoutStore((s) => s.cancelCheckout); // regular API cancel
const cancelCheckoutBeacon = useCheckoutStore((s) => s.cancelCheckoutBeacon); // beacon cancel
const navigate = useNavigate();

  const { reset } = useTicketStore();
  const { confirm, ModalComponent } = useConfirmModal();
  useEffect(() => {
    if (!active) return;

    // 1) Unload / close / refresh -> use beacon/keepalive
    const onUnload = () => {
      try {
        cancelCheckoutBeacon();
      } catch (e) {
        // swallow
      }
    };

    // 2) Back/Forward -> popstate
    const onPopState = async() => {
      // const ok = window.confirm(prompt);
      const ok= await confirm("Leaving now will cancel your checkout progress. Proceed?");
      if (ok) {
        // user confirmed -> do normal (awaited) cancel then navigate
        cancelCheckout("user_navigated_back").finally(() => {
          // reset the ticket state
          reset();
          navigate(backTo, { replace: true });
        });
      } else {
        // keep them on the page
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    // 3) Intercept same-origin anchor clicks (includes React Router <Link>)
    const onDocumentClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      // ignore external links, mailto, blank target, or anchors starting with #
      if (href.startsWith("http") && !href.startsWith(window.location.origin))
        return;
      if (anchor.target === "_blank") return;
      if (href.startsWith("#")) return;

      e.preventDefault();

      // const ok = window.confirm(prompt);
      const ok= await confirm("Leaving now will cancel your checkout progress. Proceed?");

      if (ok) {
        cancelCheckout("user_clicked_link").finally(() => {
          // we navigate using the anchor href to preserve expected behavior
          // if it's same-origin react-router link, navigate to it programmatically:
          if (href.startsWith("/")) {
            navigate(href);
          } else {
            window.location.href = href;
          }
        });
      }
    };

    window.addEventListener("pagehide", onUnload);
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onDocumentClick);

    // store pushState so back works the first time
    try {
      window.history.pushState(null, "", window.location.href);
    } catch {}

    return () => {
      window.removeEventListener("pagehide", onUnload);
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onDocumentClick);
    };
    
  }, [active, backTo, prompt, navigate, cancelCheckout, cancelCheckoutBeacon]);
  return { ModalComponent }
}


export function useCancelCheckout() {
  const cancelCheckout = useCheckoutStore((s) => s.cancelCheckout);
  const navigate = useNavigate();
  const { reset } = useTicketStore();
  const { confirm, ModalForceComponent} = useForceLeaveModal();

  async function handleCancelCheckout(backTo: string,title:string,description:string) {
    const ok = await confirm(description,title);
    if (ok) {
      cancelCheckout("user_navigated_back").finally(() => {
        reset();
        navigate(backTo, { replace: true });
      });
    } else {
      window.history.pushState(null, "", window.location.pathname);
    }
  }

  return { handleCancelCheckout, ModalForceComponent};
}

