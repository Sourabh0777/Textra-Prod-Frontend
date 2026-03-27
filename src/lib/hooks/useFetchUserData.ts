import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setUser } from '@/lib/slices/userSlice';
import { useFetchLoginUserQuery } from '@/lib/api/endpoints/userApi';

export function useFetchUserData() {
  const { user: clerkUser, isLoaded } = useUser();
  const dispatch = useAppDispatch();

  const { data: apiUser, isLoading, isError } = useFetchLoginUserQuery(undefined, { skip: !isLoaded || !clerkUser });

  // Sync to Redux slice (optional, but good for backward compat if other parts use the slice)
  useEffect(() => {
    if (apiUser) {
      dispatch(setUser(apiUser));
    }
  }, [apiUser, dispatch]);

  const isActuallyLoading = !isLoaded || (clerkUser && isLoading);

  return { user: apiUser || null, isLoading: isActuallyLoading };
}

export function useCurrentUser() {
  const { user, loading, error } = useAppSelector((state) => state.user);
  return { user, isLoading: loading, error };
}
