import { ReactNode, memo } from "react";
import { PostType } from "../types";
import Post from "./Post";
import { BeatLoader } from "react-spinners";
import { QueryKey } from "react-query";
type Props = {
  isLoading: boolean;
  posts: PostType[] | undefined;
  cachedId: QueryKey;
  emptyMsg: ReactNode;
};
const Posts = memo(function Posts(props: Props) {
  const { isLoading, posts, cachedId, emptyMsg } = props;

  return (
    <section className="px-4">
      {isLoading ? (
        <div className="text-center">
          <BeatLoader />
        </div>
      ) : posts?.length ? (
        <div className="space-y-4">
          {posts.map((post: PostType) => (
            <Post key={post.id} data={post} cachedId={cachedId} />
          ))}
        </div>
      ) : (
        <div>{emptyMsg}</div>
      )}
    </section>
  );
});

export default Posts;
