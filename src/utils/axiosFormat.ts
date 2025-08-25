// import axios from "axios";
// import type { urlPropTypes } from "./types";
// import { endPoints } from "./apiLib";
// import { Storage } from "../stores/InAppStorage";
// import { errorAlert, successAlert } from "../components/alerts/ToastService";

// const baseUrl = (): string => `${import.meta.env.VITE_BASE_URL}`;

// export const apiCall = ({
//   urlExtra,
//   name,
//   data = {},
//   params = {},
//   action = () => undefined,
//   alert=true
// }: urlPropTypes) => {
//   return new Promise((res, rej) => {
//     const theName = name as keyof typeof endPoints;
//     // const userDetails: any = Storage?.getItem('user') || '{}';
//     const token: any = Storage?.getItem("token") || "";
//     const headers: any = endPoints[theName]?.headers || {};

//     if (endPoints[theName]?.auth) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }

//     axios({
//       url: `${baseUrl()}${endPoints[theName]?.url}${urlExtra || ""}`,
//       method: endPoints[theName]?.method,
//       headers,
//       data,
//       params,
//     })
//       .then(async (r) => {
//         const returned = await action(r.data);
//         console.log(r, "Response Data:", returned);
//         res(r.data.respBody || r.data)
//         if (alert) {
//         successAlert(
//           "Success",
//           r?.data?.message || "Request completed successfully."
//         );}
//         // if (r.data.respCode === "00" || r.status === 200) {
//         //   res(r.data.respBody || r.data);
//         // } else {
//         //   console.error("Response Error:", r);
//         //   errorAlert("Oops!", r.data.respMessage || "Something went wrong.");
//         // }
//       })
//       .catch((err) => {
//         const errorMessage =
//           err.response?.data?.message || err.message || "Something went wrong.";
      
//         if (err.response?.status === 401) {
//           Storage.clearItem();
//           // Use window.location to redirect and pass message in query param
//           window.location.href = `/?state=notAuthenticated&message=${encodeURIComponent(errorMessage)}`;
//           return;
//         }
      
//         errorAlert("Network Error", errorMessage);
//         rej(err);
//       })
//   });
// };
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
        const returned = await action(r.data);
        console.log(r, "Response Data:", returned);
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
// ✅ Reusable pipeline runner
export async function runPipeline<T>(
  steps: ((input: T) => Promise<T>)[]
): Promise<T> {
  let result: T | undefined = undefined;
  for (const step of steps) {
    result = await step(result as T); // pass result forward
  }
  return result as T;
}
