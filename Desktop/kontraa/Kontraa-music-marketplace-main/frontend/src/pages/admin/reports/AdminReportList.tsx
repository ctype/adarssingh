import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { fetchReports } from "@/features/report/reportSlice";
import { Box, Flex, Span, Text, VStack } from "@chakra-ui/react";
import { AudioWaveform, Music, Music2 } from "lucide-react";

export default function AdminReportList() {
  const dispatch = useAppDispatch();
  const { reports, isPending } = useAppSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchReports({ status: "pending" })).unwrap();
    // eslint-disable-next-line
  }, []);

  return (
    <ListViewWrapper title="Reports" hasAdd={false} isLoading={isPending}>
      {reports.map((report) => (
        <Box
          key={report.id}
          px={6}
          py={4}
          backgroundColor="gray.900"
          mb={4}
          rounded={"md"}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <VStack alignItems="start">
              <Flex gap={2} alignItems={"center"} maxW="300px">
                <Span backgroundColor={"gray.700"} p={2} rounded={"md"}>
                  {report.entityName === "Track" ? (
                    <Music />
                  ) : report.entityName === "SoundBank" ? (
                    <AudioWaveform />
                  ) : (
                    <Music2 />
                  )}
                </Span>
                <Text truncate>{report.remark}</Text>
              </Flex>
            </VStack>
          </Flex>
        </Box>
      ))}
    </ListViewWrapper>
  );
}
