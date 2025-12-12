// app/hr2/api/competency/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Competency from "@/models/hr2/admin/Competency";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1] || request.cookies.get("token")?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const evaluations = await Competency.find({})
      .populate("employee", "name department role")
      .sort({ score: -1 })
      .lean();

    const totalEmployees = evaluations.length;
    const competent = evaluations.filter(e => e.score >= 80).length;
    const needsImprovement = evaluations.filter(e => e.score < 70).length;
    const avgScore = evaluations.reduce((a, b) => a + b.score, 0) / totalEmployees || 0;

    return NextResponse.json({
      evaluations,
      stats: {
        totalEmployees,
        competent,
        needsImprovement,
        averageScore: Math.round(avgScore),
        pendingEvaluation: evaluations.filter(e => !e.evaluatedAt).length,
      },
      topPerformers: evaluations.slice(0, 3),
      lowPerformers: evaluations.filter(e => e.score < 70),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch competency data" }, { status: 500 });
  }
}