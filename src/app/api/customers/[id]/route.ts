import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { ICustomer } from "@/types"

// Mock database
const customers: ICustomer[] = [
  {
    _id: "1",
    business_id: "1",
    name: "Alex Johnson",
    phone_number: "+1111111111",
    email: "alex@example.com",
    address: "789 Elm St",
    is_active: true,
    created_at: new Date(),
  },
]

// GET single customer
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const customer = customers.find((c) => c._id === id)

    if (!customer) {
      return NextResponse.json({ error: "Customer not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ data: customer, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer", success: false }, { status: 500 })
  }
}

// PUT update customer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: Partial<ICustomer> = await request.json()

    const index = customers.findIndex((c) => c._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Customer not found", success: false }, { status: 404 })
    }

    customers[index] = { ...customers[index], ...body }
    return NextResponse.json({ data: customers[index], success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update customer", success: false }, { status: 500 })
  }
}

// DELETE customer
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = customers.findIndex((c) => c._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Customer not found", success: false }, { status: 404 })
    }

    customers.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete customer", success: false }, { status: 500 })
  }
}
