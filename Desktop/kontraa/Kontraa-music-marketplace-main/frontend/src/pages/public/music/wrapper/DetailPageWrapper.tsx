import { Send } from "lucide-react";
import { SwiperSlide } from "swiper/react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";

import { Button } from "@/components/ui/button";
import MusicCard from "@/components/music/MusicCard";
import CustomInput from "@/components/form/CustomInput";
import BackButton from "@/components/global/BackButton";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import SwiperCardLayout from "@/layouts/SwiperCardLayout";
import CommentSection from "@/components/music/CommentSection";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  createComment,
  fetchComments,
} from "@/features/social_system/commentSlice";

interface IDetailPageWrapperProps {
  entityName: "Track" | "SoundBank" | "Preset";
  entityId: number;
  description: string;
  relatedTracks: Track[] | SoundBank[] | Preset[];
}

export default function DetailPageWrapper({
  children,
  description,
  relatedTracks,
  entityName,
  entityId,
}: PropsWithChildren<IDetailPageWrapperProps>) {
  const dispatch = useAppDispatch();
  const { comments, isPending: commentPending } = useAppSelector(
    (state) => state.comments
  );

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    dispatch(createComment({ content, entityName, entityId })).unwrap();
  };

  useEffect(() => {
    dispatch(fetchComments({ entityId, entityName })).unwrap();
  }, [entityId, entityName, dispatch]);

  return (
    <MaxWidthWrapper>
      <Box color={"white"} my={4}>
        <BackButton />

        {children}

        <Box mt={12}>
          <h4>Description</h4>
          <Text my={2}>{description}</Text>
        </Box>
        <form onSubmit={addComment}>
          <Flex
            alignItems="end"
            gap={2}
            w={{ base: "full", md: "1/2" }}
            mt={10}
          >
            <CustomInput
              name="content"
              label="Comment"
              required={false}
              placeholder="Tell the artist what you think..."
            />
            <Button
              variant={"ghost"}
              color={"white"}
              _hover={{
                backgroundColor: "gray.600/30",
              }}
              type="submit"
            >
              <Send size={20} />
            </Button>
          </Flex>
        </form>

        <CommentSection comments={comments} pending={commentPending} />

        <Flex direction="column" gap={4} py={10}>
          <h4>Related tracks</h4>
          <SwiperCardLayout>
            {relatedTracks.slice(0, 6).map((track, key) => (
              <SwiperSlide key={key}>
                <MusicCard key={key} track={track} type="Track" />
              </SwiperSlide>
            ))}
          </SwiperCardLayout>
        </Flex>
      </Box>
    </MaxWidthWrapper>
  );
}
