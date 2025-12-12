// app/api/evaluation/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Question";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    // Build query filter
    const filter: any = { isActive: true };
    if (jobId && Types.ObjectId.isValid(jobId)) {
      filter.jobId = new Types.ObjectId(jobId);
    }

    const questions = await Question.find(filter);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}