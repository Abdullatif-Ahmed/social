import { ComponentPropsWithRef, memo } from "react";
import malePhoto from "../assets/male-placeholder.webp";
import femalePhoto from "../assets/female-placeholder.webp";
import loadingImg from "../assets/loading img.webp";
type Props = ComponentPropsWithRef<"img"> & {
  url: string;
  gender: string;
};
const ProfileImg = memo(function ProfileImg({ url, gender, ...rest }: Props) {
  return (
    <img
      width={200}
      height={200}
      loading="lazy"
      src={
        url ||
        (gender === "male"
          ? malePhoto
          : gender === "female"
          ? femalePhoto
          : loadingImg)
      }
      alt="user logo"
      {...rest}
    />
  );
});

export default ProfileImg;
