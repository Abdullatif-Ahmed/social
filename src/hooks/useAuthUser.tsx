import useQueryHandler from "../lib/react query/useQuery";
import getAuthUserData from "../functions/getUserData";
import { USER } from "../types";

const useAuthUser = () => {
  return useQueryHandler(
    "authUser",
    async () => {
      try {
        const userData = await getAuthUserData();
        return userData as USER;
      } catch {
        console.log("error");
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};

export default useAuthUser;
