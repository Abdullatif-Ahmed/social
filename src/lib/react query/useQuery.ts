import { QueryKey, QueryObserverOptions, useQuery } from "react-query";

const useQueryHandler = <T>(
  id: QueryKey,
  fun: () => Promise<T>,
  settings?: QueryObserverOptions<T, Error>
) => {
  return useQuery<T, Error>(id, fun, settings);
};
export default useQueryHandler;
