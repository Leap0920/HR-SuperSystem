// app/hr2/api/admin/reports/route.ts   (or /reports/ if you prefer)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/hr2/admin/Report";
import { verifyToken } from "@/lib/auth";

// This is the correct way in App Router
export async function GET(request: Request) {
  try {
    // Extract token from cookies OR Authorization header
    const token = request.headers
      .get("cookie")
      ?.split(";")
      .find(c => c.trim().startsWith("token="))
      ?.split("=")[1] 
      || request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get recent reports
    const reports = await Report.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Calculate stats
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const thisMonthCount = await Report.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const [total, types, departments] = await Promise.all([
      Report.countDocuments(),
      Report.distinct("type"),
      Report.distinct("department"),
    ]);

    return NextResponse.json({
      reports,
      stats: {
        total,
        thisMonth: thisMonthCount,
        types: types.length,
        typeList: types,
        departments: departments.length,
        departmentList: departments.join(", "),
      },
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}