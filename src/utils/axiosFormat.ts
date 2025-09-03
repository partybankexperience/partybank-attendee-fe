import axios from "axios";
import type { urlPropTypes } from "./types";
import { endPoints } from "./apiLib";
import { Storage } from "../stores/InAppStorage";
import { useAuthStore } from "../stores/useAuthStore";
import { errorAlert, successAlert } from "../components/alerts/ToastService";

const baseUrl = (): string => `${import.meta.env.VITE_BASE_URL}`;

export const apiCall = ({
  urlExtra,
  name,
  data = {},
  params = {},
  action = () => undefined,
  alert = true,
  useVerificationToken = false, // new flag
}: urlPropTypes & { useVerificationToken?: boolean }) => {
  return new Promise((res, rej) => {
    const theName = name as keyof typeof endPoints;

    // Decide which token to use
    const authStore = useAuthStore.getState(); // direct getState for non-hook
    let token = useVerificationToken
      ? authStore.verificationToken
      : Storage?.getItem("token") || "";

    const headers: any = endPoints[theName]?.headers || {};

    if (endPoints[theName]?.auth) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    axios({
      url: `${baseUrl()}${endPoints[theName]?.url}${urlExtra || ""}`,
      method: endPoints[theName]?.method,
      headers,
      data,
      params,
    })
      .then(async (r) => {
        await action(r.data);
        res(r.data.respBody || r.data);

        if (alert) {
          successAlert(
            "Success",
            r?.data?.message || "Request completed successfully."
          );
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong.";

        if (err.response?.status === 401) {
          Storage.clearItem();
          window.location.href = `/login?state=notAuthenticated&message=${encodeURIComponent(
            errorMessage
          )}`;
          return;
        }

        errorAlert("Network Error", errorMessage);
        rej(err);
      });
  });
};

// // ✅ Reusable pipeline runner

export async function runPipeline<T>(
  steps: ((input: T | undefined) => Promise<T | undefined>)[]
): Promise<T | undefined> {
  let result: T | undefined = undefined;

  for (const step of steps) {
    try {
      const next = await step(result);

      // If step returns undefined, treat it as "stop here"
      if (next === undefined) {
        return result; // exit early with last successful result
      }

      result = next;
    } catch (err) {
      // Propagate error upward — pipeline halts immediately
      throw err;
    }
  }

  return result;
}
