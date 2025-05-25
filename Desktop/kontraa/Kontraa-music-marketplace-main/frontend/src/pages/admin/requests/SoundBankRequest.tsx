import { useEffect } from "react";
import { Flex, Grid, GridItem, Tabs, Text } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import CustomDialog from "@/components/global/CustomDialog";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomDataDialog from "@/components/global/CustomNoActionDialog";
import { acceptRejectTrackRequest } from "@/features/admin/adminSlice";
import {
  fetchSoundBanks,
  setSoundBanks,
} from "@/features/soundBank/soundBankSlice";
import SoundBankPresetRequestCard from "./_components/SoundBankPresetRequestCard";

export default function SoundBankRequest() {
  const dispatch = useAppDispatch();
  const { soundBanks } = useAppSelector((state) => state.soundBanks);

  const handleAcceptRejectTrackRequest = async (
    id: number,
    status: number,
    rejectData: string[]
  ) => {
    await dispatch(
      acceptRejectTrackRequest({ id, status, rejectData, type: "sound-bank" })
    )
      .unwrap()
      .then((d) => {
        if (d.acceptRejectTrackRequest) {
          const updatedAudios = soundBanks.map((a) => {
            if (a.id === id) {
              return {
                ...a,
                status: status,
              };
            }
            return a;
          });

          dispatch(setSoundBanks(updatedAudios));
        }
      });
  };

  useEffect(() => {
    dispatch(fetchSoundBanks({ filter: { limit: 100 } })).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper title="Sound Bank Request" hasAdd={false}>
      <Tabs.Root defaultValue={"pending-soundBanks"} variant="enclosed">
        <Tabs.List backgroundColor={"gray.900"} border={"none"}>
          <Tabs.Trigger
            color={"gray.400"}
            backgroundColor={"transparent"}
            _selected={{ color: "white", backgroundColor: "gray.800" }}
            value={"pending-soundBanks"}
          >
            Pending
          </Tabs.Trigger>
          <Tabs.Trigger
            color={"gray.400"}
            backgroundColor={"transparent"}
            _selected={{ color: "white", backgroundColor: "gray.800" }}
            value={"rejected-soundBanks"}
          >
            Rejected{" "}
            <Text fontWeight={"semibold"} color={"blue.500"}>
              {/* {users.filter((u) => u.professionalEmail).length > 0 &&
                      `( ${users.filter((u) => u.professionalEmail).length} )`} */}
            </Text>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={"pending-soundBanks"}>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            {soundBanks.filter((a) => a.status === 0 && !a.isDraft).length ===
              0 && (
              <GridItem colSpan={5} textAlign={"center"} py={10}>
                <Text>No pending sound bank request found</Text>
              </GridItem>
            )}
            {soundBanks
              .filter((a) => a.status === 0 && !a.isDraft)
              .map((a) => (
                <Flex key={a.id} direction={"column"} gap={2}>
                  <SoundBankPresetRequestCard
                    hideActions
                    title={a.title}
                    artworkFile={a.artworkFile as string}
                    soundBankPreset={a}
                  />
                  <Flex
                    gap={1}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <CustomDataDialog
                      triggerText="View Details"
                      dialogTitle="SoundBank Details"
                    >
                      <Flex direction={"column"} gap={2}>
                        <p>Name: {a.title}</p>
                        <p>Artist Name: {a.uploadedBy.username}</p>
                        {/* <p>Name: {a.audioTitle}</p>
                        <p>Name: {a.audioTitle}</p> */}
                      </Flex>
                    </CustomDataDialog>

                    <CustomDialog
                      title="Reject the soundBank"
                      bodyText="Are you sure you want to reject the sound bank request?"
                      cancelText="Cancel"
                      confirmText="Yes, Reject"
                      handleConfirm={() =>
                        handleAcceptRejectTrackRequest(a.id, 2, ["some reason"])
                      }
                    >
                      <Button backgroundColor={"red.600"} color={"white"}>
                        Reject
                      </Button>
                    </CustomDialog>

                    <CustomDialog
                      title="Accept the soundBank"
                      bodyText="Are you sure you want to accept the sound bank request?"
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
                  </Flex>
                </Flex>
              ))}
          </Grid>
        </Tabs.Content>
        <Tabs.Content value={"rejected-soundBanks"}>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            {soundBanks.filter((a) => a.status === 2 && !a.isDraft).length ===
              0 && (
              <GridItem colSpan={5} textAlign={"center"} py={10}>
                <Text>No rejected sound bank request found</Text>
              </GridItem>
            )}
            {soundBanks
              .filter((a) => a.status === 2 && !a.isDraft)
              .map((a) => (
                <Flex key={a.id} direction={"column"} gap={2}>
                  <SoundBankPresetRequestCard
                    hideActions
                    title={a.title}
                    artworkFile={a.artworkFile as string}
                    soundBankPreset={a}
                  />
                  <Flex
                    gap={2}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <CustomDataDialog
                      triggerText="View Details"
                      dialogTitle="SoundBank Details"
                    >
                      <Flex direction={"column"} gap={2}>
                        <p>Name: {a.title}</p>
                        <p>Artist Name: {a.uploadedBy.username}</p>
                      </Flex>
                    </CustomDataDialog>
                    <CustomDialog
                      title="Accept the request"
                      bodyText="Are you sure you want to accept this sound bank request?"
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
                    <CustomDialog
                      title="Reject the request"
                      bodyText="Are you sure you want to reject this sound bank request?"
                      cancelText="Cancel"
                      confirmText="Yes, Reject"
                      handleConfirm={() =>
                        handleAcceptRejectTrackRequest(a.id, 2, ["Some reason"])
                      }
                    >
                      <Button backgroundColor={"red.600"} color={"white"}>
                        Reject
                      </Button>
                    </CustomDialog>
                  </Flex>
                </Flex>
              ))}
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </ListViewWrapper>
  );
}
