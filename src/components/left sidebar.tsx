import { NavLink, useLocation } from "react-router-dom";
import { GoBookmark, GoHeart } from "react-icons/go";

import { IconContext } from "react-icons";
import { MdExplore, MdOutlineRssFeed } from "react-icons/md";
import { memo } from "react";

const LeftSidebar = memo(() => {
  const { pathname } = useLocation();
  return (
    <>
      <aside
        className={`side-bar ${
          !pathname.match(/profile/)
            ? "md:w-[calc(20%-1.25rem/2)]"
            : "md:w-[calc(20%-1.25rem)]"
        } min-[900px]:w-[calc(20%-1.25rem)] `}
      >
        <nav>
          <ul className="space-y-4">
            <IconContext.Provider value={{ size: "22", className: "mr-3" }}>
              <li>
                <NavLink to="/" className="nav-link">
                  <MdExplore />
                  explore
                </NavLink>
              </li>
              <li>
                <NavLink to="myfeed" className="nav-link">
                  <MdOutlineRssFeed />
                  my feed
                </NavLink>
              </li>

              <li>
                <NavLink to="saved" className="nav-link">
                  <GoBookmark />
                  saved
                </NavLink>
              </li>
              <li>
                <NavLink to="liked" className="nav-link">
                  <GoHeart />
                  liked
                </NavLink>
              </li>
            </IconContext.Provider>
          </ul>
        </nav>
      </aside>
    </>
  );
});

export default LeftSidebar;
