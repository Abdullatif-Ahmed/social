import { ReactNode, RefObject, memo } from "react";
import useClickOutSide from "../hooks/useClickOutSide";

type DropDownType = {
  children: ReactNode;
  close: () => void;
  isOpen: boolean;
  position: "right" | "left" | "center";
  btn: RefObject<HTMLButtonElement>;
};
const DropDown = memo(
  ({ children, position, isOpen, close, btn }: DropDownType) => {
    const ref = useClickOutSide(isOpen, close, btn);
    return (
      <div
        ref={ref}
        className={`py-1 rounded-lg border border-solid border-gray-300 dark:border-[#2a2a2a] shadow-lg bg-light-bg-secondary dark:bg-dark-bg-secondary absolute top-[calc(100%+20px)] ${
          position === "left"
            ? "left-0"
            : position === "right"
            ? "right-0"
            : "left-1/2 -translate-x-1/2"
        }`}
      >
        {children}
      </div>
    );
  }
);

export default DropDown;
