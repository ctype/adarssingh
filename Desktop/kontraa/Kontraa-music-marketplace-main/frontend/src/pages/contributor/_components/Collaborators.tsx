import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { User, Users, Info, Plus } from "lucide-react";
import {
  Box,
  Button,
  createListCollection,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import DeleteButton from "@/components/afterAuth/DeleteButton";
import { initialCollaboratorFieldsData } from "../track/utils/collaboratorOptions";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { CollaboratorContext } from "../context/CollaboratorContext";
import {
  collaboratorOperation,
  setAudioId,
} from "@/features/collaborator/collaboratorSlice";
import { TEMP_TRACK_ID } from "../utils/options";
import { setMySoundBanks } from "@/features/soundBank/soundBankSlice";
import { setMyPresets } from "@/features/preset/presetSlice";
import { setMyAudios } from "@/features/audio/audioSlice";

export default function Collaborators({
  goToNextStep,
  typeOfTrack,
}: {
  goToNextStep: () => void;
  typeOfTrack: "audio" | "sound-bank" | "preset";
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { collaborators, setCollaborators } = useContext(CollaboratorContext);
  const { user } = useAppSelector((state) => state.auth);
  const { mySoundBanks } = useAppSelector((state) => state.soundBanks);
  const { myPresets } = useAppSelector((state) => state.presets);
  const { myAudios } = useAppSelector((state) => state.audios);

  const handleAddCollaborator = () => {
    const toAddId = id
      ? Number(id)
      : Number(localStorage.getItem(TEMP_TRACK_ID));

    let newCollaborator = { ...initialCollaboratorFieldsData };
    if (typeOfTrack === "audio") {
      newCollaborator = { ...newCollaborator, audioId: toAddId };
    }
    if (typeOfTrack === "sound-bank") {
      newCollaborator = { ...newCollaborator, soundBankId: toAddId };
    }
    if (typeOfTrack === "preset") {
      newCollaborator = { ...newCollaborator, presetId: toAddId };
    }
    setCollaborators((prev) => [...prev, newCollaborator]);
  };

  const handleCollaboratorRemove = (indexToRemove: number) => {
    const updatedCollaborators = collaborators.filter(
      (_, index) => index !== indexToRemove
    );
    setCollaborators(updatedCollaborators!);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value, type } = event.target;
    const updatedCollaborators = collaborators.map((collaborator, i) => {
      if (i === index) {
        return {
          ...collaborator,
          [name]: type === "number" && value !== "" ? Number(value) : value,
        };
      }
      return collaborator;
    });
    setCollaborators(updatedCollaborators);
  };

  const handleSelectChange = (value: string, name: string, index: number) => {
    const updatedCollaborators = collaborators.map((collaborator, i) => {
      if (i === index) {
        return { ...collaborator, [name]: value };
      }
      return collaborator;
    });
    setCollaborators(updatedCollaborators);
  };

  const handleCollaboratorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!collaborators.length) {
      goToNextStep();
      return;
    }
    const dynamicName =
      typeOfTrack === "audio"
        ? "audioId"
        : typeOfTrack === "sound-bank"
          ? "soundBankId"
          : "presetId";
    dispatch(
      collaboratorOperation({
        data: collaborators.map((c) => ({
          ...c,
          [dynamicName]: id
            ? Number(id)
            : Number(localStorage.getItem(TEMP_TRACK_ID)),
        })),
        type: typeOfTrack,
      })
    )
      .unwrap()
      .then((p) => {
        setAudioId(
          id ? Number(id) : Number(localStorage.getItem(TEMP_TRACK_ID))
        );
        setCollaborators(
          JSON.parse(JSON.stringify(p.collaboratorOperation), (key, value) =>
            key === "__typename" ? undefined : value
          )
        );
        if (typeOfTrack === "sound-bank") {
          const updatedSoundBanks = mySoundBanks.map((ms) => {
            if (
              ms.id === Number(id) ||
              ms.id === Number(localStorage.getItem(TEMP_TRACK_ID))
            ) {
              return {
                ...ms,
                collaborators: p.collaboratorOperation,
              };
            }
            return ms;
          });
          dispatch(setMySoundBanks(updatedSoundBanks));
        } else if (typeOfTrack === "preset") {
          const updatedPresets = myPresets.map((pr) => {
            if (
              pr.id === Number(id) ||
              pr.id === Number(localStorage.getItem(TEMP_TRACK_ID))
            ) {
              return {
                ...pr,
                collaborators: p.collaboratorOperation,
              };
            }
            return pr;
          });
          dispatch(setMyPresets(updatedPresets));
        } else {
          const updatedAudios = myAudios.map((ad) => {
            if (
              ad.id === Number(id) ||
              ad.id === Number(localStorage.getItem(TEMP_TRACK_ID))
            ) {
              return {
                ...ad,
                collaborators: p.collaboratorOperation,
              };
            }
            return ad;
          });
          dispatch(setMyAudios(updatedAudios));
        }
        goToNextStep();
      });
  };

  return (
    <form onSubmit={handleCollaboratorSubmit} id="collaborators-form">
      <VStack>
        <Flex
          w={"full"}
          border={"1px solid #262626"}
          borderRadius={4}
          p={3}
          gap={3}
          boxShadow={"0px .3px gray "}
        >
          {/* TODO: Profile picture change to real one  */}
          <Image src="/images/logo.png" w={10} h={10} />

          <HStack w={"full"} justify={"space-between"}>
            <VStack alignItems={"start"} gap={0}>
              <HStack alignItems={"center"} color={"gray.400"} gap={1}>
                <Users size={16} />
                <Text fontSize={"xs"}>Collaborator</Text>
              </HStack>
              <Text fontSize={"sm"}>{user?.username}</Text>
            </VStack>

            <VStack alignItems={"start"} gap={0}>
              <HStack alignItems={"center"} color={"gray.400"} gap={1}>
                <User size={16} />
                <Text fontSize={"xs"}>Role</Text>
              </HStack>
              <Text fontSize={"sm"}>Author</Text>
            </VStack>

            <VStack alignItems={"start"} gap={0}>
              <HStack alignItems={"center"} color={"gray.400"} gap={1}>
                <Users size={16} />
                <Text fontSize={"xs"}>Profit Share</Text>
              </HStack>
              <Text fontSize={"sm"}>
                {100 -
                  collaborators.reduce(
                    (acc, curr) => acc + curr.profitShare,
                    0
                  )}{" "}
                %
              </Text>
            </VStack>

            <VStack alignItems={"start"} gap={0}>
              <HStack alignItems={"center"} color={"gray.400"} gap={1}>
                <Users size={16} />
                <Text fontSize={"xs"}>Publishing Share</Text>
              </HStack>
              <Text fontSize={"sm"}>
                {100 -
                  collaborators.reduce(
                    (acc, curr) => acc + curr.publishingShare,
                    0
                  )}{" "}
                %
              </Text>
            </VStack>
          </HStack>
        </Flex>
        <HStack gap={7} my={6} alignSelf={"start"}>
          <Button
            color={"#3388DF"}
            bg={"#081C39"}
            rounded={"full"}
            onClick={handleAddCollaborator}
            fontSize={"md"}
          >
            <Plus />
            Add collaborator
          </Button>
          <Flex alignItems={"center"} gap={1} color={"gray.400"}>
            <Info size={16} />
            <Text fontSize={"xs"}>How do collaborators works?</Text>
          </Flex>
        </HStack>

        {collaborators.length > 0 &&
          collaborators.map((collaborator, index) => (
            <Flex w={"full"} alignItems={"center"} gap={10} key={index} my={1}>
              <CustomInput
                label="Collaborator name"
                name="collaboratorName"
                placeholder="Collaborator name"
                value={collaborator.collaboratorName}
                onChange={(e) => handleInputChange(e, index)}
              />
              <CustomSelect
                options={createListCollection({
                  items: [
                    { label: "Artist", value: "artist" },
                    { label: "Publisher", value: "publisher" },
                    { label: "Music Director", value: "music-director" },
                    { label: "Lyrisist", value: "lyrisist" },
                  ],
                })}
                label="Role"
                name="role"
                defaultValue={collaborator.role}
                onChange={(value) => handleSelectChange(value, "role", index)}
              />
              <CustomInput
                label="Profit %"
                name="profitShare"
                placeholder="0"
                type="number"
                value={collaborator.profitShare}
                onChange={(e) => handleInputChange(e, index)}
              />
              <CustomInput
                label="Publishing %"
                name="publishingShare"
                placeholder="0"
                type="number"
                value={collaborator.publishingShare}
                onChange={(e) => handleInputChange(e, index)}
              />
              <Box bg={"#2B0808"} rounded={"full"} alignSelf={"end"}>
                <DeleteButton
                  handleDelete={() => handleCollaboratorRemove(index)}
                />
              </Box>
            </Flex>
          ))}
      </VStack>
    </form>
  );
}
