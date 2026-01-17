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

// GET single vehicle
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const vehicle = vehicles.find((v) => v._id === id)

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ data: vehicle, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicle", success: false }, { status: 500 })
  }
}

// PUT update vehicle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: Partial<IVehicle> = await request.json()

    const index = vehicles.findIndex((v) => v._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Vehicle not found", success: false }, { status: 404 })
    }

    vehicles[index] = { ...vehicles[index], ...body }
    return NextResponse.json({ data: vehicles[index], success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vehicle", success: false }, { status: 500 })
  }
}

// DELETE vehicle
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = vehicles.findIndex((v) => v._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Vehicle not found", success: false }, { status: 404 })
    }

    vehicles.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete vehicle", success: false }, { status: 500 })
  }
}
