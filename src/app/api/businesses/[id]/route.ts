import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { IBusiness } from "@/types"

// Mock database
const businesses: IBusiness[] = [
  {
    _id: "1",
    business_type_id: "101",
    business_name: "Speed Bikes Service",
    owner_name: "John Doe",
    phone_number: "+1234567890",
    address: "123 Main St",
    city: "New York",
    is_active: true,
    waba_id: "wa123",
    phone_number_id: "ph123",
    created_at: new Date(),
  },
]

// GET single business
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const business = businesses.find((b) => b._id === id)

    if (!business) {
      return NextResponse.json({ error: "Business not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ data: business, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch business", success: false }, { status: 500 })
  }
}

// PUT update business
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: Partial<IBusiness> = await request.json()

    const index = businesses.findIndex((b) => b._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Business not found", success: false }, { status: 404 })
    }

    businesses[index] = { ...businesses[index], ...body }
    return NextResponse.json({ data: businesses[index], success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update business", success: false }, { status: 500 })
  }
}

// DELETE business
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = businesses.findIndex((b) => b._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Business not found", success: false }, { status: 404 })
    }

    businesses.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete business", success: false }, { status: 500 })
  }
}
