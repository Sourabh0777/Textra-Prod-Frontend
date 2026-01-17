import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { IVehicle } from "@/types"

// Mock database
const vehicles: IVehicle[] = [
  {
    _id: "1",
    customer_id: "1",
    vehicle_type: "Motorcycle",
    brand: "Honda",
    vehicle_model: "CB500",
    registration_number: "MH01AB1234",
    year: 2022,
    created_at: new Date(),
  },
]

// GET all vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customer_id")

    let filtered = vehicles
    if (customerId) {
      filtered = vehicles.filter((v) => v.customer_id === customerId)
    }

    return NextResponse.json({ data: filtered, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles", success: false }, { status: 500 })
  }
}

// POST create vehicle
export async function POST(request: NextRequest) {
  try {
    const body: IVehicle = await request.json()

    if (!body.customer_id || !body.vehicle_type || !body.registration_number) {
      return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
    }

    const newVehicle: IVehicle = {
      ...body,
      _id: Date.now().toString(),
      created_at: new Date(),
    }

    vehicles.push(newVehicle)
    return NextResponse.json({ data: newVehicle, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vehicle", success: false }, { status: 500 })
  }
}
