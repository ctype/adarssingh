import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { setCommentsVoteCount } from "@/features/social_system/commentSlice";
import { setMyProfile } from "@/features/system_user/systemUserSlice";
import { setAudiosVoteCount } from "@/features/audio/audioSlice";
import { setPresetsVoteCount } from "@/features/preset/presetSlice";
import { setSoundBanksVoteCount } from "@/features/soundBank/soundBankSlice";
import { setPhotosVoteCount } from "@/features/photo/photoSlice";
import { setVideosVoteCount } from "@/features/video/videoSlice";

export const useLikeUnlike = ({
  entityId,
  entityName,
}: {
  entityId: number;
  entityName: string;
}) => {
  const dispatch = useAppDispatch();
  const [liked, setLiked] = useState(false);
  const { myProfile } = useAppSelector((state) => state.systemUser);

  const handleUpvoteCount = (
    entityName: string,
    entityId: number,
    isLiked: boolean
  ) => {
    const payload = {
      data: {
        like: {
          entityName,
          entityId,
        },
        isLiked,
      },
    };
    switch (entityName) {
      case "Comment":
        dispatch(setCommentsVoteCount(payload));
        break;
      case "Track":
        dispatch(setAudiosVoteCount(payload));
        break;
      case "SoundBank":
        dispatch(setSoundBanksVoteCount(payload));
        break;
      case "Preset":
        dispatch(setPresetsVoteCount(payload));
        break;
      case "Photo":
        dispatch(setPhotosVoteCount(payload));
        break;
      case "Video":
        dispatch(setVideosVoteCount(payload));
        break;
      default:
        console.error("LIKE_UNLIKE: Unhandled entity type");
        break;
    }
  };

  const handleLikeUnlike = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v1/likeUnlike`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityId: entityId,
          entityName: entityName,
        }),
      }
    );
    const data = await res.json();

    // TODO: handle unauthorized
    if (data.like) {
      let newProfileData: dynamicObj = { ...myProfile };
      if (data.hasLiked) {
        newProfileData = {
          ...newProfileData,
          likes: [...(myProfile?.likes ?? []), data.like],
        };
      } else {
        newProfileData = {
          ...newProfileData,
          likes: (myProfile?.likes ?? []).filter((l) => l.id !== data.like.id),
        };
      }
      dispatch(setMyProfile(newProfileData));
      localStorage.setItem("user", JSON.stringify(newProfileData));

      handleUpvoteCount(entityName, entityId, data.hasLiked);
    }
  };

  useEffect(() => {
    const hasLikedTheEntity = async () => {
      setLiked(
        (myProfile?.likes ?? []).filter(
          (l) => l?.entityName === entityName && l?.entityId === entityId
        ).length > 0
      );
    };

    hasLikedTheEntity();
  }, [entityName, entityId, myProfile?.likes]);

  return { handleLikeUnlike, liked };
};
