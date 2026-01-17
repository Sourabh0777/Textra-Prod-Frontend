import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { IService } from "@/types"

// Mock database
const services: IService[] = [
  {
    _id: "1",
    vehicle_id: "1",
    last_service_date: new Date("2024-01-15"),
    next_service_date: new Date("2024-04-15"),
    service_interval_days: 90,
    notes: "Oil change and filter replacement",
    created_at: new Date(),
  },
]

// GET single service
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const service = services.find((s) => s._id === id)

    if (!service) {
      return NextResponse.json({ error: "Service not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ data: service, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service", success: false }, { status: 500 })
  }
}

// PUT update service
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: Partial<IService> = await request.json()

    const index = services.findIndex((s) => s._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Service not found", success: false }, { status: 404 })
    }

    services[index] = { ...services[index], ...body }
    return NextResponse.json({ data: services[index], success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service", success: false }, { status: 500 })
  }
}

// DELETE service
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = services.findIndex((s) => s._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Service not found", success: false }, { status: 404 })
    }

    services.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service", success: false }, { status: 500 })
  }
}
