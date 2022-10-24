import { useQuery } from "@tanstack/react-query";
import * as WowPI from "./owen-wilson-api";

const baseQueryId = "owen-wilson";
const queryIds = {
  useGetOrdered: (index) => [baseQueryId, "ordered", index],
};

export const useGetOrdered = (index) =>
  useQuery(queryIds.useGetOrdered(index), () => WowPI.getOrdered({ index }));
