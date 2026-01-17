import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Special endpoint for bike service reminders
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: "Bike service reminder endpoint",
      success: true,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bike service reminders", success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      message: "Bike service reminder created",
      data: body,
      success: true,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create bike service reminder", success: false }, { status: 500 })
  }
}
