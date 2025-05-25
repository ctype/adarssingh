import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Span,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { fetchAudios, setAudios } from "@/features/audio/audioSlice";
import CustomDialog from "@/components/global/CustomDialog";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomNoActionDialog from "@/components/global/CustomNoActionDialog";
import ContributorTrackCard from "@/pages/contributor/track/_components/ContributorTrackCard";
import { acceptRejectTrackRequest } from "@/features/admin/adminSlice";
import { FormDialog } from "@/components/form/FormDialog";
import CustomInput from "@/components/form/CustomInput";

export default function TrackRequest() {
  const dispatch = useAppDispatch();
  const { audios } = useAppSelector((state) => state.audios);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [resolve, setResolve] = useState("");

  const handleAcceptRejectTrackRequest = async (
    id: number,
    status: number,
    rejectData: string[]
  ) => {
    await dispatch(
      acceptRejectTrackRequest({ id, status, rejectData, type: "track" })
    )
      .unwrap()
      .then((d) => {
        if (d.acceptRejectTrackRequest) {
          const updatedAudios = audios.map((a) => {
            if (a.id === id) {
              return {
                ...a,
                status: status,
              };
            }
            return a;
          });

          setReason("");
          setOpen(false);
          dispatch(setAudios(updatedAudios));
        }
      });
  };

  useEffect(() => {
    dispatch(
      fetchAudios({ filter: { limit: 100, status: 3, isDraft: false } })
    ).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper title="Track Review Request" hasAdd={false}>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          mdToLg: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)",
        }}
        gap={4}
      >
        {audios.length === 0 && (
          <GridItem colSpan={5} textAlign={"center"} py={10}>
            <Text>No rejected track request found</Text>
          </GridItem>
        )}
        {audios.map((a) => (
          <GridItem key={a.id}>
            <Flex direction={"column"} w={"full"} gap={2}>
              <ContributorTrackCard hideActions track={a} />
              <Flex
                gap={2}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <CustomNoActionDialog
                  triggerText="View Details"
                  dialogTitle="Track Details"
                  size={"lg"}
                >
                  <Box>
                    <Flex
                      gap={{ base: 4, md: 6 }}
                      direction={{ base: "column", lg: "row" }}
                      alignItems="start"
                    >
                      <Image
                        border="0.06rem solid #3667964d"
                        minW="280px"
                        maxH="300px"
                        w={{ base: "full", lg: "1/4" }}
                        aspectRatio={1}
                        src={
                          import.meta.env.VITE_AWS_BUCKET_LINK + a?.artworkFile
                        }
                        alt="Music image"
                        objectFit="cover"
                        borderRadius="10px"
                      />

                      <VStack
                        alignItems={{ base: "center", md: "start" }}
                        paddingInline={2}
                        paddingBlock={2}
                        borderRadius="0.6rem"
                        fontSize={{
                          base: "0.7rem",
                          md: "0.9rem",
                          lg: "1rem",
                        }}
                        gap={4}
                      >
                        <h3>{a?.title}</h3>
                        <Text color={"gray.400"} fontSize="xl">
                          by {a?.uploadedBy.username}
                        </Text>

                        <Text>
                          <Span fontWeight={"semibold"} color={"gray.600"}>
                            GENRE:
                          </Span>{" "}
                          {(a.genre as Genre).name}
                        </Text>
                        <Text>
                          <Span fontWeight={"semibold"} color={"gray.600"}>
                            MOOD:
                          </Span>{" "}
                          {(a.moodType as MoodType).name}
                        </Text>
                        <Text>
                          <Span fontWeight={"semibold"} color={"gray.600"}>
                            BPM:
                          </Span>{" "}
                          {a.audioBpm}
                        </Text>
                        <Text>
                          <Span fontWeight={"semibold"} color={"gray.600"}>
                            KEY:
                          </Span>{" "}
                          {(a.audioKey as Key).name}
                        </Text>
                        <Text>Audio: </Text>
                        <audio controls>
                          <source
                            src={
                              import.meta.env.VITE_AWS_BUCKET_LINK + a.wavFile
                            }
                            type="audio/wav"
                          />
                        </audio>
                      </VStack>
                    </Flex>
                  </Box>
                </CustomNoActionDialog>
                <CustomDialog
                  title="Accept the request"
                  bodyText="Are you sure you want to accept this track request?"
                  cancelText="Cancel"
                  confirmText="Yes, Accept"
                  handleConfirm={() =>
                    handleAcceptRejectTrackRequest(a.id, 1, [])
                  }
                >
                  <Button backgroundColor={"green.600"} color={"white"}>
                    Accept
                  </Button>
                </CustomDialog>
                <FormDialog
                  title="Reject the request"
                  open={open}
                  setOpen={setOpen}
                  handleSubmit={() => {
                    handleAcceptRejectTrackRequest(a.id, 2, [reason]);
                  }}
                  handleCancel={() => setOpen(false)}
                  yesText="Yes, Reject"
                  yesBgColor="red.800"
                  isNotForm
                >
                  <CustomInput
                    label="Reason for rejection"
                    name="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <br />
                  <CustomInput
                    label="Step to resolve"
                    name="resolve"
                    value={resolve}
                    onChange={(e) => setResolve(e.target.value)}
                  />
                </FormDialog>
                <Button
                  backgroundColor={"red.600"}
                  color={"white"}
                  onClick={() => setOpen(true)}
                >
                  Reject
                </Button>
              </Flex>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </ListViewWrapper>
  );
}
