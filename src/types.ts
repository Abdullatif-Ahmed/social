import { FieldValue } from "firebase/firestore";
import { QueryKey } from "react-query";
export type USER = {
  displayName: string;
  photoURL: string;
  gender: string;
  birthday: string;
  profileBg: string;
  followers: number;
  followings: string[];
  id: string;
  bio: string;
  themeMode: "light" | "dark" | "system";
};
export type PostTypeCases = "link" | "content" | "image";
export type PostType = {
  id: string;
  content: string;
  timestamp: FieldValue;
  imgUrl?: string;
  link?: string;
  likedUsers: string[];
  userId: string;
  type: PostTypeCases;
  savedUsers: string[];
  commentsLength: number;
};
export type CommentType = {
  userId: string;
  content: string;
  timestamp: FieldValue;
  id: string;
};

export type AddType = {
  type: "ADD";
  cachedId: QueryKey;
  data: PostType | CommentType;
};
export type EditType = {
  type: "EDIT";
  cachedId: QueryKey;
  data: PostType | CommentType;
  id: string;
};
export type DeleteType = {
  type: "DELETE";
  cachedId: QueryKey;
  id: string;
};

export type UserEditType = {
  cachedId: QueryKey;
  data: USER;
  type: "USEREDIT";
};
