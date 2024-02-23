import { NavLink, Navigate, Outlet, useParams } from "react-router-dom";
import useQueryHandler from "../lib/react query/useQuery";
import { USER } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { BeatLoader } from "react-spinners";
import ProfileImg from "../components/profile img";
import { RiPencilFill } from "react-icons/ri";
import { useRef, useState } from "react";
import useUploadImg from "../hooks/useUploadImg";
import { BsCameraFill } from "react-icons/bs";
import { PiUploadSimpleLight } from "react-icons/pi";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import profileBg from "../assets/profileBg.webp";
import Model from "../components/model";
import UploadImg from "../components/uploadImg";
import useFollow from "../hooks/useFollow";
import useAuthUser from "../hooks/useAuthUser";
import useEditAuthUser from "../hooks/useEditAuthUser";
import EditInput from "../components/editInput";

function Profile() {
  const { id } = useParams();
  const { data: authUser } = useAuthUser();
  const isAuthUserProfile = authUser!.id === id;
  const openDisplayNameBtn = useRef<HTMLButtonElement>(null);
  const openBioBtn = useRef<HTMLButtonElement>(null);

  const {
    data: userInfo,
    error,
    isLoading,
  } = useQueryHandler<USER>(
    ["user", id],
    async () => {
      const docSnap = await getDoc(doc(db, "users", id!));

      if (!docSnap.exists()) throw new Error("user dosn't exsist");
      const userData = { ...docSnap.data(), id: docSnap.id } as USER;

      return userData;
    },
    { refetchOnWindowFocus: false, enabled: !isAuthUserProfile }
  );
  const { handleFollow } = useFollow(userInfo);

  const [openDisplayName, setOpenDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState(authUser?.displayName || "");
  const [openBio, setOpenBio] = useState(false);
  const [bio, setBio] = useState(authUser?.bio || "");
  const {
    imgUrl: profBg,
    setImgUrl: setProfBg,
    uploadImg: uploadProfBg,
    uploadProgress: uploadProfBgProgress,
  } = useUploadImg(authUser!.profileBg);
  const { imgUrl, setImgUrl, uploadImg, uploadProgress } = useUploadImg(
    authUser!.photoURL
  );

  const [openUploadImg, setOpenUploadImg] = useState(false);
  const [openUploadProfBg, setOpenUploadProfBg] = useState(false);

  const { mutate: updateAuthUser } = useEditAuthUser({
    displayName,
    bio,
    photoURL: imgUrl || authUser?.photoURL,
    profileBg: profBg || authUser?.profileBg,
  });
  if (!isAuthUserProfile && isLoading)
    return (
      <div>
        <BeatLoader />
      </div>
    );
  if (!isAuthUserProfile && error?.message === "user dosn't exsist")
    return <Navigate to="/" />;
  if (userInfo || authUser)
    return (
      <>
        <div>
          <div>
            <div className="h-72 relative">
              <img
                width={900}
                height={280}
                loading="lazy"
                className="w-full h-full object-cover object-center rounded-2xl"
                src={
                  isAuthUserProfile
                    ? authUser!.profileBg || profileBg
                    : userInfo?.profileBg || profileBg
                }
                alt="profile bg"
              />
              {isAuthUserProfile && (
                <button
                  onClick={() => setOpenUploadProfBg(true)}
                  className="absolute right-2 bottom-2 rounded-xl px-2 py-1 flex items-center space-x-1 bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-bg-secondary/80 dark:hover:bg-dark-bg-secondary/80 transition-colors"
                >
                  <BsCameraFill size="20" />
                  <span> change background</span>
                </button>
              )}
            </div>
            <div className="px-3 mb-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="-mt-16 relative z-10">
                  <ProfileImg
                    url={
                      isAuthUserProfile
                        ? authUser!.photoURL
                        : userInfo?.photoURL || ""
                    }
                    gender={userInfo?.gender || authUser!.gender}
                    className="w-32 h-32 border-4 border-white rounded-full object-cover object-center"
                  />
                  {isAuthUserProfile && (
                    <button
                      aria-label="change profile photo"
                      onClick={() => setOpenUploadImg(true)}
                      className="absolute right-0 bottom-0 rounded-full w-8 h-8 flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-bg-secondary/80 dark:hover:bg-dark-bg-secondary/80 transition-colors"
                    >
                      <BsCameraFill size="20" />
                    </button>
                  )}
                </div>
                {!isAuthUserProfile && (
                  <button
                    aria-label={
                      authUser?.followings.includes(userInfo!.id)
                        ? "unfollow"
                        : "follow"
                    }
                    onClick={() => handleFollow()}
                    className="capitalize flex items-center space-x-1 bg-red-500 hover:bg-red-700 transition-colors px-3 py-1 text-white rounded-full"
                  >
                    {authUser?.followings.includes(userInfo!.id) ? (
                      <>
                        <span>unfollow</span> <SlUserUnfollow size="19" />
                      </>
                    ) : (
                      <>
                        <span>follow</span> <SlUserFollow size="19" />
                      </>
                    )}
                  </button>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  {openDisplayName && isAuthUserProfile ? (
                    <EditInput
                      existingValue={authUser!.displayName}
                      value={displayName}
                      onChange={(value) => setDisplayName(value)}
                      submit={() => updateAuthUser()}
                      close={() => setOpenDisplayName(false)}
                      placeHolder="type your display name"
                      isOpen={openDisplayName}
                      openBtn={openDisplayNameBtn}
                    />
                  ) : (
                    <h1 className="text-2xl font-semibold">
                      {isAuthUserProfile
                        ? authUser!.displayName
                        : userInfo?.displayName}
                    </h1>
                  )}
                  {isAuthUserProfile && (
                    <button
                      aria-label="edit display name"
                      className={openDisplayName ? "hidden" : ""}
                      ref={openDisplayNameBtn}
                      onClick={() => {
                        setOpenDisplayName(true);
                      }}
                    >
                      <RiPencilFill size="18" />
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {openBio && isAuthUserProfile ? (
                    <EditInput
                      existingValue={authUser!.bio}
                      value={bio}
                      onChange={(value) => setBio(value)}
                      submit={() => updateAuthUser()}
                      close={() => setOpenBio(false)}
                      placeHolder="type your bio"
                      isOpen={openBio}
                      openBtn={openBioBtn}
                    />
                  ) : (
                    <p className="mb-1 text-light-textColor-secondary dark:text-dark-textColor-secondary">
                      {isAuthUserProfile
                        ? authUser?.bio || "add a bio"
                        : userInfo?.bio}
                    </p>
                  )}
                  {isAuthUserProfile && (
                    <button
                      aria-label="edit bio"
                      className={openBio ? "hidden" : ""}
                      ref={openBioBtn}
                      onClick={() => {
                        setOpenBio(true);
                      }}
                    >
                      <RiPencilFill size="18" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-8">
                <span>
                  {isAuthUserProfile
                    ? authUser!.followers
                    : userInfo?.followers}{" "}
                  <span className="text-light-textColor-secondary dark:text-dark-textColor-secondary text-sm">
                    followers
                  </span>
                </span>
                <span>
                  {isAuthUserProfile
                    ? authUser!.followings.length
                    : userInfo?.followings.length}{" "}
                  <span className="text-light-textColor-secondary dark:text-dark-textColor-secondary text-sm">
                    following
                  </span>
                </span>
              </div>
              <div>
                <nav>
                  <ul className="flex items-center ">
                    <li>
                      <NavLink
                        className="relative py-3 px-11 inline-block text-lg [&:not(.active)]:hover:bg-slate-200 dark:[&:not(.active)]:hover:bg-[#232632]  transition-colors  [&:not(.active)]:text-light-textColor-secondary dark:[&:not(.active)]:text-light-textColor-secondary [&.active]:after:content-[''] [&.active]:after:absolute [&.active]:after:left-1/2 [&.active]:after:-translate-x-1/2 [&.active]:after:top-full [&.active]:after:-translate-y-1  [&.active]:after:w-1/3 [&.active]:after:h-1 [&.active]:after:bg-primary"
                        to="."
                        end
                      >
                        posts
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="relative py-3 px-11 inline-block text-lg [&:not(.active)]:hover:bg-slate-200 dark:[&:not(.active)]:hover:bg-[#232632]  transition-colors  [&:not(.active)]:text-light-textColor-secondary dark:[&:not(.active)]:text-light-textColor-secondary [&.active]:after:content-[''] [&.active]:after:absolute [&.active]:after:left-1/2 [&.active]:after:-translate-x-1/2 [&.active]:after:top-full [&.active]:after:-translate-y-1  [&.active]:after:w-1/3 [&.active]:after:h-1 [&.active]:after:bg-primary"
                        to="images"
                      >
                        images
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="lg:w-[60%]">
              <Outlet />
            </div>
          </div>
        </div>
        {openUploadImg && (
          <Model
            title="change profile image"
            close={() => {
              setImgUrl("");
              setOpenUploadImg(false);
            }}
          >
            <UploadImg
              url={authUser!.photoURL}
              uploadProgress={uploadProgress}
              onRemove={() => {
                setImgUrl("");
              }}
              onImageChange={(img) => {
                uploadImg(img);
              }}
            />
            <div className="flex justify-center mt-2">
              {imgUrl && imgUrl !== authUser!.photoURL && (
                <button
                  aria-label="upload image"
                  onClick={() => {
                    updateAuthUser();
                    setOpenUploadImg(false);
                  }}
                  className="btn-submit"
                >
                  <PiUploadSimpleLight size="22" />
                </button>
              )}
            </div>
          </Model>
        )}
        {openUploadProfBg && (
          <Model
            title="change profile background"
            close={() => {
              setProfBg("");
              setOpenUploadProfBg(false);
            }}
          >
            <UploadImg
              url={authUser!.profileBg}
              uploadProgress={uploadProfBgProgress}
              onRemove={() => {
                setProfBg("");
              }}
              onImageChange={(img) => {
                uploadProfBg(img);
              }}
            />
            <div className="flex justify-center mt-2">
              {profBg && profBg !== authUser!.profileBg && (
                <button
                  aria-label="upload image"
                  onClick={() => {
                    updateAuthUser();
                    setOpenUploadProfBg(false);
                  }}
                  className="btn-submit"
                >
                  <PiUploadSimpleLight size="22" />
                </button>
              )}
            </div>
          </Model>
        )}
      </>
    );
}
export default Profile;
