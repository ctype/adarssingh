import React, { useState } from "react";
import { SendHorizonal, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/app/store";
import CustomInput from "../form/CustomInput";
import {
  createReply,
  fetchReplies,
} from "@/features/social_system/commentSlice";
import { useLikeUnlike } from "@/hooks/useLikeUnlike";

interface ICommentSectionProps {
  comments: CommentEntity[];
  pending: boolean;
}

export default function CommentSection({
  comments,
  pending,
}: ICommentSectionProps) {
  return (
    <Box my={6}>
      {pending ? (
        <>Loading....</>
      ) : (
        <>
          {comments.map((comment, index) => (
            <CommentBox key={index} comment={comment} />
          ))}
        </>
      )}
    </Box>
  );
}

function CommentBox({ comment }: { comment: CommentEntity }) {
  const dispatch = useAppDispatch();
  const [showCommentReplies, setCommentReplies] = useState(false);
  const { handleLikeUnlike, liked } = useLikeUnlike({
    entityId: comment.id,
    entityName: "Comment",
  });

  const addReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    dispatch(createReply({ content, parentId: comment.id })).unwrap();
  };

  return (
    <Box my={4}>
      <>
        <Flex gap={2} alignItems={"center"}>
          <Avatar
            name="Kontraa "
            src={
              comment.user.profilePath
                ? ((import.meta.env.VITE_AWS_BUCKET_LINK +
                    comment.user.profilePath) as string)
                : "/images/img1.jpg"
            }
            size={"sm"}
          />
          <VStack gap={0} alignItems="start">
            <Text>{comment.user.username}</Text>
            <Text className="small" color={"gray.600"}>
              {formatDistanceToNow(comment.createdAt || new Date())}
            </Text>
          </VStack>
        </Flex>
        <Text my={2}>{comment.content}</Text>
        <HStack gap={4} m={0}>
          <Text
            className="small"
            color={"gray.400"}
            onClick={handleLikeUnlike}
            cursor={"pointer"}
            display={"inline-flex"}
            gap={1.5}
            alignItems={"center"}
          >
            {liked ? (
              <ThumbsUp size={16} fill="#fff" />
            ) : (
              <ThumbsUp size={16} />
            )}
            {comment.upVoteCount}
          </Text>
          <Text
            className="small"
            onClick={() => {
              if (comment.repliesCount > 0) {
                if (comment.repliesCount !== comment.replies.length) {
                  dispatch(fetchReplies({ parentId: comment.id })).unwrap();
                }
                setCommentReplies(!showCommentReplies);
              }
            }}
            textDecoration={comment.repliesCount > 0 ? "underline" : "none"}
            cursor={comment.repliesCount > 0 ? "pointer" : "default"}
            color={"gray.400"}
          >
            {comment.repliesCount} replies
          </Text>
        </HStack>
      </>
      {showCommentReplies && (
        <Box ml={8} borderLeft={"1px solid"} borderColor={"gray.700"} px={4}>
          {comment.replies.map((reply, index) => (
            <CommentBox key={index} comment={reply} />
          ))}
        </Box>
      )}
      <form onSubmit={addReply}>
        <Flex
          alignItems="end"
          ml={8}
          gap={2}
          w={{ base: "full", md: "1/2" }}
          mt={2}
        >
          <CustomInput
            name="content"
            label="Reply"
            required={false}
            placeholder="Reply to the comment"
          />
          <Button
            variant={"ghost"}
            color={"white"}
            _hover={{
              backgroundColor: "gray.600/30",
            }}
            type="submit"
          >
            <SendHorizonal size={20} />
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
