import { useAppDispatch } from "@/app/store";
import { submitAudio } from "@/features/license/licenseSlice";
import { TEMP_TRACK_ID } from "@/pages/contributor/utils/options";
import { Box, Span, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function TempFinalStep({
  trackData,
  typeOfTrack,
  onSuccess,
  setUploadingTrack,
}: {
  trackData: BaseAudio;
  typeOfTrack: "track" | "sound-bank" | "preset";
  onSuccess: (id: number) => void;
  hasBeenEdited: boolean;
  setUploadingTrack: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingTrack(true);

    try {
      (async () => {
        await dispatch(
          submitAudio({
            musicId: id
              ? Number(id)
              : Number(localStorage.getItem(TEMP_TRACK_ID)),
            type: typeOfTrack,
            toReview: true,
          })
        )
          .unwrap()
          .then((d) => {
            if (d) {
              onSuccess(Number(id));
            }
          });
      })();
    } catch (error) {
      setUploadingTrack(false);
      console.error(error);
    }
  };

  return (
    <Box borderRadius={"md"}>
      <form id="pricing-form" onSubmit={handleSubmit}>
        <Text my={4}>Review & Submit</Text>

        <Text>
          <Span fontWeight={"bold"}>Name:</Span> {trackData.title}
        </Text>
        <Text>
          <Span fontWeight={"bold"}>Description:</Span>{" "}
          {trackData.description ?? "-"}
        </Text>
        {/* <Text>Genre: {trackData.genre}</Text>
        <Text>Tags: {trackData.tags?.join(", ")}</Text> */}

        {trackData.collaborators && (
          <>
            <Span fontWeight={"bold"}>Collaborators</Span>
            {trackData.collaborators.map((c) => (
              <Text key={c.id}>
                Name: {c.collaboratorName} <br />
                Role: {c.role} <br />
                Profit share: {c.profitShare}% <br />
                Publishing share: {c.publishingShare}%
              </Text>
            ))}
          </>
        )}
      </form>
    </Box>
  );
}
