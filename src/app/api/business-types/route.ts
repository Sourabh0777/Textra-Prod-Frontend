import { env } from "@/env";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/business-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch business types: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching business types:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch business types" },
      { status: 500 }
    );
  }
}
