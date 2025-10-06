import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, zipCode } = await request.json()

    // Validate input
    if (!email || !zipCode) {
      return NextResponse.json({ error: "Email and ZIP code are required" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Validate the email format
    // 2. Store the email and ZIP code in a database
    // 3. Maybe send a confirmation email

    // For now, we'll just simulate a successful submission
    console.log("Waitlist submission:", { email, zipCode })

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Successfully added to waitlist",
    })
  } catch (error) {
    console.error("Error processing waitlist submission:", error)
    return NextResponse.json({ error: "Failed to process waitlist submission" }, { status: 500 })
  }
}
