import axios from "axios";
import { useQuery } from "react-query";
import { queryClient } from "../main.tsx";

const fetchAuthState = async () => {
  try {
    return await axios.get("/auth/me");
  } catch (e) {
    throw new Error("Not authenticated");
  }
};

const useAuth = () => {
  return useQuery(["auth"], fetchAuthState, {
    retry: false,
    staleTime: 60 * 1000,
    onError: (error) => {
      if (error instanceof Error)
        queryClient.setQueryData("auth", {
          data: { success: false, message: error.message },
        });
    },
  });
};

export default useAuth;
