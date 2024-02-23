import { doc, updateDoc } from "firebase/firestore";
import useOptimisticUpdate from "../lib/react query/useOptimisticUpdate";
import { USER } from "../types";
import { auth, db } from "../firebase";
import useAuthUser from "./useAuthUser";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

const useEditAuthUser = (updatedData: Partial<USER>) => {
  const { data: user } = useAuthUser();

  return useOptimisticUpdate<USER>(async () => {
    await toast.promise(
      Promise.all([
        updateDoc(doc(db, "users", user?.id || ""), {
          ...updatedData,
        }),
        updateProfile(auth.currentUser!, {
          displayName: updatedData.displayName || user?.displayName,
          photoURL: updatedData.photoURL || user?.photoURL,
        }),
      ]),
      {
        pending: "processing...",
        success: "changes successfully saved",
        error: "faild to save the changes",
      }
    );
  }, [
    {
      type: "USEREDIT",
      cachedId: "authUser",
      data: {
        ...user!,
        ...updatedData,
      },
    },
  ]);
};

export default useEditAuthUser;
