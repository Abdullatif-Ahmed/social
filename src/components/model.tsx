import { ReactNode, memo } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
type ModelType = {
  close: () => void;
  title?: string;
  children: ReactNode;
};
const Model = memo(({ close, title, children }: ModelType) => {
  return createPortal(
    <>
      <div className="overlay">
        <div className="h-screen flex justify-center items-center p-4 fixed w-full">
          <div
            role="dialog"
            className="border border-light-borderColor dark:border-dark-borderColor bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 rounded-md w-full max-w-lg  text-light-textColor dark:text-dark-textColor sh animate-fade-in"
          >
            <header className="flex items-center justify-between mb-2">
              {title && <h2 className="capitalize text-lg">{title}</h2>}
              <button aria-label="close model" onClick={close}>
                <IoClose size="22" />
              </button>
            </header>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal") as HTMLDivElement
  );
});

export default Model;
