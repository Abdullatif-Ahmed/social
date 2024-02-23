import { FormEvent, RefObject, memo } from "react";
import { TbPencilCheck } from "react-icons/tb";
import useClickOutSide from "../hooks/useClickOutSide";

type EditInputType = {
  value: string;
  existingValue: string;
  onChange: (value: string) => void;
  submit: () => void;
  close: () => void;
  placeHolder: string;
  isOpen: boolean;
  openBtn: RefObject<HTMLButtonElement>;
};
const EditInput = memo((props: EditInputType) => {
  const {
    value,
    existingValue,
    onChange,
    submit,
    close,
    placeHolder,
    isOpen,
    openBtn,
  } = props;

  const ref = useClickOutSide(
    isOpen,
    () => {
      onChange(existingValue);
      close();
    },
    openBtn
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value) {
      if (value !== existingValue) {
        submit();
      }
      close();
    }
  }
  return (
    <div ref={ref}>
      <form onSubmit={handleSubmit} className="flex items-center space-x-1">
        <input
          placeholder={placeHolder}
          autoFocus
          className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded mb-1 p-2"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button aria-label="submit" type="submit">
          <TbPencilCheck size="18" />
        </button>
      </form>
    </div>
  );
});

export default EditInput;
