import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/models/Applications";
import Job from "@/models/Job";

export async function GET() {
    try {
        await connectDB();

        // Fetch all hired applicants for onboarding
        const hiredApplicants = await Application.find({ status: "hired" })
            .sort({ updatedAt: -1 })
            .lean();

        // Get all job IDs and fetch job details for department info
        const jobIds = [...new Set(hiredApplicants.map((app: any) => app.jobId?.toString()).filter(Boolean))];
        const jobs = await Job.find({ _id: { $in: jobIds } }).lean();

        const jobMap = new Map<string, any>();
        jobs.forEach((job: any) => {
            jobMap.set(job._id.toString(), job);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = hiredApplicants.map((app: any) => {
            const job = jobMap.get(app.jobId?.toString() || "");
            return {
                _id: app._id?.toString(),
                fullName: app.fullName || "Unknown",
                email: app.email || "",
                phone: app.phone || "",
                jobTitle: app.jobTitle || job?.title || "Unknown Position",
                department: app.department || job?.department || "",
                hiredDate: app.updatedAt,
                onboardingStatus: app.onboardingStatus || "pending",
            };
        });

        return NextResponse.json({ applicants: formatted }, { status: 200 });
    } catch (error) {
        console.error("Error loading hired applicants:", error);
        return NextResponse.json(
            { error: "Failed to load data" },
            { status: 500 }
        );
    }
}
