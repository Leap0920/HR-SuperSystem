// app/api/evaluation/questions/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Question";

export async function GET() {
  try {
    await connectDB();
    
    const questions = await Question.find({ isActive: true });
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}