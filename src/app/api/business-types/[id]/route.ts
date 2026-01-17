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
]

// GET single business type
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const businessType = businessTypes.find((bt) => bt._id === id)

    if (!businessType) {
      return NextResponse.json({ error: "Business type not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ data: businessType, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch business type", success: false }, { status: 500 })
  }
}

// PUT update business type
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: Partial<IBusinessType> = await request.json()

    const index = businessTypes.findIndex((bt) => bt._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Business type not found", success: false }, { status: 404 })
    }

    businessTypes[index] = { ...businessTypes[index], ...body }
    return NextResponse.json({ data: businessTypes[index], success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update business type", success: false }, { status: 500 })
  }
}

// DELETE business type
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = businessTypes.findIndex((bt) => bt._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Business type not found", success: false }, { status: 404 })
    }

    businessTypes.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete business type", success: false }, { status: 500 })
  }
}
