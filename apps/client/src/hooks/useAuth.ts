import axios from "axios";
import { useQuery } from "react-query";

const fetchAuthState = async () => axios.get("/auth/me");

const useAuth = () => {
  return useQuery(["auth"], fetchAuthState, {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
    refetchInterval: 60 * 1000,
  });
};

export default useAuth;
