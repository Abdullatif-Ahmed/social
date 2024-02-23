import { collection, getDocs, orderBy, query } from "firebase/firestore";
import useQueryHandler from "../lib/react query/useQuery";
import { CommentType, PostType } from "../types";
import { BeatLoader } from "react-spinners";
import CommentItem from "./comment item";
import { db } from "../firebase";
import { QueryKey } from "react-query";
import { memo } from "react";
type CommentsType = {
  postData: PostType;
  openComments: boolean;
  postsCachedId: QueryKey;
};
const Comments = memo(
  ({ postData, openComments, postsCachedId }: CommentsType) => {
    const { data: comments, isLoading } = useQueryHandler(
      ["comments", postData.id],
      async () => {
        const snapShot = await getDocs(
          query(
            collection(db, "posts", postData.id, "comments"),
            orderBy("timestamp", "desc")
          )
        );
        const comments = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CommentType[];
        return comments;
      },
      {
        refetchOnWindowFocus: false,
        enabled: openComments,
      }
    );
    return (
      <div className="pt-2 animate-fade-in border-t border-light-borderColor/40 dark:border-dark-borderColor">
        {isLoading ? (
          <BeatLoader />
        ) : comments?.length === 0 ? (
          <p className="text-center text-sm text-light-textColor-secondary dark:text-dark-textColor-secondary">
            there is no comments for this post
          </p>
        ) : (
          <ul className="space-y-2">
            {comments?.map((com) => (
              <CommentItem
                key={com.id}
                data={com}
                postData={postData}
                postsCachedId={postsCachedId}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }
);

export default Comments;
