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

// GET all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("business_id")

    let filtered = customers
    if (businessId) {
      filtered = customers.filter((c) => c.business_id === businessId)
    }

    return NextResponse.json({ data: filtered, success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers", success: false }, { status: 500 })
  }
}

// POST create customer
export async function POST(request: NextRequest) {
  try {
    const body: ICustomer = await request.json()

    if (!body.business_id || !body.name || !body.phone_number) {
      return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
    }

    const newCustomer: ICustomer = {
      ...body,
      _id: Date.now().toString(),
      created_at: new Date(),
    }

    customers.push(newCustomer)
    return NextResponse.json({ data: newCustomer, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer", success: false }, { status: 500 })
  }
}
