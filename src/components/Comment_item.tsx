import { memo, useEffect, useRef, useState } from "react";
import { CommentType, PostType, USER } from "../types";
import { Link } from "react-router-dom";

import ReactTimeAgo from "react-time-ago";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useOptimisticUpdate from "../lib/react query/useOptimisticUpdate";
import { db } from "../firebase";
import CreateComment from "./Create_comment";
import useQueryHandler from "../lib/react query/useQuery";
import ProfileImg from "./Profile_img";
import useAuthUser from "../hooks/useAuthUser";
import { toast } from "react-toastify";
import ReadMore from "./Read_more";
import { QueryKey } from "react-query";
const CommentItem = memo(function CommentItem({
  data,
  postData,
  postsCachedId,
}: {
  data: CommentType;
  postData: PostType;
  postsCachedId: QueryKey;
}) {
  const { data: user } = useAuthUser();
  const [editopen, setEditOpen] = useState(false);
  const editBtn = useRef<HTMLButtonElement>(null!);
  const isAuthUserComment = user!.id === data.userId;

  const { data: userInfo } = useQueryHandler<USER>(
    ["user", data.userId],
    async () => {
      const docSnap = await getDoc(doc(db, "users", data.userId));
      const userData = { ...docSnap.data(), id: docSnap.id } as USER;
      return userData;
    },
    {
      enabled: !isAuthUserComment,
      refetchOnWindowFocus: false,
    }
  );
  const { mutate: Delet } = useOptimisticUpdate<CommentType>(async () => {
    const deleteReq = Promise.all([
      deleteDoc(doc(db, "posts", postData.id, "comments", data.id)),
      updateDoc(doc(db, "posts", postData.id), {
        commentsLength: postData.commentsLength - 1,
      }),
    ]);
    await toast.promise(deleteReq, {
      pending: "deleting the comment...",
      success: "your comment successfully deleted",
      error: "faild to delete your comment",
    });
  }, [
    {
      type: "DELETE",
      cachedId: ["comments", postData.id],
      id: data.id,
    },
    {
      type: "EDIT",
      id: postData.id,
      cachedId: postsCachedId,
      data: {
        ...postData,
        commentsLength: postData.commentsLength - 1,
      },
    },
  ]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (editopen) {
        document.querySelectorAll("[data-edit]").forEach((btn) => {
          console.log(btn);
          if (btn !== editBtn.current && btn.contains(e.target as Node)) {
            setEditOpen(false);
            console.log(true);
          }
        });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [editopen]);

  return (
    <li className="flex gap-2 ">
      <Link
        to={`profile${!isAuthUserComment ? `/${userInfo?.id}` : ""}`}
        className="w-6 h-6 border border-light-borderColor dark:border-dark-borderColor rounded-full"
      >
        <ProfileImg
          url={
            isAuthUserComment ? user?.photoURL || "" : userInfo?.photoURL || ""
          }
          gender={
            isAuthUserComment ? user?.gender || "" : userInfo?.gender || ""
          }
          className="rounded-full w-full h-full"
        />
      </Link>
      <div className="bg-light-bg dark:bg-dark-bg rounded px-2 py-1 w-9/12 borderborder-light-borderColor/80 dark:border-dark-borderColor/80">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link to={`profile${!isAuthUserComment ? `/${userInfo?.id}` : ""}`}>
              <h4 className="text-sm md:text-base font-medium">
                {isAuthUserComment ? user?.displayName : userInfo?.displayName}
              </h4>
            </Link>
            <span className="text-[11px] font-medium text-light-textColor-secondary dark:text-dark-textColor-secondary">
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

          {isAuthUserComment && (
            <div className="flex items-center">
              <button
                ref={editBtn}
                data-edit
                onClick={() => setEditOpen(true)}
                className={`text-primary hover:text-primary-effect ${
                  editopen ? "hidden" : ""
                }`}
                aria-label="edit comment"
              >
                <FaRegEdit size={16} />
              </button>
              {!editopen ? (
                <button
                  onClick={() => Delet()}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="delet comment"
                >
                  <MdDelete size={16} />
                </button>
              ) : (
                <button
                  aria-label="close edit comment"
                  className="text-red-800 text-sm font-medium"
                  onClick={() => setEditOpen(false)}
                >
                  close
                </button>
              )}
            </div>
          )}
        </header>
        {!editopen ? (
          <div>
            <p className="break-words text-base md:text-lg md:leading-[1.60rem] text-light-textColor-secondary dark:text-dark-textColor-secondary">
              <ReadMore content={data.content} maxLength={75} />
            </p>
          </div>
        ) : (
          <CreateComment
            type="edit_comment"
            postId={postData.id}
            comment={data}
            setEditOpen={setEditOpen}
          />
        )}
      </div>
    </li>
  );
});

export default CommentItem;
