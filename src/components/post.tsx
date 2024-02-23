import { PostType, USER } from "../types";

import ReactTimeAgo from "react-time-ago";
import {
  GoBookmark,
  GoBookmarkFill,
  GoComment,
  GoHeart,
  GoHeartFill,
} from "react-icons/go";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";

import { useState } from "react";
import useQueryHandler from "../lib/react query/useQuery";
import CreateComment from "./Create_comment";
import useOptimisticUpdate from "../lib/react query/useOptimisticUpdate";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import PostModel from "./Post_model";
import ProfileImg from "./Profile_img";
import Model from "./Model";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import useFollow from "../hooks/useFollow";
import useAuthUser from "../hooks/useAuthUser";
import { QueryKey } from "react-query";
import Comments from "./Comments";
import { toast } from "react-toastify";
import ReadMore from "./Read_more";
import LazyLoad from "react-lazy-load";

type Props = {
  data: PostType;
  cachedId: QueryKey;
};
function Post({ data, cachedId }: Props) {
  const [editPost, setEditPost] = useState(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const { data: user } = useAuthUser();
  const isPostSaved = data.savedUsers.some((uid) => uid === user?.id);
  const isPostLiked = data.likedUsers.some((Uid) => Uid === user?.id);
  const isAuthUserPost = user!.id === data.userId;

  const { data: userInfo } = useQueryHandler<USER>(
    ["user", data.userId],
    async () => {
      const docSnap = await getDoc(doc(db, "users", data.userId));
      const userData = { ...docSnap.data(), id: docSnap.id } as USER;
      return userData;
    },
    {
      enabled: !isAuthUserPost,
      refetchOnWindowFocus: false,
    }
  );
  const { handleFollow } = useFollow(userInfo);

  const { mutate: likeFn } = useOptimisticUpdate<PostType>(
    async () => {
      await updateDoc(doc(db, "posts", data.id), {
        likedUsers: isPostLiked ? arrayRemove(user?.id) : arrayUnion(user?.id),
      });
    },
    cachedId === "liked"
      ? [
          {
            type: "DELETE",
            cachedId,
            id: data.id,
          },
        ]
      : [
          {
            type: "EDIT",
            id: data.id,
            cachedId,
            data: {
              ...data,
              likedUsers: isPostLiked
                ? data.likedUsers.filter((id) => id !== user?.id)
                : [...data.likedUsers, user?.id || ""],
            },
          },
        ],
    {
      errorMsg: isPostLiked
        ? "faild to dislike the post"
        : "faild to like the post",
    }
  );
  const { mutate: saveFn } = useOptimisticUpdate<PostType>(
    async () => {
      await updateDoc(doc(db, "posts", data.id), {
        savedUsers: isPostSaved ? arrayRemove(user?.id) : arrayUnion(user?.id),
      });
    },
    cachedId === "saved"
      ? [
          {
            type: "DELETE",
            cachedId,
            id: data.id,
          },
        ]
      : [
          {
            type: "EDIT",
            id: data.id,
            cachedId,
            data: {
              ...data,
              savedUsers: isPostSaved
                ? data.savedUsers.filter((id) => id !== user?.id)
                : [...data.savedUsers, user?.id || ""],
            },
          },
        ],
    {
      errorMsg: isPostSaved
        ? "faild to unsaved the post"
        : "faild to save the post",
    }
  );
  const { mutate: Delet } = useOptimisticUpdate<PostType>(async () => {
    await toast.promise(deleteDoc(doc(db, "posts", data.id)), {
      pending: "deleting the post...",
      success: "your post successfully deleted",
      error: "faild to delete your post",
    });
  }, [
    {
      type: "DELETE",
      cachedId,
      id: data.id,
    },
  ]);

  return (
    <>
      <article className=" bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md p-4 sh border border-light-borderColor/80 dark:border-dark-borderColor/80">
        <header className="flex items-start justify-between mb-3 space-x-1">
          <div className="flex items-center space-x-3">
            <Link
              to={`/profile${!isAuthUserPost ? `/${userInfo?.id}` : ""}`}
              className="w-10 h-10 border border-light-borderColor dark:border-dark-borderColor rounded-full"
            >
              <ProfileImg
                url={
                  isAuthUserPost
                    ? user?.photoURL || ""
                    : userInfo?.photoURL || ""
                }
                gender={
                  isAuthUserPost ? user?.gender || "" : userInfo?.gender || ""
                }
                className="rounded-full w-full h-full object-cover object-center"
              />
            </Link>
            <div>
              <Link to={`/profile${!isAuthUserPost ? `/${userInfo?.id}` : ""}`}>
                <h3
                  title={
                    isAuthUserPost ? user?.displayName : userInfo?.displayName
                  }
                  className="font-medium text-base sm:text-lg !leading-[1.25rem] truncate max-w-[134px] sm:max-w-[200px]"
                >
                  {isAuthUserPost ? user?.displayName : userInfo?.displayName}
                </h3>
              </Link>

              <span className="text-xs font-medium text-light-textColor-secondary dark:text-dark-textColor-secondary">
                <ReactTimeAgo
                  date={
                    data.timestamp instanceof Timestamp
                      ? data.timestamp.toDate()
                      : new Date()
                  }
                  locale="en-US"
                />
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthUserPost ? (
              <>
                <button
                  aria-label="edit post"
                  className="hover:text-primary transition"
                  onClick={() => setEditPost(true)}
                >
                  <FaRegEdit size="18" />
                </button>
                <button
                  aria-label="delete post"
                  className="text-red-500 hover:text-red-700 transition"
                  onClick={() => Delet()}
                >
                  <FaRegTrashAlt size="18" />
                </button>
              </>
            ) : (
              <button
                aria-label={
                  user?.followings.includes(data.userId) ? "unfollow" : "follow"
                }
                onClick={() => handleFollow()}
                className="capitalize  text-red-500 hover:text-red-700 transition-colors"
              >
                {user?.followings.includes(data.userId) ? (
                  <>
                    <SlUserUnfollow size="18" />
                  </>
                ) : (
                  <>
                    <SlUserFollow size="18" />
                  </>
                )}
              </button>
            )}
            <button
              aria-label={isPostSaved ? "unsave the post" : "save the post"}
              className={`${
                isPostSaved ? "text-primary" : "hover:text-primary transition"
              }`}
              onClick={() => saveFn()}
            >
              {isPostSaved ? (
                <GoBookmarkFill size="18" />
              ) : (
                <GoBookmark size="18" />
              )}
            </button>
          </div>
        </header>
        <main className="[&_iframe]:aspect-video [&_iframe]:rounded mb-2">
          {data.content && (
            <p className="mb-2 break-words">
              <ReadMore content={data.content} maxLength={300} />
            </p>
          )}
          {data.type === "image" ? (
            <LazyLoad threshold={0.95} className="rounded">
              <img
                height={250}
                width={450}
                src={data.imgUrl}
                alt={data.content || "post image"}
                className="w-full aspect-video object-fill object-center rounded "
              />
            </LazyLoad>
          ) : data.type === "link" ? (
            <ReactPlayer
              height={"auto"}
              width="100%"
              url={data.link}
              controls={true}
            />
          ) : (
            ""
          )}
        </main>
        <footer>
          <div
            className={`flex items-center space-x-3 ${
              openComments ? "pb-2" : ""
            }`}
          >
            <button
              aria-label={isPostLiked ? "unlike the post" : "like post"}
              onClick={() => likeFn()}
              className="flex items-center space-x-1"
            >
              {isPostLiked ? (
                <GoHeartFill size="20" color="red" />
              ) : (
                <GoHeart size="20" />
              )}
              <span>{data.likedUsers.length}</span>
            </button>
            <div className="flex items-center ">
              <GoComment size="20" />
              <span>{data.commentsLength}</span>
              {data.commentsLength > 0 && (
                <button
                  aria-label={openComments ? "close comments" : "open comments"}
                  onClick={() =>
                    data.commentsLength > 0 &&
                    setOpenComments((state) => !state)
                  }
                >
                  {!openComments ? (
                    <MdArrowDropDown size="20" />
                  ) : (
                    <MdArrowDropUp size="20" />
                  )}
                </button>
              )}
            </div>
            <CreateComment
              type="add_comment"
              postId={data.id}
              openComments={setOpenComments}
              postData={data}
              postsCachedId={cachedId}
            />
          </div>

          {openComments && data.commentsLength > 0 && (
            <Comments
              postData={data}
              openComments={openComments}
              postsCachedId={cachedId}
            />
          )}
        </footer>
      </article>
      {editPost && (
        <Model title="edit the post" close={() => setEditPost(false)}>
          <PostModel
            cachedId={cachedId}
            close={() => setEditPost(false)}
            post={data}
          />
        </Model>
      )}
    </>
  );
}

export default Post;
