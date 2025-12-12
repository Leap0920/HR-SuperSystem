// app/hr2/api/employee/training/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Training from "@/models/hr2/employee/Training";
import { verifyToken } from "@/lib/auth";
import { jwtVerify } from "jose";

async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return null;
    
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch {
    return null;
  }
}

// GET - Get employee's training records
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const trainings = await Training.find({ employee: user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate stats
    const total = trainings.length;
    const completed = trainings.filter(t => t.status === "Completed").length;
    const inProgress = trainings.filter(t => t.status === "In Progress").length;
    const enrolled = trainings.filter(t => t.status === "Enrolled").length;

    return NextResponse.json({
      trainings,
      stats: {
        total,
        completed,
        inProgress,
        enrolled,
      }
    });
  } catch (error) {
    console.error("Training fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch trainings" }, { status: 500 });
  }
}

// POST - Enroll in training
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, startDate, endDate, instructor, location } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectDB();

    const training = await Training.create({
      employee: user.id,
      title,
      type: type || "Technical",
      status: "Enrolled",
      startDate,
      endDate,
      instructor,
      location,
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error("Training create error:", error);
    return NextResponse.json({ error: "Failed to create training" }, { status: 500 });
  }
}
