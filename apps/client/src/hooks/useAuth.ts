import axios from "axios";
import { useQuery } from "react-query";

const fetchAuthState = async () => {
  try {
    return await axios.get("/auth/me");
  } catch (e) {
    if (e instanceof Error)
      return { data: { success: false, message: e.message } };

    return { data: { success: false, message: "Something went wrong" } };
  }
};

const useAuth = () => {
  return useQuery(["auth"], fetchAuthState, {
    retry: false,
    // refetchOnReconnect: true,
    // refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
};

export default useAuth;
