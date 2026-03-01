/* eslint-disable @typescript-eslint/no-explicit-any */

export const getClientClerkToken = async () => {
  const clerk = (window as any).Clerk;
  if (!clerk?.session) return null;
  return await clerk.session.getToken();
};
