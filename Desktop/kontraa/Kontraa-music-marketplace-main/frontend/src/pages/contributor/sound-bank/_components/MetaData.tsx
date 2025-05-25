import { Info } from "lucide-react";
import { useParams } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

// import { Checkbox } from "@/components/ui/checkbox";
// import CustomInput from "@/components/form/CustomInput";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomTagInput from "@/components/form/CustomTagInput";
import { SoundBankContext } from "../context/SoundBankContext";
import { CustomControlledSelect } from "@/components/form/CustomControlledSelect";
import {
  createSoundBank,
  updateSoundBank,
} from "@/features/soundBank/soundBankSlice";
import {
  TEMP_AUDIO_FILE_MP3_ID,
  TEMP_AUDIO_FILE_ZIP_ID,
  TEMP_TRACK_ID,
} from "../../utils/options";
import { fetchGenreMixes } from "@/features/genreMix/genreMixSlice";
import CustomInput from "@/components/form/CustomInput";

export default function MetaData({
  goToNextStep,
  hasBeenEdited,
  setHasBeenEdited,
  setUploadingSoundBank,
}: {
  goToNextStep: () => void;
  hasBeenEdited: boolean;
  setHasBeenEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadingSoundBank: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { genreMixes } = useAppSelector((state) => state.genreMixes);

  const { soundBankData, setSoundBankData } = useContext(SoundBankContext);

  const handleMetaDataSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingSoundBank(true);
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());
    const soundbankdata = {
      ...soundBankData,
      numberOfFiles: Number(data.numberOfFiles),
    };
    setSoundBankData(soundbankdata);

    const zipId = Number(
      localStorage.getItem(TEMP_AUDIO_FILE_ZIP_ID) ??
        (soundBankData.fileIds?.[0] as TrackFile)?.id
    );
    const mp3Id = Number(
      localStorage.getItem(TEMP_AUDIO_FILE_MP3_ID) ??
        (soundBankData.fileIds?.[1] as TrackFile)?.id
    );

    if (id || hasBeenEdited) {
      const toSendData: Partial<SoundBankCreateUpdateFields> = {
        ...soundbankdata,
      };

      if (typeof toSendData.artworkFile === "string") {
        delete toSendData.artworkFile;
      }

      delete toSendData.collaborators;
      delete (toSendData as Partial<SoundBank>).id;
      delete (toSendData as Partial<SoundBank>).uploadedBy;
      delete toSendData.__typename;
      delete toSendData.licenses;
      delete toSendData.exclusiveOneTimeBuyPrices;

      await dispatch(
        updateSoundBank({
          id: id ? Number(id) : Number(localStorage.getItem(TEMP_TRACK_ID)),
          data: {
            ...toSendData,
            fileIds: [zipId, mp3Id],
          },
        })
      )
        .then(() => {
          goToNextStep();
        })
        .finally(() => {
          setUploadingSoundBank(false);
        });
    } else {
      const toSendData = { ...soundBankData };
      delete toSendData.collaborators;

      await dispatch(
        createSoundBank({
          ...toSendData,
          fileIds: [zipId, mp3Id],
        })
      )
        .then((p) => {
          localStorage.setItem(TEMP_TRACK_ID, p.payload.createSoundBank.id);
          setHasBeenEdited(true);
          goToNextStep();
        })
        .finally(() => {
          setUploadingSoundBank(false);
        });
    }
  };

  const genreMixOptions = genreMixes.map((genreMix) => ({
    value: genreMix.id,
    label: genreMix.name,
  }));
  // const subGenreOptions = subGenres.map((subGenre) => ({
  //   value: subGenre.id,
  //   label: subGenre.subGenreName,
  // }));
  // const moodTypeOptions = moodTypes.map((moodType) => ({
  //   value: moodType.id,
  //   label: moodType.moodType,
  // }));
  // const instrumentOptions = instruments.map((instrument) => ({
  //   value: instrument.id,
  //   label: instrument.instrument,
  // }));
  // const keyOptions = keys.map((key) => ({
  //   value: key.id,
  //   label: key.soundBankKeyName,
  // }));
  // const languageOptions = languages.map((language) => ({
  //   value: language.id,
  //   label: language.language,
  // }));

  useEffect(() => {
    const fetchOptions = async () => {
      if (genreMixes.length <= 0) {
        dispatch(fetchGenreMixes()).unwrap();
      }
      // if (subGenres.length <= 0) {
      //   dispatch(fetchSubGenres(1)).unwrap();
      // }
      // if (moodTypes.length <= 0) {
      //   dispatch(fetchMoodTypes(1)).unwrap();
      // }
      // if (keys.length <= 0) {
      //   dispatch(fetchKeys(1)).unwrap();
      // }
      // if (languages.length <= 0) {
      //   dispatch(fetchLanguages(1)).unwrap();
      // }
      // if (instruments.length <= 0) {
      //   dispatch(fetchInstruments(1)).unwrap();
      // }
    };

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (value: string, name: string) => {
    if (setSoundBankData && soundBankData) {
      setSoundBankData({ ...soundBankData, [name]: Number(value) });
    }
  };

  const handleTagChange = (tag: string, isAdd: boolean) => {
    if (isAdd) {
      setSoundBankData({
        ...soundBankData,
        tags: [...soundBankData.tags, tag],
      });
    } else {
      const tags = soundBankData.tags.filter((t) => t !== tag);
      setSoundBankData({ ...soundBankData, tags });
    }
  };

  return (
    <Box justifyContent={"center"} alignItems={"center"} rounded={"lg"} mx={2}>
      <form onSubmit={handleMetaDataSubmit} id="metadata-form">
        <VStack gap={6}>
          <Flex direction={"Column"} gap={1} w={"full"}>
            <CustomTagInput
              tags={soundBankData?.tags ?? []}
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
              name="genreMix"
              label="Genre Mix"
              value={soundBankData?.genreMix.toString()}
              setValue={(v) => handleSelectChange(v, "genreMix")}
              options={genreMixOptions}
            />
            {/* <CustomControlledSelect
              name="subGenre"
              label="Sub Genre"
              value={soundBankData?.subGenre?.toString()}
              setValue={(v) => handleSelectChange(v, "subGenre")}
              options={subGenreOptions}
              required={false}
            /> */}
            {/*
          <Flex color={"gray.400"} gap={1} alignItems={"center"}>
            <Info size={16} />
            <Text fontSize={"xs"}>You can add up to 3 genres</Text>
          </Flex> */}
          </Flex>

          <CustomInput
            name="numberOfFiles"
            type="number"
            label="Number of Files"
            defaultValue={soundBankData?.numberOfFiles.toString()}
            placeholder="Enter the number of audio files in the sound bank"
          />
          {/* <Flex gap={6} w={"full"}>
            <CustomControlledSelect
              value={soundBankData?.soundBankKey.toString()}
              setValue={(v) => handleSelectChange(v, "soundBankKey")}
              options={keyOptions}
              name="soundBankKey"
              label="Key"
            />
            <CustomInput
              label="BPM"
              name="soundBankBpm"
              type="number"
              defaultValue={soundBankData?.soundBankBpm?.toString() ?? undefined}
            />
          </Flex> */}
          <Flex direction={"column"} w={"full"} gap={2}>
            {/* <CustomControlledSelect
              name="moodType"
              label="Mood Type"
              value={soundBankData?.moodType.toString()}
              setValue={(v) => handleSelectChange(v, "moodType")}
              options={moodTypeOptions}
            /> */}
            {/* <Flex color={"gray.400"} gap={1} alignItems={"center"}>
            <Info size={16} />
            <Text fontSize={"xs"}>You can add up to 3 moods</Text>
          </Flex> */}
          </Flex>
          {/* <CustomControlledSelect
            name="instrumentId"
            label="Instrument"
            value={soundBankData?.instrumentId.toString()}
            setValue={(v) => handleSelectChange(v, "instrumentId")}
            options={instrumentOptions}
          />
          <CustomControlledSelect
            name="language"
            label="Language"
            value={soundBankData?.language.toString()}
            setValue={(v) => handleSelectChange(v, "language")}
            options={languageOptions}
          /> */}
          {/* <Checkbox
            color={"white"}
            name={"uploadedByRightHolder"}
            colorPalette={"blue"}
            alignSelf={"self-start"}
            checked={soundBankData.uploadedByRightHolder}
            onCheckedChange={(v) => {
              setSoundBankData({
                ...soundBankData,
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
          </Checkbox> */}
        </VStack>
      </form>
    </Box>
  );
}
