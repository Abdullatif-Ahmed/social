import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import useOptimisticUpdate from "../lib/react query/useOptimisticUpdate";
import { db } from "../firebase";
import { USER } from "../types";
import useAuthUser from "./useAuthUser";

const useFollow = (userInfo: USER | undefined) => {
  const { data: authUser } = useAuthUser();
  const isFollowing = authUser?.followings.some((id) => id === userInfo?.id);

  const { mutate: handleFollow } = useOptimisticUpdate(
    async () => {
      if (userInfo) {
        await Promise.all([
          updateDoc(doc(db, "users", authUser?.id || ""), {
            followings: isFollowing
              ? arrayRemove(userInfo.id)
              : arrayUnion(userInfo.id),
          }),
          updateDoc(doc(db, "users", userInfo.id), {
            followers: isFollowing
              ? userInfo.followers - 1
              : userInfo.followers + 1,
          }),
        ]);
      }
    },
    [
      {
        type: "USEREDIT",
        cachedId: ["user", userInfo?.id || ""],
        data: {
          ...userInfo!,
          followers: isFollowing
            ? (userInfo?.followers || 1) - 1
            : (userInfo?.followers || 0) + 1,
        },
      },
      {
        type: "USEREDIT",
        cachedId: "authUser",
        data: {
          ...authUser!,
          followings: isFollowing
            ? authUser?.followings.filter((id) => id !== userInfo?.id) || []
            : [...(authUser?.followings || []), userInfo?.id || ""],
        },
      },
    ],
    {
      successMsg: isFollowing
        ? `you successfully unfollowed ${userInfo?.displayName}`
        : `you successfully followed ${userInfo?.displayName}`,
      errorMsg: isFollowing
        ? `faild to unfollow ${userInfo?.displayName}`
        : `faild to follow ${userInfo?.displayName}`,
    }
  );

  return { handleFollow };
};

export default useFollow;
