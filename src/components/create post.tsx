import { memo, useCallback, useState } from "react";

import { IoImages, IoLink } from "react-icons/io5";
import PostModel from "./post model";
import ProfileImg from "./profile img";
import Model from "./model";
import { PostTypeCases } from "../types";
import useAuthUser from "../hooks/useAuthUser";
const CreatePost = memo(function CreatePost({
  cachedId,
}: {
  cachedId: string | string[];
}) {
  const { data: user } = useAuthUser();
  const [openPostModel, setOpenPostModel] = useState<boolean>(false);
  const [postType, setPostType] = useState<PostTypeCases>("content");
  const closeModel = useCallback(() => setOpenPostModel(false), []);
  return (
    <>
      <div className="mb-5 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md p-4 shadow-lg border border-light-borderColor dark:border-dark-borderColor">
        <div className=" flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full border border-light-borderColor dark:border-dark-borderColor">
            <ProfileImg
              className="rounded-full w-full h-full object-cover object-center"
              gender={user?.gender || ""}
              url={user?.photoURL || ""}
            />
          </div>
          <button
            aria-label="open post model"
            onClick={() => {
              setOpenPostModel(true);
              setPostType("content");
            }}
            className="flex-1 text-left rounded-full px-4 py-2 border border-light-borderColor dark:border-dark-borderColor  bg-light-bg dark:bg-dark-bg"
          >
            what in your mind?
          </button>
        </div>
        <div className="flex capitalize items-center justify-around ">
          <button
            aria-label="photo post"
            onClick={() => {
              setOpenPostModel(true);
              setPostType("image");
            }}
            className="flex items-center gap-1 hover:bg-light-bg dark:hover:bg-dark-bg transition p-3 rounded-md"
          >
            <IoImages size="22" /> photos
          </button>
          <button
            aria-label="video link post"
            onClick={() => {
              setOpenPostModel(true);
              setPostType("link");
            }}
            className="flex items-center gap-1 hover:bg-light-bg dark:hover:bg-dark-bg transition p-3 rounded-md"
          >
            <IoLink size="22" /> video link
          </button>
        </div>
      </div>
      {openPostModel && (
        <Model title="create a post" close={closeModel}>
          <PostModel
            close={closeModel}
            cachedId={cachedId}
            postType={postType}
          />
        </Model>
      )}
    </>
  );
});

export default CreatePost;
