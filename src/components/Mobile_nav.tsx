import { memo } from "react";
import { IconContext } from "react-icons";
import { GoBookmark, GoHeart } from "react-icons/go";
import { MdExplore, MdOutlineRssFeed } from "react-icons/md";
import { NavLink } from "react-router-dom";

const MobileNav = memo(() => {
  return (
    <div className="md:hidden z-10 fixed bottom-0 left-0 w-full ">
      <nav>
        <ul className="flex bg-light-bg-secondary dark:bg-dark-bg-secondary max-w-max mx-auto rounded-t-mobileNav">
          <IconContext.Provider value={{ size: "30" }}>
            <li>
              <NavLink to="/" className="nav-link" aria-label="explore">
                <MdExplore />
              </NavLink>
            </li>
            <li>
              <NavLink to="myfeed" className="nav-link" aria-label="my feed">
                <MdOutlineRssFeed />
              </NavLink>
            </li>

            <li>
              <NavLink to="saved" className="nav-link" aria-label="saved">
                <GoBookmark />
              </NavLink>
            </li>
            <li>
              <NavLink to="liked" className="nav-link" aria-label="liked">
                <GoHeart />
              </NavLink>
            </li>
          </IconContext.Provider>
        </ul>
      </nav>
    </div>
  );
});

export default MobileNav;
