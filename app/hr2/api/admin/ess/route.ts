// app/hr2/api/ess/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ESSRequest from "@/models/hr2/admin/ESSRequest";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1] || request.cookies.get("token")?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const requests = await ESSRequest.find({})
      .populate("employee", "name role department")
      .sort({ createdAt: -1 })
      .lean();

    const stats = {
      total: await ESSRequest.countDocuments(),
      pending: await ESSRequest.countDocuments({ status: "Pending" }),
      approved: await ESSRequest.countDocuments({ status: "Approved" }),
    };

    return NextResponse.json({ requests, stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}