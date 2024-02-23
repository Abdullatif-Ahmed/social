import { memo } from "react";
import { PostType } from "../types";
import useQueryHandler from "../lib/react query/useQuery";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Posts from "../components/posts";
import useAuthUser from "../hooks/useAuthUser";
import like from "../assets/like.svg";
import EmptyUi from "../components/emptyUi";
import { useErrorBoundary } from "react-error-boundary";
const Liked = memo(function Liked() {
  const { data: user } = useAuthUser();
  const { showBoundary } = useErrorBoundary();
  const { data, isLoading } = useQueryHandler<PostType[] | undefined>(
    "liked",
    async () => {
      try {
        const snapShot = await getDocs(
          query(
            collection(db, "posts"),
            where("likedUsers", "array-contains", user?.id)
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
      cachedId={"liked"}
      posts={data}
      isLoading={isLoading}
      emptyMsg={<EmptyUi message="You didn't liked any post." src={like} />}
    />
  );
});

export default Liked;
