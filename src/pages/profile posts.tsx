import { useParams } from "react-router-dom";
import useQueryHandler from "../lib/react query/useQuery";
import { PostType } from "../types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Posts from "../components/posts";
import CreatePost from "../components/create post";
import useAuthUser from "../hooks/useAuthUser";
import noPosts from "../assets/post.svg";
import EmptyUi from "../components/emptyUi";
import { useErrorBoundary } from "react-error-boundary";
import { memo } from "react";
const ProfilePosts = memo(() => {
  const { id } = useParams();
  const { data: user } = useAuthUser();
  const { showBoundary } = useErrorBoundary();
  const { data, isLoading } = useQueryHandler<PostType[] | undefined>(
    ["posts", id!],
    async () => {
      try {
        const snapShot = await getDocs(
          query(
            collection(db, "posts"),
            where("userId", "==", id),
            orderBy("timestamp", "desc")
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
    <>
      {user?.id === id && (
        <div className="px-4">
          <CreatePost cachedId={["posts", id!]} />
        </div>
      )}
      <Posts
        cachedId={["posts", id!]}
        posts={data}
        isLoading={isLoading}
        emptyMsg={<EmptyUi message="you don't have any post." src={noPosts} />}
      />
    </>
  );
});

export default ProfilePosts;
