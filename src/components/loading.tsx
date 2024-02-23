import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="h-screen flex items-center justify-center ">
      <BounceLoader />
    </div>
  );
};

export default Loading;
