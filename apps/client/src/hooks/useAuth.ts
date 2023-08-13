import axios from "axios";
import { useQuery } from "react-query";

const fetchAuthState = async () => {
  try {
    return axios.get("/auth/me");
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message);
  }
};

const useAuth = () => {
  return useQuery(["auth"], fetchAuthState, {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
    refetchInterval: 60 * 1000,
  });
};

export default useAuth;
