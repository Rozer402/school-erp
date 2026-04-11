import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the HTTP-Only cookie by setting its maxAge to 0
  cookies().set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
