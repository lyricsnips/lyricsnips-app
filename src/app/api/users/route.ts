import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        // Don't include password_hash or email for security
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Hash the password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password_hash,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        // Don't include password_hash or email in response
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle unique constraint violations
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
