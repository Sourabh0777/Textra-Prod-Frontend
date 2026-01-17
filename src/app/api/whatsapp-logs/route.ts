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

// GET all whatsapp logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("business_id")

    let filtered = logs
    if (businessId) {
      filtered = logs.filter((l) => l.business_id === businessId)
    }

    return NextResponse.json({ data: filtered, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch whatsapp logs", success: false }, { status: 500 })
  }
}

// POST create whatsapp log
export async function POST(request: NextRequest) {
  try {
    const body: IWhatsAppLog = await request.json()

    if (!body.business_id || !body.customer_id || !body.phone_number) {
      return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
    }

    const newLog: IWhatsAppLog = {
      ...body,
      _id: Date.now().toString(),
      sent_at: new Date(),
    }

    logs.push(newLog)
    return NextResponse.json({ data: newLog, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create whatsapp log", success: false }, { status: 500 })
  }
}
