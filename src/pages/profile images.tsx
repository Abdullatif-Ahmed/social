import { useParams } from "react-router-dom";
import Posts from "../components/posts";
import { PostType } from "../types";
import useQueryHandler from "../lib/react query/useQuery";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import noPhotos from "../assets/image post.svg";
import EmptyUi from "../components/emptyUi";
import { useErrorBoundary } from "react-error-boundary";
import { memo } from "react";
const ProfileImages = memo(() => {
  const { id } = useParams();
  const { showBoundary } = useErrorBoundary();

  const { data, isLoading } = useQueryHandler<PostType[] | undefined>(
    ["images", id!],
    async () => {
      try {
        const snapShot = await getDocs(
          query(
            collection(db, "posts"),
            where("userId", "==", id),
            where("type", "==", "image"),
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
    <Posts
      cachedId={["images", id!]}
      posts={data}
      isLoading={isLoading}
      emptyMsg={<EmptyUi message="you don't have any photo." src={noPhotos} />}
    />
  );
});
export default ProfileImages;
