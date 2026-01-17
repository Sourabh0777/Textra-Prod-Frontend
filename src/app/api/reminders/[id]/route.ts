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

// GET single reminder
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const reminder = reminders.find((r) => r._id === id)

    if (!reminder) {
      return NextResponse.json({ error: "Reminder not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ data: reminder, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reminder", success: false }, { status: 500 })
  }
}

// PUT update reminder
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: Partial<IReminder> = await request.json()

    const index = reminders.findIndex((r) => r._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Reminder not found", success: false }, { status: 404 })
    }

    reminders[index] = { ...reminders[index], ...body }
    return NextResponse.json({ data: reminders[index], success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update reminder", success: false }, { status: 500 })
  }
}

// DELETE reminder
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = reminders.findIndex((r) => r._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Reminder not found", success: false }, { status: 404 })
    }

    reminders.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete reminder", success: false }, { status: 500 })
  }
}
