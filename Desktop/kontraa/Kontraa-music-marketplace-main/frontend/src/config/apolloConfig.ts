export const apolloConfig = Object.freeze({
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  apiCookieUrl: import.meta.env.VITE_API_COOKIE_URL || "http://localhost:8000/cookie",
  apiCookieRefreshUrl: import.meta.env.VITE_API_COOKIE_REFRESH_URL || "http://localhost:8000/refresh-token",
  apiClearCookieUrl: import.meta.env.VITE_API_CLEAR_COOKIE_URL || "http://localhost:8000/clear-cookie",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleUserInfo: import.meta.env.VITE_GOOGLE_USER_INFO || "https://www.googleapis.com/oauth2/v3/userinfo",
});
