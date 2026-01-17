import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { IWhatsAppLog } from "@/types"

// Mock database
const logs: IWhatsAppLog[] = [
  {
    _id: "1",
    business_id: "1",
    customer_id: "1",
    phone_number: "+1111111111",
    template_name: "service_reminder",
    message_id: "msg123",
    message_status: "sent",
    sent_at: new Date(),
  },
]

// GET single whatsapp log
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const log = logs.find((l) => l._id === id)

    if (!log) {
      return NextResponse.json({ error: "WhatsApp log not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ data: log, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch whatsapp log", success: false }, { status: 500 })
  }
}

// PUT update whatsapp log
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: Partial<IWhatsAppLog> = await request.json()

    const index = logs.findIndex((l) => l._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "WhatsApp log not found", success: false }, { status: 404 })
    }

    logs[index] = { ...logs[index], ...body }
    return NextResponse.json({ data: logs[index], success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update whatsapp log", success: false }, { status: 500 })
  }
}

// DELETE whatsapp log
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = logs.findIndex((l) => l._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "WhatsApp log not found", success: false }, { status: 404 })
    }

    logs.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete whatsapp log", success: false }, { status: 500 })
  }
}
