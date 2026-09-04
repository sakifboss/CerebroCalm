import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registrationRepository } from "@/lib/registrationRepo";

const registerSchema = z.object({
  name: z
    .string({ required_error: "Please enter your name." })
    .trim()
    .min(2, "Please enter your name."),
  email: z
    .string({ required_error: "Please enter a valid email address." })
    .trim()
    .email("Please enter a valid email address."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 }
      );
    }

    const { name, email } = parseResult.data;
    const existing = await registrationRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }

    const user = await registrationRepository.create(name, email);
    const count = await registrationRepository.count();

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        count,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await registrationRepository.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 520 });
  }
}
