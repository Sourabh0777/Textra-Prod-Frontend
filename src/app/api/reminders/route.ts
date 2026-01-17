import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { IReminder } from "@/types"

// Mock database
const reminders: IReminder[] = [
  {
    _id: "1",
    service_id: "1",
    scheduled_for: new Date("2024-04-15"),
    status: "pending",
    retry_count: 0,
    created_at: new Date(),
  },
]

// GET all reminders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get("service_id")

    let filtered = reminders
    if (serviceId) {
      filtered = reminders.filter((r) => r.service_id === serviceId)
    }

    return NextResponse.json({ data: filtered, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reminders", success: false }, { status: 500 })
  }
}

// POST create reminder
export async function POST(request: NextRequest) {
  try {
    const body: IReminder = await request.json()

    if (!body.service_id || !body.scheduled_for) {
      return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
    }

    const newReminder: IReminder = {
      ...body,
      _id: Date.now().toString(),
      created_at: new Date(),
    }

    reminders.push(newReminder)
    return NextResponse.json({ data: newReminder, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reminder", success: false }, { status: 500 })
  }
}
