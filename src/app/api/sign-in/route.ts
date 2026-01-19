import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { userId, getToken } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  console.log("🚀 ~ GET ~ userId:", userId);

  try {
    const token = await getToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Call the external backend to sync user/session
    // We don't care about the response body for now, just ensuring it's called.
    // If you need to handle errors (e.g. backend down), add logic here.
    await fetch(`${apiUrl}/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    console.error("Error calling backend sign-in:", error);
    // Optionally handle error (e.g. redirect to error page)
    // For now, we proceed to dashboard/home even if sync fails, or you might want to block.
  }

  redirect("/");
}
