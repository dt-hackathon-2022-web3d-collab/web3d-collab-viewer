import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePersistentContext(key) {
  const queryClient = useQueryClient();

  const { data } = useQuery([key], () => localStorage.getItem(key));

  const { mutateAsync: setValue } = useMutation(
    (value) => localStorage.setItem(key, value),
    {
      onMutate: (mutatedData) => {
        const current = data;
        queryClient.setQueryData([key], mutatedData);
        return current;
      },
      onError: (_, __, rollback) => {
        queryClient.setQueryData([key], rollback);
      },
    }
  );

  return [data, setValue];
}
