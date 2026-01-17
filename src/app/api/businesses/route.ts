import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { IBusiness } from "@/types"

// Mock database - replace with real database later
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

// GET all businesses
export async function GET() {
  try {
    return NextResponse.json({ data: businesses, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch businesses", success: false }, { status: 500 })
  }
}

// POST create business
export async function POST(request: NextRequest) {
  try {
    const body: IBusiness = await request.json()

    if (!body.business_name || !body.owner_name || !body.phone_number) {
      return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
    }

    const newBusiness: IBusiness = {
      ...body,
      _id: Date.now().toString(),
      created_at: new Date(),
    }

    businesses.push(newBusiness)
    return NextResponse.json({ data: newBusiness, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create business", success: false }, { status: 500 })
  }
}
