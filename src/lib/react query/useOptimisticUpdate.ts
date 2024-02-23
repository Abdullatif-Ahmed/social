import { MutateFunction, useMutation, useQueryClient } from "react-query";
import {
  AddType,
  CommentType,
  DeleteType,
  EditType,
  PostType,
  USER,
  UserEditType,
} from "../../types";
import { toast } from "react-toastify";

const useOptimisticUpdate = <T extends CommentType | PostType | USER>(
  fn: MutateFunction,
  actions: (AddType | EditType | DeleteType | UserEditType)[],
  msgs?: {
    successMsg?: string;
    errorMsg?: string;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation(fn, {
    onMutate: async () => {
      const prevsData = await Promise.all(
        actions.map((action) =>
          queryClient.getQueryData<T[] | T>(action.cachedId)
        )
      );

      actions.forEach((action) => {
        queryClient.cancelQueries(action.cachedId);
        queryClient.setQueryData<T[] | T | undefined>(
          action.cachedId,
          (oldQData) => {
            if (!oldQData) return oldQData;
            if (Array.isArray(oldQData)) {
              switch (action.type) {
                case "ADD":
                  return [action.data, ...oldQData] as T[];
                case "DELETE":
                  return oldQData.filter((l) => l.id !== action.id) as T[];

                case "EDIT":
                  return oldQData.map((l) =>
                    l.id === action.id ? action.data : l
                  ) as T[];
                default:
                  return oldQData;
              }
            } else if (
              typeof oldQData === "object" &&
              action.type === "USEREDIT"
            ) {
              return action.data as T;
            }
            return oldQData;
          }
        );
      });
      return () => {
        actions.forEach((action, index) => {
          queryClient.setQueryData<T[] | T | undefined>(
            action.cachedId,
            prevsData[index]
          );
        });
      };
    },
    onSuccess: () => {
      if (msgs?.successMsg) {
        toast(msgs.successMsg, {
          type: "success",
        });
      }
    },
    onError: (_err, _var, context) => {
      if (context) context();
      if (msgs?.errorMsg) {
        toast(msgs.errorMsg, {
          type: "error",
        });
      }
    },

    onSettled: () => {
      actions.forEach((action) => {
        queryClient.invalidateQueries(action.cachedId);
      });
    },
  });
};

export default useOptimisticUpdate;
