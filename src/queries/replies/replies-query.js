import { useMutation } from "@tanstack/react-query";
import { createReply } from "./replies-api";

export const useCreateReply = () => useMutation(createReply);
