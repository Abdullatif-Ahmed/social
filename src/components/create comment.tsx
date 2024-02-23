import { Dispatch, FormEvent, SetStateAction, memo, useState } from "react";
import { IoSend } from "react-icons/io5";
import { CommentType, PostType } from "../types";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import useOptimisticUpdate from "../lib/react query/useOptimisticUpdate";
import useAuthUser from "../hooks/useAuthUser";
import { QueryKey } from "react-query";

type AddCommentType = {
  type: "add_comment";
  postId: string;
  openComments: Dispatch<SetStateAction<boolean>>;
  postData: PostType;
  postsCachedId: QueryKey;
};
type EditCommentType = {
  type: "edit_comment";
  postId: string;
  comment: CommentType;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
};
const CreateComment = memo(function CreateComment(
  props: AddCommentType | EditCommentType
) {
  const { data: user } = useAuthUser();
  const [commentVal, setCommentVal] = useState(
    props.type === "edit_comment" ? props.comment.content : ""
  );
  const { mutate } = useOptimisticUpdate<CommentType>(
    async () => {
      const postRef = doc(db, "posts", props.postId);
      const commentsRef = collection(postRef, "comments");
      props.type === "add_comment"
        ? await Promise.all([
            addDoc(commentsRef, {
              userId: user?.id,
              content: commentVal,
              timestamp: serverTimestamp(),
            }),
            updateDoc(postRef, {
              commentsLength: props.postData.commentsLength + 1,
            }),
          ])
        : await updateDoc(
            doc(
              db,
              "posts",
              props.postId,
              "comments",
              props.type === "edit_comment" ? props.comment.id : ""
            ),
            {
              content: commentVal.trim(),
            }
          );
    },
    props.type === "add_comment"
      ? [
          {
            type: "ADD",
            cachedId: ["comments", props.postId],
            data: {
              userId: user?.id || "",
              content: commentVal,
              timestamp: serverTimestamp(),
              id: `${Math.random()}`,
            },
          },
          {
            type: "EDIT",
            id: props.postData.id,
            cachedId: props.postsCachedId,
            data: {
              ...props.postData,
              commentsLength: props.postData.commentsLength + 1,
            },
          },
        ]
      : [
          {
            type: "EDIT",
            cachedId: ["comments", props.postId],
            id: props.comment.id,
            data: {
              ...props.comment,
              content: commentVal.trim(),
            },
          },
        ],
    {
      successMsg:
        props.type === "add_comment"
          ? "comment successfully added"
          : "your comment successfully edited",
      errorMsg:
        props.type === "add_comment"
          ? "faild to add the comment"
          : "faild to edit your comment",
    }
  );

  function sendComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (commentVal.trim()) {
      mutate();
      if (props.type === "add_comment") {
        props.openComments(true);
      } else {
        props.setEditOpen(false);
      }
      setCommentVal("");
    }
  }
  return (
    <form
      onSubmit={sendComment}
      className={` ${
        props.type === "add_comment" ? "!ml-3 sm:!ml-9" : ""
      } px-3 py-1 flex items-center rounded-xl border border-light-borderColor/80 dark:border-dark-borderColor/80 flex-1 bg-light-bg dark:bg-dark-bg`}
    >
      <textarea
        onChange={(e) => setCommentVal(e.target.value)}
        value={commentVal}
        placeholder={`${
          props.type === "add_comment"
            ? "add a comment..."
            : "edit your comment"
        }`}
        autoFocus={props.type === "edit_comment"}
        rows={1}
        name="comment"
        className="resize-none w-full h-8 py-1 max-h-36 overflow-y-visible bg-transparent focus-visible:outline-none"
      ></textarea>

      <button
        aria-label="send comment"
        type="submit"
        disabled={!commentVal}
        className="text-primary [&:not(:disapled)]:hover:text-primary-effect transition"
      >
        <IoSend size="18" />
      </button>
    </form>
  );
});

export default CreateComment;
