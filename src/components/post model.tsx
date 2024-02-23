import { memo, useState } from "react";
import { BiLink } from "react-icons/bi";
import { IoClose, IoImage } from "react-icons/io5";
import useOptimisticUpdate from "../lib/react query/useOptimisticUpdate";
import { PostType } from "../types";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import UploadImg from "./uploadImg";
import useUploadImg from "../hooks/useUploadImg";
import useAuthUser from "../hooks/useAuthUser";
import { QueryKey } from "react-query";
type PostModelProps = {
  close: () => void;
  postType?: "image" | "link" | "content";
  cachedId: QueryKey;
  post?: PostType;
};

const PostModel = memo((props: PostModelProps) => {
  const { data: user } = useAuthUser();

  const [postType, setPostType] = useState<"image" | "link" | "content">(
    props.post?.type || props.postType || "content"
  );
  const [content, setContent] = useState(props.post?.content || "");
  const [link, setLink] = useState(props.post?.link || "");
  const { imgUrl, setImgUrl, uploadImg, uploadProgress } = useUploadImg(
    props.post?.imgUrl || ""
  );
  const postData = Object.assign(
    { content },
    link
      ? { link, type: "link" }
      : imgUrl
      ? { imgUrl, type: "image" }
      : { type: "content" }
  );

  const { mutate } = useOptimisticUpdate<PostType>(
    async () => {
      const postRef = collection(db, "posts");
      props.post
        ? await setDoc(doc(db, "posts", props.post.id), {
            userId: user?.id,
            timestamp: props.post.timestamp,
            ...postData,
            likedUsers: props.post.likedUsers,
            savedUsers: props.post.savedUsers,
            commentsLength: props.post.commentsLength,
          })
        : await addDoc(postRef, {
            userId: user?.id,
            ...postData,
            timestamp: serverTimestamp(),
            likedUsers: [],
            savedUsers: [],
            commentsLength: 0,
          });
    },
    props.post
      ? [
          {
            type: "EDIT",
            cachedId: props.cachedId,
            id: props.post.id,
            data: {
              timestamp: props.post.timestamp,
              id: props.post.id,
              likedUsers: props.post.likedUsers,
              savedUsers: props.post.savedUsers,
              userId: user?.id || "",
              commentsLength: props.post.commentsLength,
              ...postData,
            },
          },
        ]
      : [
          {
            type: "ADD",
            cachedId: props.cachedId,
            data: {
              userId: user?.id || "",
              ...postData,
              timestamp: serverTimestamp(),
              id: `${Math.random()}`,
              likedUsers: [],
              savedUsers: [],
              commentsLength: 0,
            },
          },
        ],
    {
      successMsg: props.post
        ? "post successfully edited"
        : "post successfully added",
      errorMsg: props.post
        ? "Faild to edit your post"
        : "Faild to Add the post",
    }
  );

  function validPost() {
    if (
      imgUrl ||
      (content && !imgUrl && postType !== "link") ||
      (postType === "link" && link)
    ) {
      return true;
    } else return false;
  }
  function reset() {
    setImgUrl("");
    setLink("");
  }
  function handlePost() {
    if (validPost()) {
      mutate();
      props.close();
    }
  }
  console.log(postType);
  return (
    <>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
        className="w-full min-h-[80px] max-h-[100px] resize-none focus-visible:outline-none p-2 bg-light-bg dark:bg-dark-bg rounded"
        name="content"
        id="content"
      ></textarea>
      {postType === "link" || link ? (
        <div className="px-2 bg-light-bg dark:bg-dark-bg rounded flex items-center space-x-1">
          <input
            autoFocus
            value={link}
            name="link"
            type="url"
            placeholder="type a video link"
            className=" py-1 bg-inherit w-full rounded"
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            aria-label="content post"
            onClick={() => {
              setPostType("content");
              setLink("");
            }}
          >
            <IoClose size="20" />
          </button>
        </div>
      ) : postType === "image" ? (
        <UploadImg
          uploadProgress={uploadProgress}
          url={imgUrl}
          onImageChange={(img) => {
            uploadImg(img);
          }}
          onRemove={() => reset()}
        />
      ) : (
        ""
      )}

      <div className="flex  mt-2  justify-between">
        <div className="flex items-center space-x-3">
          <button
            aria-label="photo post"
            onClick={() => {
              reset();
              setPostType("image");
            }}
            className="hover:text-primary transition"
          >
            <IoImage size="22" />
          </button>
          <button
            aria-label="video link post"
            onClick={() => {
              reset();
              setPostType("link");
            }}
            className="hover:text-primary transition"
          >
            <BiLink size="22" />
          </button>
        </div>
        <button
          aria-label="send post"
          disabled={!validPost()}
          onClick={() => handlePost()}
          className="btn-submit"
        >
          Post
        </button>
      </div>
    </>
  );
});

export default PostModel;
