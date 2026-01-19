import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn forceRedirectUrl="/api/sign-in" />;
}
