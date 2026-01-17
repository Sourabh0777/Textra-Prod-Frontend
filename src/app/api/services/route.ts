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

// GET all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("vehicle_id")

    let filtered = services
    if (vehicleId) {
      filtered = services.filter((s) => s.vehicle_id === vehicleId)
    }

    return NextResponse.json({ data: filtered, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services", success: false }, { status: 500 })
  }
}

// POST create service
export async function POST(request: NextRequest) {
  try {
    const body: IService = await request.json()

    if (!body.vehicle_id || !body.last_service_date || !body.service_interval_days) {
      return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
    }

    const newService: IService = {
      ...body,
      _id: Date.now().toString(),
      created_at: new Date(),
    }

    services.push(newService)
    return NextResponse.json({ data: newService, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service", success: false }, { status: 500 })
  }
}
