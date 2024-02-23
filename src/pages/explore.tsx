import { collection, getDocs, orderBy, query } from "firebase/firestore";
import useQueryHandler from "../lib/react query/useQuery";
//import { useAppSelector } from "../lib/redux/hooks";
//import { USER } from "../lib/redux/reducers/user reducer";
import { db } from "../firebase";

import { PostType } from "../types";
import { memo } from "react";
import CreatePost from "../components/Create_post";
import Posts from "../components/posts";
import { useErrorBoundary } from "react-error-boundary";

const Explore = memo(function Explore() {
  const { showBoundary } = useErrorBoundary();

  const { data, isLoading } = useQueryHandler<PostType[] | undefined>(
    "explore",
    async () => {
      try {
        const snapShot = await getDocs(
          query(collection(db, "posts"), orderBy("timestamp", "desc"))
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
    <>
      <section className="sm:px-4">
        <CreatePost cachedId="explore" />
      </section>
      <Posts
        cachedId={"explore"}
        posts={data}
        isLoading={isLoading}
        emptyMsg="there's no posts to show"
      />
    </>
  );
});
export default Explore;
