import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAppDispatch } from '@/lib/hooks';
import { setUser } from '@/lib/slices/userSlice';
import { useFetchLoginUserQuery } from '@/lib/api/endpoints/userApi';

export function useFetchUserData() {
  const { user: clerkUser, isLoaded } = useUser();
  const dispatch = useAppDispatch();

  // Use RTK Query hook
  // skip the query if clerk is not loaded or user not signed in
  const { data: apiUser, isLoading, isError } = useFetchLoginUserQuery(undefined, { skip: !isLoaded || !clerkUser });
  console.log('🚀 ~ useFetchUserData ~ apiUser:', apiUser);

  // Sync to Redux slice (optional, but good for backward compat if other parts use the slice)
  useEffect(() => {
    if (apiUser) {
      dispatch(setUser(apiUser));
    }
  }, [apiUser, dispatch]);

  return { user: apiUser || null, isLoading };
}
