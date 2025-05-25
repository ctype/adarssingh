import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/app/store";

export default function AuthRoute({ role }: { role: string }) {
  const { user, isPending } = useAppSelector((state) => state.auth);

  if (isPending) return <></>;

  return user ? (
    user.role === role ? (
      <Outlet />
    ) : (
      <Navigate to="/unauthorized" />
    )
  ) : (
    <Navigate to={`/auth/login`} />
  );
}
