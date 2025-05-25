// import axios, { AxiosResponse } from "axios";
import { DocumentNode } from "@apollo/client";

import apolloClient from "./apolloClient";
import { toaster } from "@/components/ui/toaster";
import { isRejectedWithValue } from "@reduxjs/toolkit";

export const apolloClientQuery = async (
  query: DocumentNode,
  variables: object,
) => {
  try {
    const result = await apolloClient.query({
      query,
      variables,
      errorPolicy: "all",
    });
    if (result.errors && result.errors.length > 0) {
      return isRejectedWithValue(result.errors);
    }
    return result.data;
  } catch (error) {
    if ((error as Error).message === "Unauthorized: No token provided") {
      toaster.error({
        title: "Session Expired",
        description: "Please login to continue.",
      })
      setTimeout(() => {
        const currentLocation = document.location.href;
        document.location.href = `/auth/login?redirect=${currentLocation}`;
      }, 1500);
    } else {
      toaster.create({
        type: "error",
        title: "Error occured",
        description: (error as Error).message,
      });
      return isRejectedWithValue("Network Error");
    }
  }
}

export const apolloClientMutate = async (
  mutation: DocumentNode,
  variables: object,
  headers?: object,
  options?: object,
) => {
  try {
    const result = await apolloClient.mutate({
      mutation,
      variables,
      context: {
        headers,
        ...options,
      },
      errorPolicy: "all",
    });
    if (result.errors && result.errors.length > 0) {
      return { errors: result.errors[0] }
    }
    return result.data;
  } catch (error) {
    if ((error as Error).message === "Unauthorized: No token provided") {
      toaster.error({
        title: "Session Expired",
        description: "Please login to continue.",
      })
      setTimeout(() => {
        const currentLocation = document.location.href;
        document.location.href = `/auth/login?redirect=${currentLocation}`;
      }, 1500);
    } else {
      toaster.create({
        type: "error",
        title: "Error occured",
        description: (error as Error).message,
      });
      return isRejectedWithValue({ error: (error as Error).message })
    }
  }
}

// const convertAxiosResponseToFetchResponse = (axiosResponse: AxiosResponse): Response => {
//   const body = new Blob([axiosResponse.data], { type: axiosResponse.headers['content-type'] });
//   const responseInit: ResponseInit = {
//     status: axiosResponse.status,
//     statusText: axiosResponse.statusText,
//     headers: new Headers(Object.entries(axiosResponse.headers)),
//   };
//   return new Response(body, responseInit);
// };

// interface CustomRequestInit extends RequestInit {
//   onUploadProgress?: (progressEvent: ProgressEvent) => void;
// }

// export const customFetch = (uri: RequestInfo | URL, options: CustomRequestInit | undefined): Promise<Response> => {
//   if (options?.body?.toString().includes('UploadFile')) {
//     return axios.post(uri as string, options.body, {
//       headers: options.headers as Record<string, string>,
//       ...options.headers,
//       onUploadProgress: (progressEvent) => {
//         if (options.onUploadProgress) {
//           options.onUploadProgress(progressEvent as unknown as ProgressEvent);
//         }
//       }
//     }).then((res) => convertAxiosResponseToFetchResponse(res));
//   }

//   return fetch(uri, options);
// }
