import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { getServerCookie, refreshServerCookie } from "@/helpers/cookieHelper";
import { setPending, setUser } from "@/features/auth/authSlice";
import { setMyProfile } from "@/features/system_user/systemUserSlice";

export default function PersistLoginRoute() {
  const dispatch = useAppDispatch();
  const { user, isPending } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkPresist = async () => {
      const { accessToken, refreshToken } = await getServerCookie();

      if (accessToken && refreshToken) {
        const userData = localStorage.getItem("user");
        if (userData) {
          dispatch(setUser(JSON.parse(userData)));
          dispatch(setMyProfile(JSON.parse(userData)));
        }
      }

      if (!accessToken && refreshToken) {
        const data = await refreshServerCookie();
        if (data.message && data.message === "Unauthorized") {
          localStorage.removeItem("user");
          dispatch(setUser(null));
          dispatch(setMyProfile(null));
        } else {
          const userData = localStorage.getItem("user");
          if (userData) {
            dispatch(setUser(JSON.parse(userData)));
            dispatch(setMyProfile(JSON.parse(userData)));
          }
        }
      }
    };

    if (!user) {
      dispatch(setPending(true));
      checkPresist().finally(() => {
        dispatch(setPending(false));
      });
    }
  }, []);

  return isPending ? <></> : <Outlet />;
}
