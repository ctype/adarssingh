import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/app/store";

import OverviewSection from "@/components/afterAuth/dashboard/OverviewSection";
import { fetchUserOverview } from "@/features/system_user/systemUserSlice";

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { myProfile, overview } = useAppSelector((state) => state.systemUser);

  useEffect(() => {
    dispatch(fetchUserOverview()).unwrap();
  }, [dispatch]);

  return (
    <Box>
      <h2>Welcome back, {myProfile?.firstName}</h2>
      <OverviewSection stats={overview} />
    </Box>
  );
}
