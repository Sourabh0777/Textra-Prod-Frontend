import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { IBusinessType } from "@/types"

// Mock database - replace with real database later
const businessTypes: IBusinessType[] = [
  {
    _id: "101",
    name: "Service Center",
    description: "Professional bike service centers",
    is_active: true,
    created_at: new Date(),
  },
  {
    _id: "102",
    name: "Retail Shop",
    description: "Bike retail and spare parts",
    is_active: true,
    created_at: new Date(),
  },
]

// GET all business types
export async function GET() {
  try {
    return NextResponse.json({ data: businessTypes, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch business types", success: false }, { status: 500 })
  }
}

// POST create business type
export async function POST(request: NextRequest) {
  try {
    const body: IBusinessType = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Business type name is required", success: false }, { status: 400 })
    }

    const newBusinessType: IBusinessType = {
      ...body,
      _id: Date.now().toString(),
      created_at: new Date(),
    }

    businessTypes.push(newBusinessType)
    return NextResponse.json({ data: newBusinessType, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create business type", success: false }, { status: 500 })
  }
}
