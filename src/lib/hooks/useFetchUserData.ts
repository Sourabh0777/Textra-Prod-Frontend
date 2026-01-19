import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser, setLoading, setError } from "@/lib/slices/userSlice";

export function useFetchUserData() {
  const { user: clerkUser, isLoaded } = useUser();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user.user);
  const isLoading = useAppSelector((state) => state.user.loading);

  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      return;
    }

    // If user already exists in Redux, don't fetch again
    if (reduxUser) {
      return;
    }

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));

        const response = await fetch(`/api/users?clerkId=${clerkUser.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const userData = await response.json();
        dispatch(setUser(userData));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        dispatch(setError(errorMessage));
        console.error("Error fetching user:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [isLoaded, clerkUser, reduxUser, dispatch]);

  return { user: reduxUser, isLoading };
}
