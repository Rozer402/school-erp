import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Extract token from HTTP headers natively as a mock backend would receive it
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  // Simulate strict backend database decoding
  if (token === "mock-jwt-token-admin") {
    return NextResponse.json({ user: { role: "admin", name: "Arjun (Admin)" } });
  }
  if (token === "mock-jwt-token-teacher") {
    return NextResponse.json({ user: { role: "teacher", name: "Prof. Sharma (Teacher)" } });
  }
  if (token === "mock-jwt-token-student") {
    return NextResponse.json({ user: { role: "student", name: "Rajat (Student)" } });
  }

  // If token is malformed or invalid
  return NextResponse.json({ error: "Invalid token" }, { status: 401 });
}
