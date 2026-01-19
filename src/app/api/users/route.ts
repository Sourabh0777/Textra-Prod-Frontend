import { env } from "@/env";
import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const queryClerkId = searchParams.get("clerkId");

    // Determine which parameter to use
    const identifier = userId || queryClerkId || clerkId;

    if (!identifier) {
      return Response.json({ error: "Missing user identifier" }, { status: 400 });
    }

    const apiUrl = env.NEXT_PUBLIC_API_URL;

    // Call your backend API to get user data
    const response = await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": identifier,
      },
    });

    if (!response.ok) {
      console.error(`Backend user fetch failed with status: ${response.status}`);
      return Response.json(
        { error: "Failed to fetch user from backend" },
        { status: response.status }
      );
    }

    const user = await response.json();
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
