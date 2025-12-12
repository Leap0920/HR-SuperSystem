// app/hr2/api/admin/training/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TrainingProgram from "@/models/hr2/admin/TrainingProgram";
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
  } catch { return null; }
}

// GET - Get all training programs
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const trainings = await TrainingProgram.find({})
      .populate("registrations", "fullName email")
      .populate("attendees", "fullName email")
      .sort({ date: 1 })
      .lean();

    const stats = {
      total: trainings.length,
      upcoming: trainings.filter(t => t.status === "Upcoming").length,
      completed: trainings.filter(t => t.status === "Completed").length,
      totalRegistrations: trainings.reduce((sum, t) => sum + (t.registrations?.length || 0), 0),
      totalAttendance: trainings.reduce((sum, t) => sum + (t.attendees?.length || 0), 0),
      avgRating: trainings.filter(t => t.rating).length > 0
        ? (trainings.filter(t => t.rating).reduce((sum, t) => sum + (t.rating || 0), 0) / trainings.filter(t => t.rating).length).toFixed(1)
        : 0,
    };

    return NextResponse.json({ trainings, stats });
  } catch (error) {
    console.error("Training fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch trainings" }, { status: 500 });
  }
}

// POST - Create new training program
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "hr2admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, type, description, date, time, location, maxParticipants } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    await connectDB();

    const training = await TrainingProgram.create({
      title,
      type: type || "Workshop",
      description,
      date: new Date(date),
      time,
      location,
      maxParticipants: maxParticipants || 50,
      status: "Upcoming",
      createdBy: user.id,
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error("Training create error:", error);
    return NextResponse.json({ error: "Failed to create training" }, { status: 500 });
  }
}

// PUT - Update training program
export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "hr2admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Training ID required" }, { status: 400 });
    }

    await connectDB();
    const training = await TrainingProgram.findByIdAndUpdate(id, updateData, { new: true });

    if (!training) {
      return NextResponse.json({ error: "Training not found" }, { status: 404 });
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error("Training update error:", error);
    return NextResponse.json({ error: "Failed to update training" }, { status: 500 });
  }
}

// DELETE - Delete training program
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "hr2admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Training ID required" }, { status: 400 });
    }

    await connectDB();
    const training = await TrainingProgram.findByIdAndDelete(id);

    if (!training) {
      return NextResponse.json({ error: "Training not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Training deleted" });
  } catch (error) {
    console.error("Training delete error:", error);
    return NextResponse.json({ error: "Failed to delete training" }, { status: 500 });
  }
}
