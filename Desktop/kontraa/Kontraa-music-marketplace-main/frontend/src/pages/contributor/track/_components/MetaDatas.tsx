import { Info } from "lucide-react";
import { useParams } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";

import { fetchKeys } from "@/features/key/keySlice";
import CustomInput from "@/components/form/CustomInput";
import { fetchGenres } from "@/features/genre/genreSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchSubGenres } from "@/features/subGenre/subGenreSlice";
import { fetchMoodTypes } from "@/features/moodType/moodTypeSlice";
import { fetchLanguages } from "@/features/language/languageSlice";
import { fetchInstruments } from "@/features/instrument/instrumentSlice";
import { TrackContext } from "../context/TrackContext";
import { CustomControlledSelect } from "@/components/form/CustomControlledSelect";
import CustomTagInput from "@/components/form/CustomTagInput";
import { Checkbox } from "@/components/ui/checkbox";
import { createAudio, updateAudio } from "@/features/audio/audioSlice";
import {
  TEMP_AUDIO_FILE_MP3_ID,
  TEMP_AUDIO_FILE_WAV_ID,
  TEMP_AUDIO_FILE_ZIP_ID,
  TEMP_TRACK_ID,
} from "../../utils/options";

export default function MetaDatas({
  goToNextStep,
  hasBeenEdited,
  setHasBeenEdited,
  setUploadingTrack,
}: {
  goToNextStep: () => void;
  hasBeenEdited: boolean;
  setHasBeenEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadingTrack: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { genres } = useAppSelector((state) => state.genres);
  const { subGenres } = useAppSelector((state) => state.subGenres);
  const { moodTypes } = useAppSelector((state) => state.moodTypes);
  const { instruments } = useAppSelector((state) => state.instruments);
  const { keys } = useAppSelector((state) => state.keys);
  const { languages } = useAppSelector((state) => state.languages);

  const { trackData, setTrackData } = useContext(TrackContext);

  const handleMetaDataSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingTrack(true);
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());
    const audioData = {
      ...trackData,
      audioBpm: +data.audioBpm,
    };
    setTrackData(audioData);

    const wavId = Number(
      localStorage.getItem(TEMP_AUDIO_FILE_WAV_ID) ??
        (audioData.fileIds?.[0] as TrackFile)?.id
    );
    const mp3Id = Number(
      localStorage.getItem(TEMP_AUDIO_FILE_MP3_ID) ??
        (audioData.fileIds?.[1] as TrackFile)?.id
    );
    const zipId = Number(
      localStorage.getItem(TEMP_AUDIO_FILE_ZIP_ID) ??
        (audioData.fileIds?.[2] as TrackFile)?.id
    );

    if (id || hasBeenEdited) {
      const toSendData: Partial<TrackCreateUpdateFields> = { ...audioData };

      if (typeof toSendData.artworkFile === "string") {
        delete toSendData.artworkFile;
      }

      delete toSendData.collaborators;
      delete (toSendData as Partial<Track>).id;
      delete (toSendData as Partial<Track>).uploadedBy;
      delete toSendData.__typename;
      delete toSendData.licenses;
      delete toSendData.exclusiveOneTimeBuyPrices;

      await dispatch(
        updateAudio({
          id: id ? Number(id) : Number(localStorage.getItem(TEMP_TRACK_ID)),
          data: {
            ...toSendData,
            audioBpm: Number(toSendData.audioBpm),
            duration: Number(toSendData.duration),
            releaseDate: new Date(toSendData.releaseDate!),
            fileIds: [wavId, mp3Id, zipId],
          },
        })
      )
        .then(() => {
          goToNextStep();
        })
        .finally(() => {
          setUploadingTrack(false);
        });
    } else {
      const toSendData = { ...audioData };
      delete toSendData.collaborators;

      await dispatch(
        createAudio({
          ...toSendData,
          fileIds: [wavId, mp3Id, zipId],
          duration: Number(toSendData.duration),
          releaseDate: new Date(toSendData.releaseDate!),
        })
      )
        .then((p) => {
          localStorage.setItem(TEMP_TRACK_ID, p.payload.createAudio.id);
          setHasBeenEdited(true);
          goToNextStep();
        })
        .finally(() => {
          setUploadingTrack(false);
        });
    }
  };

  const genreOptions = genres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));
  const subGenreOptions = subGenres.map((subGenre) => ({
    value: subGenre.id,
    label: subGenre.name,
  }));
  const moodTypeOptions = moodTypes.map((moodType) => ({
    value: moodType.id,
    label: moodType.name,
  }));
  const instrumentOptions = instruments.map((instrument) => ({
    value: instrument.id,
    label: instrument.name,
  }));
  const keyOptions = keys.map((key) => ({
    value: key.id,
    label: key.name,
  }));
  const languageOptions = languages.map((language) => ({
    value: language.id,
    label: language.name,
  }));

  useEffect(() => {
    const fetchOptions = async () => {
      if (genres.length <= 0) {
        dispatch(fetchGenres()).unwrap();
      }
      if (subGenres.length <= 0) {
        dispatch(fetchSubGenres()).unwrap();
      }
      if (moodTypes.length <= 0) {
        dispatch(fetchMoodTypes()).unwrap();
      }
      if (keys.length <= 0) {
        dispatch(fetchKeys()).unwrap();
      }
      if (languages.length <= 0) {
        dispatch(fetchLanguages()).unwrap();
      }
      if (instruments.length <= 0) {
        dispatch(fetchInstruments()).unwrap();
      }
    };

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (value: string, name: string) => {
    if (setTrackData && trackData) {
      setTrackData({ ...trackData, [name]: Number(value) });
    }
  };

  const handleTagChange = (tag: string, isAdd: boolean) => {
    if (isAdd) {
      setTrackData({
        ...trackData,
        tags: [...trackData.tags, tag],
      });
    } else {
      const tags = trackData.tags.filter((t) => t !== tag);
      setTrackData({ ...trackData, tags });
    }
  };

  return (
    <Box justifyContent={"center"} alignItems={"center"} rounded={"lg"} mx={2}>
      <form onSubmit={handleMetaDataSubmit} id="metadata-form">
        <VStack gap={6}>
          <Flex direction={"Column"} gap={1} w={"full"}>
            <CustomTagInput
              tags={trackData?.tags ?? []}
              label="Tags"
              placeholder="Enter your tags"
              name="tags"
              updateTags={handleTagChange}
            />
            <Flex color={"gray.400"} gap={1} alignItems={"center"}>
              <Info size={16} />
              <Text fontSize={"xs"}>You can add up to 3 tags</Text>
            </Flex>
          </Flex>

          <Flex w={"full"} gap={2}>
            <CustomControlledSelect
              name="genre"
              label="Genre"
              value={trackData?.genre.toString()}
              setValue={(v) => handleSelectChange(v, "genre")}
              options={genreOptions}
            />
            <CustomControlledSelect
              name="subGenre"
              label="Sub Genre"
              value={trackData?.subGenre?.toString()}
              setValue={(v) => handleSelectChange(v, "subGenre")}
              options={subGenreOptions}
              required={false}
            />
            {/*
          <Flex color={"gray.400"} gap={1} alignItems={"center"}>
            <Info size={16} />
            <Text fontSize={"xs"}>You can add up to 3 genres</Text>
          </Flex> */}
          </Flex>
          <Flex gap={6} w={"full"}>
            <CustomControlledSelect
              value={trackData?.audioKey.toString()}
              setValue={(v) => handleSelectChange(v, "audioKey")}
              options={keyOptions}
              name="audioKey"
              label="Key"
            />
            <CustomInput
              label="BPM"
              name="audioBpm"
              type="number"
              defaultValue={trackData?.audioBpm?.toString() ?? undefined}
            />
          </Flex>
          <Flex direction={"column"} w={"full"} gap={2}>
            <CustomControlledSelect
              name="moodType"
              label="Mood Type"
              value={trackData?.moodType.toString()}
              setValue={(v) => handleSelectChange(v, "moodType")}
              options={moodTypeOptions}
            />
            {/* <Flex color={"gray.400"} gap={1} alignItems={"center"}>
            <Info size={16} />
            <Text fontSize={"xs"}>You can add up to 3 moods</Text>
          </Flex> */}
          </Flex>
          <CustomControlledSelect
            name="instrumentId"
            label="Instrument"
            value={trackData?.instrumentId.toString()}
            setValue={(v) => handleSelectChange(v, "instrumentId")}
            options={instrumentOptions}
          />
          <CustomControlledSelect
            name="language"
            label="Language"
            value={trackData?.language.toString()}
            setValue={(v) => handleSelectChange(v, "language")}
            options={languageOptions}
          />
          <Checkbox
            color={"white"}
            name={"uploadedByRightHolder"}
            colorPalette={"blue"}
            alignSelf={"self-start"}
            checked={trackData.uploadedByRightHolder}
            onCheckedChange={(v) => {
              setTrackData({
                ...trackData,
                uploadedByRightHolder:
                  v.checked && v.checked !== "indeterminate",
              });
            }}
          >
            I have used 3rd Party Loops and/or Samples and by checking this box,
            I agree that I have 100% of all the rights to use the 3rd Party
            Loops and/or Samples in accordance with the{" "}
            <Link
              href="/terms-of-service"
              target="_blank"
              rel="noreferrer"
              color={"#3388FF"}
              textDecoration={"underline"}
            >
              Kontras Terms of Service
            </Link>
            .
          </Checkbox>
        </VStack>
      </form>
    </Box>
  );
}
