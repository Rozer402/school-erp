import { NextResponse } from "next/server";
import { feesData, libraryData, leaveData, attendanceTrends, subjectAttendance } from "@/data/mock";

// Dynamic route handler that returns mock data based on URL module,
// so you can test your `apiFetch` and `useQuery` integrations locally.
export async function GET(
  req: Request,
  { params }: { params: { module: string } }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // Derive mock role from our simplified mock token
  const role = token.replace("mock-jwt-token-", "");

  // 403 Forbidden checks!
  const teacherBlocked = ["fees", "library", "leave"];
  if (role === "teacher" && teacherBlocked.includes(params.module)) {
    return NextResponse.json({ error: "Forbidden: Teacher access denied" }, { status: 403 });
  }

  // Determine what data to send back
  switch (params.module) {
    case "fees":
      return NextResponse.json(feesData);
    case "library":
      return NextResponse.json(libraryData);
    case "leave":
      return NextResponse.json(leaveData);
    case "attendanceTrends":
      return NextResponse.json(attendanceTrends);
    case "subjectAttendance":
      return NextResponse.json(subjectAttendance);
    default:
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }
}
