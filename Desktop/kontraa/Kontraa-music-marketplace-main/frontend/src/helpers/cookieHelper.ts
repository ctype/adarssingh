import { apolloConfig } from "../config/apolloConfig";

export const getServerCookie = async () => {
  let tokens = {
    refreshToken: "",
    accessToken: "",
  }

  const res = await fetch(apolloConfig.apiCookieUrl, {
    credentials: "include",
  })
  const response = await res.json();

  if (response) {
    tokens = {
      refreshToken: response.refreshToken,
      accessToken: response.accessToken,
    };
  }

  return tokens;
};

export const refreshServerCookie = async () => {
  try {
    const res = await fetch(apolloConfig.apiCookieRefreshUrl, {
      credentials: "include",
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.error(error);
  }
}
