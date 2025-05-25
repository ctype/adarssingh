import { useEffect } from "react";
import { Flex, Grid, GridItem, Tabs, Text } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import CustomDialog from "@/components/global/CustomDialog";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomDataDialog from "@/components/global/CustomNoActionDialog";
import { acceptRejectTrackRequest } from "@/features/admin/adminSlice";
import SoundBankPresetRequestCard from "./_components/SoundBankPresetRequestCard";
import { fetchPresets, setPresets } from "@/features/preset/presetSlice";

export default function PresetRequest() {
  const dispatch = useAppDispatch();
  const { presets } = useAppSelector((state) => state.presets);

  const handleAcceptRejectTrackRequest = async (
    id: number,
    status: number,
    rejectData: string[]
  ) => {
    await dispatch(
      acceptRejectTrackRequest({ id, status, rejectData, type: "preset" })
    )
      .unwrap()
      .then((d) => {
        if (d.acceptRejectTrackRequest) {
          const updatePresets = presets.map((a) => {
            if (a.id === id) {
              return {
                ...a,
                status: status,
              };
            }
            return a;
          });

          dispatch(setPresets(updatePresets));
        }
      });
  };

  useEffect(() => {
    dispatch(fetchPresets({ filter: { limit: 100 } })).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper title="Preset Request" hasAdd={false}>
      <Tabs.Root defaultValue={"pending-presets"} variant="enclosed">
        <Tabs.List backgroundColor={"gray.900"} border={"none"}>
          <Tabs.Trigger
            color={"gray.400"}
            backgroundColor={"transparent"}
            _selected={{ color: "white", backgroundColor: "gray.800" }}
            value={"pending-presets"}
          >
            Pending
          </Tabs.Trigger>
          <Tabs.Trigger
            color={"gray.400"}
            backgroundColor={"transparent"}
            _selected={{ color: "white", backgroundColor: "gray.800" }}
            value={"rejected-presets"}
          >
            Rejected{" "}
            <Text fontWeight={"semibold"} color={"blue.500"}>
              {/* {users.filter((u) => u.professionalEmail).length > 0 &&
                      `( ${users.filter((u) => u.professionalEmail).length} )`} */}
            </Text>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={"pending-presets"}>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            {presets.filter((a) => a.status === 0 && !a.isDraft).length ===
              0 && (
              <GridItem colSpan={5} textAlign={"center"} py={10}>
                <Text>No pending preset request found</Text>
              </GridItem>
            )}
            {presets
              .filter((a) => a.status === 0 && !a.isDraft)
              .map((a) => (
                <Flex key={a.id} direction={"column"} gap={2}>
                  <SoundBankPresetRequestCard
                    title={a.title}
                    artworkFile={a.artworkFile as string}
                    hideActions
                    soundBankPreset={a}
                  />
                  <Flex
                    gap={1}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <CustomDataDialog
                      triggerText="View Details"
                      dialogTitle="Preset Details"
                    >
                      <Flex direction={"column"} gap={2}>
                        <p>Name: {a.title}</p>
                        <p>Artist Name: {a.uploadedBy.username}</p>
                        {/* <p>Name: {a.audioTitle}</p>
                        <p>Name: {a.audioTitle}</p> */}
                      </Flex>
                    </CustomDataDialog>

                    <CustomDialog
                      title="Reject the preset"
                      bodyText="Are you sure you want to reject the preset request?"
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
                      title="Accept the preset"
                      bodyText="Are you sure you want to accept the preset?"
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
        <Tabs.Content value={"rejected-presets"}>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            {presets.filter((a) => a.status === 2 && !a.isDraft).length ===
              0 && (
              <GridItem colSpan={5} textAlign={"center"} py={10}>
                <Text>No rejected preset request found</Text>
              </GridItem>
            )}
            {presets
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
                      dialogTitle="Track Details"
                    >
                      <Flex direction={"column"} gap={2}>
                        <p>Name: {a.title}</p>
                        <p>Artist Name: {a.uploadedBy.username}</p>
                      </Flex>
                    </CustomDataDialog>
                    <CustomDialog
                      title="Accept the request"
                      bodyText="Are you sure you want to accept this preset request?"
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
                      bodyText="Are you sure you want to reject this preset request?"
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
