import { memo, useCallback, useEffect, useRef, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import ProfileImg from "./profile img";
import useAuthUser from "../hooks/useAuthUser";
import { MdComputer, MdDarkMode, MdLightMode } from "react-icons/md";
import DropDown from "./dropDown";
import useEditAuthUser from "../hooks/useEditAuthUser";
import logo from "../assets/project logo.webp";
const Header = memo(() => {
  const { data: user, refetch } = useAuthUser();
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(
    user?.themeMode || "light"
  );
  const { mutate } = useEditAuthUser({ themeMode });
  const [openProfileDropD, setOpenProfileDropD] = useState(false);

  const [openThemeModeDropD, setOpenThemeModeDropD] = useState(false);
  const themeModeBtn = useRef<HTMLButtonElement>(null);
  const profileBtn = useRef<HTMLButtonElement>(null);

  const handleSignOut = async () => {
    await signOut(auth);
    refetch();
  };
  const closeThemeMode = useCallback(() => setOpenThemeModeDropD(false), []);
  const closeProfileDrop = useCallback(() => setOpenProfileDropD(false), []);
  useEffect(() => {
    if (themeMode !== user?.themeMode) {
      mutate();
      console.log("haaaa");
    }
  }, [themeMode, user?.themeMode, mutate]);
  return (
    <header className="bg-light-bg-secondary dark:bg-dark-bg-secondary  border-b border-light-borderColor/80 dark:border-dark-borderColor/80 sticky z-40 top-0 shadow">
      <div className="xl:container xl:mx-auto px-4">
        <div className="flex justify-between items-center h-headerH  gap-x-3 sm:gap-x-16">
          <div>
            <Link
              to="/"
              className="font-logo capitalize text-3xl font-bold text-primary"
            >
              <img
                width={90}
                height={30}
                className="w-full h-full"
                src={logo}
                alt="social"
              />
            </Link>
          </div>

          <div className="">
            <ul className="flex items-center  gap-x-4 ">
              <li className="text-light-textColor dark:text-dark-textColor relative">
                <button
                  aria-label="open theme mode model"
                  ref={themeModeBtn}
                  onClick={() => {
                    setOpenThemeModeDropD((state) => !state);
                  }}
                  className={`w-9 h-9 rounded-md flex justify-center items-center bg-light-bg dark:bg-dark-bg border border-light-borderColor/40 dark:border-dark-borderColor ${
                    openThemeModeDropD
                      ? " ring-1 ring-offset-1 ring-gray-400 dark:ring-[#494949] dark:ring-offset-dark-bg-secondary "
                      : ""
                  }`}
                >
                  {user?.themeMode === "dark" ||
                  (user?.themeMode === "system" &&
                    window.matchMedia("(prefers-color-scheme: dark)")
                      .matches) ? (
                    <MdLightMode size="20" />
                  ) : (
                    <MdDarkMode size="20" />
                  )}
                </button>
                {openThemeModeDropD && (
                  <DropDown
                    position="center"
                    close={closeThemeMode}
                    isOpen={openThemeModeDropD}
                    btn={themeModeBtn}
                  >
                    <ul>
                      <li>
                        <button
                          aria-label="light"
                          onClick={() => {
                            closeThemeMode();
                            setThemeMode("light");
                          }}
                          className={`${
                            user?.themeMode === "light" ? "text-primary" : ""
                          } text-sm font-medium px-3 py-[6px] w-36 flex items-center space-x-2 transition hover:bg-slate-50 dark:hover:bg-[#0a0a0a] capitalize`}
                        >
                          <MdLightMode
                            size="20"
                            className={`${
                              user?.themeMode === "light"
                                ? "text-primary"
                                : "text-light-textColor-secondary dark:text-dark-textColor-secondary"
                            } `}
                          />{" "}
                          <span>light</span>
                        </button>
                      </li>
                      <li>
                        <button
                          aria-label="dark"
                          onClick={() => {
                            setOpenThemeModeDropD(false);
                            setThemeMode("dark");
                          }}
                          className={`${
                            user?.themeMode === "dark" ? "text-primary" : ""
                          } text-sm font-medium  px-3 py-[6px] w-36 flex items-center space-x-2 transition hover:bg-slate-50  dark:hover:bg-[#0a0a0a] capitalize`}
                        >
                          <MdDarkMode
                            size="20"
                            className={`${
                              user?.themeMode === "dark"
                                ? "text-primary"
                                : "text-light-textColor-secondary dark:text-dark-textColor-secondary"
                            } `}
                          />{" "}
                          <span>dark</span>
                        </button>
                      </li>
                      <li>
                        <button
                          aria-label="system"
                          onClick={() => {
                            setOpenThemeModeDropD(false);
                            setThemeMode("system");
                          }}
                          className={`${
                            user?.themeMode === "system" ? "text-primary" : ""
                          } text-sm font-medium  px-3 py-[6px] w-36 flex items-center space-x-2 transition hover:bg-slate-50  dark:hover:bg-[#0a0a0a] capitalize`}
                        >
                          <MdComputer
                            size="20"
                            className={`${
                              user?.themeMode === "system"
                                ? "text-primary"
                                : "text-light-textColor-secondary dark:text-dark-textColor-secondary"
                            } `}
                          />{" "}
                          <span>system</span>
                        </button>
                      </li>
                    </ul>
                  </DropDown>
                )}
              </li>
              <li className="w-9 h-9 relative rounded-full">
                <button
                  aria-label="open profile model"
                  ref={profileBtn}
                  className={`${
                    openProfileDropD
                      ? " ring-1 ring-offset-1 ring-gray-400 dark:ring-[#494949] dark:ring-offset-dark-bg-secondary "
                      : ""
                  } w-full h-full rounded-full bg-light-bg dark:bg-dark-bg border border-light-borderColor/40 dark:border-dark-borderColor`}
                  onClick={() => {
                    setOpenProfileDropD((state) => !state);
                  }}
                >
                  <ProfileImg
                    url={user!.photoURL}
                    gender={user!.gender}
                    className="rounded-full w-full h-full object-cover object-center"
                  />
                </button>
                {openProfileDropD && (
                  <DropDown
                    position="right"
                    isOpen={openProfileDropD}
                    close={closeProfileDrop}
                    btn={profileBtn}
                  >
                    <ul className="divide-y divide-gray-300  dark:divide-[#2a2a2a] w-36">
                      <li className=" !rounded-none ">
                        <Link
                          className="inline-block px-3 py-[6px] w-full h-full hover:text-primary"
                          to="/profile"
                          onClick={() => closeProfileDrop()}
                        >
                          profile
                        </Link>
                      </li>
                      <li className=" !rounded-none">
                        <button
                          aria-label="log out"
                          className="text-left px-3 py-[6px] w-full h-full hover:text-primary"
                          onClick={() => handleSignOut()}
                        >
                          log out
                          <IoLogOutOutline
                            size="22"
                            className="ml-2 inline-block"
                          />
                        </button>
                      </li>
                    </ul>
                  </DropDown>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
