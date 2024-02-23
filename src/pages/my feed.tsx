import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import useQueryHandler from "../lib/react query/useQuery";
import { db } from "../firebase";
import { PostType } from "../types";
import { memo } from "react";
import Posts from "../components/posts";
import useAuthUser from "../hooks/useAuthUser";
import followings from "../assets/followings.svg";
import EmptyUi from "../components/Empty_ui";
import { useErrorBoundary } from "react-error-boundary";
const MyFeed = memo(function MyFeed() {
  const { data: user } = useAuthUser();
  const { showBoundary } = useErrorBoundary();
  const { data, isLoading } = useQueryHandler<PostType[] | undefined>(
    ["myFeed", JSON.stringify(user?.followings)],
    async () => {
      try {
        console.log(user);

        const snapShot = await getDocs(
          query(
            collection(db, "posts"),
            where(
              "userId",
              "in",
              user?.followings.length ? user.followings : [""]
            ),
            orderBy("timestamp", "desc")
          )
        );
        const posts = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return posts as PostType[];
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
      cachedId={["myFeed", JSON.stringify(user?.followings)]}
      posts={data}
      isLoading={isLoading}
      emptyMsg={
        <EmptyUi message="You didn't follow anyone." src={followings} />
      }
    />
  );
});
export default MyFeed;
