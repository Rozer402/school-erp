import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  // Define mock users logic map
  const mockUsers: Record<string, { role: "admin" | "teacher" | "student"; name: string }> = {
    admin: { role: "admin", name: "Arjun (Admin)" },
    teacher: { role: "teacher", name: "Prof. Sharma (Teacher)" },
    student: { role: "student", name: "Rajat (Student)" },
  };

  const matchedUser = mockUsers[username];

  if (matchedUser && password === "password") {
    // 1. Generate a mock JWT for API security (Unique per role for mock backend resolution)
    const token = `mock-jwt-token-${matchedUser.role}`;

    // 2. Set HTTP-Only Cookie for API auth
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true, message: `Logged in as ${matchedUser.role}` });
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
