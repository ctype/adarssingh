import { Box } from "@chakra-ui/react";

import OverviewSection from "../../components/afterAuth/dashboard/OverviewSection";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { useEffect } from "react";
import { fetchOverview } from "@/features/admin/adminSlice";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { overview } = useAppSelector((state) => state.admins);

  useEffect(() => {
    dispatch(fetchOverview()).unwrap();
  }, [dispatch]);

  return (
    <Box minH={"90vh"} p={5}>
      <OverviewSection stats={overview} />
    </Box>
  );
}
