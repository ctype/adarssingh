import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { apolloConfig } from "../config/apolloConfig";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getServerCookie } from "../helpers/cookieHelper";
// import { customFetch } from "./apolloHelper";

const httpLink = createUploadLink({
  uri: `${apolloConfig.apiUrl}/graphql`,
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Optionally filter errors for specific operations using operation.getContext()
  if (operation.getContext().suppressGlobalError) return;
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      const message = error.message;
      const code = (error as { code?: string }).code;
      console.error(`[GraphQL error]: ${message}${code ? ` (code: ${code})` : ""}`);
      if (message === "Unauthorized: No token provided") {
        setTimeout(() => {
          const currentLocation = document.location.href;
          document.location.href = `/auth/login?redirect=${currentLocation}`;
        }, 1500);
      }
    });
    // Display global notification, e.g. toast
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const authLink = setContext(async (_, { headers }) => {
  const { accessToken, refreshToken } = await getServerCookie();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
      "refresh-token": refreshToken ? `${refreshToken}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
