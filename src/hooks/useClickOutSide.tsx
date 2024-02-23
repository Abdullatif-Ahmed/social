import { RefObject, useEffect, useRef } from "react";

const useClickOutSide = (
  isOpen: boolean,
  close: () => void,
  btn: RefObject<HTMLButtonElement>
) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function clickOutSide(e: MouseEvent) {
      if (
        ref.current &&
        btn.current &&
        isOpen &&
        !btn.current?.contains(e.target as Node) &&
        !ref.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("click", clickOutSide);
    return () => document.removeEventListener("click", clickOutSide);
  }, [isOpen, close, btn]);
  return ref as React.MutableRefObject<HTMLDivElement>;
};

export default useClickOutSide;
