import { useAuth as useAuthFromContext } from "../context/authcontext";

export function useAuth() {
  return useAuthFromContext();
}


