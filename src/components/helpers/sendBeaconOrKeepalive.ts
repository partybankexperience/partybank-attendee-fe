export async function sendBeaconOrKeepalive(url: string, payload: unknown) {
    const body = JSON.stringify(payload);
  
    // 1) try navigator.sendBeacon (best for unload)
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      try {
        const ok = navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
        if (ok) return { ok: true, via: "beacon" };
      } catch {
        // fallthrough to fetch
      }
    }
  
    // 2) fallback: fetch with keepalive (modern browsers)
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true, // hint for the browser to allow this during unload
        credentials: "include",
      });
      return { ok: true, via: "fetch" };
    } catch (err) {
      return { ok: false, error: err };
    }
  }
  