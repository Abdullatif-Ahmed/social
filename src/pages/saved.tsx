import { memo } from "react";
import { PostType } from "../types";

import useQueryHandler from "../lib/react query/useQuery";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Posts from "../components/posts";
import useAuthUser from "../hooks/useAuthUser";
import save from "../assets/save.svg";
import EmptyUi from "../components/Empty_ui";
import { useErrorBoundary } from "react-error-boundary";
const Saved = memo(function Liked() {
  const { data: user } = useAuthUser();
  const { showBoundary } = useErrorBoundary();
  const { data, isLoading } = useQueryHandler<PostType[] | undefined>(
    "saved",
    async () => {
      try {
        const snapShot = await getDocs(
          query(
            collection(db, "posts"),
            where("savedUsers", "array-contains", user?.id)
          )
        );
        const data = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PostType[];
        return data;
      } catch (error) {
        showBoundary(error);
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Posts
      cachedId={"saved"}
      posts={data}
      isLoading={isLoading}
      emptyMsg={<EmptyUi message="You didn't saved any post." src={save} />}
    />
  );
});

export default Saved;
