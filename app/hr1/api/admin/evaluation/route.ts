"use server";

import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/models/Applications";
import mongoose from "mongoose";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection not established");

    const grouped = await Application.aggregate([
      {
        $group: {
          _id: "$jobId",
          applicants: { $sum: 1 },
        },
      },
    ]);

    const jobsCollection = db.collection("jobs");
    const allJobs = await jobsCollection.find({}).toArray();

    const applicantCountMap = new Map<string, number>();
    grouped.forEach((g) => {
      if (g._id) {
        applicantCountMap.set(g._id.toString(), g.applicants || 0);
      }
    });

    const data = allJobs.map((job: any) => ({
      _id: job._id?.toString(),
      title: job.title || "Untitled",
      department: job.department || "",
      employmentType: job.employmentType || "",
      status: job.status || "Inactive",
      applicants: applicantCountMap.get(job._id?.toString() || "") || 0,
    }));

    data.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /admin/evaluation error:", err);
    return NextResponse.json({ error: "Failed to load evaluation summary" }, { status: 500 });
  }
}

