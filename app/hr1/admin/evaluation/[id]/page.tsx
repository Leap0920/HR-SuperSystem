"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Download,
    Eye,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Mail,
    Calendar,
    Loader2,
    AlertCircle,
    CheckCheck,
} from "lucide-react";

type Document = {
    fileId: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
};

type Application = {
    _id: string;
    userId: string;
    jobId: string;
    fullName: string;
    email: string;
    status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
    appliedAt: string;
    resume?: Document;
    applicationLetter?: Document;
    supportingDocs?: Document[];
    validId?: Document;
    portfolio?: Document;
    certificates?: Document[];
    requestedDocsSubmitted?: boolean;
    requestedDocsSubmittedAt?: string | null;
    contract?: Document;
    signedContract?: Document;
};

type Job = {
    _id: string;
    title: string;
    department: string;
    employmentType: string;
};

export default function JobApplicantsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params?.id as string;

    const [job, setJob] = useState<Job | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (jobId) {
            fetchJobAndApplications();
        }
    }, [jobId]);

    const fetchJobAndApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch job details
            const jobRes = await fetch(`/hr1/api/jobs/${jobId}`, { credentials: "include" });
            if (jobRes.ok) {
                const jobData = await jobRes.json();
                setJob(jobData);
            }

            // Fetch applications
            const appsRes = await fetch(`/hr1/api/admin/evaluation/${jobId}`, {
                credentials: "include",
            });
            if (!appsRes.ok) throw new Error("Failed to load applications");
            const appsData = await appsRes.json();
            setApplications(appsData.applications || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId: string, status: string) => {
        try {
            setUpdating(applicationId);
            const res = await fetch(`/hr1/api/admin/evaluation/${jobId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ applicationId, status }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            await fetchJobAndApplications();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Failed to update status");
        } finally {
            setUpdating(null);
        }
    };

    const approveRequestedDocs = async (applicationId: string, approved: boolean) => {
        try {
            setUpdating(applicationId);
            const res = await fetch(`/hr1/api/admin/evaluation/${jobId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ applicationId, requestedDocsApproved: approved }),
            });
            if (!res.ok) throw new Error("Failed to update document approval");
            await fetchJobAndApplications();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Failed to update approval");
        } finally {
            setUpdating(null);
        }
    };

    const downloadFile = (fileId: string, filename: string) => {
        window.open(`/hr1/api/files/${fileId}`, "_blank");
    };

    const previewFile = (fileId: string) => {
        window.open(`/hr1/api/files/${fileId}?inline=1`, "_blank");
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-blue-100 text-blue-700";
            case "reviewed":
                return "bg-yellow-100 text-yellow-700";
            case "shortlisted":
                return "bg-purple-100 text-purple-700";
            case "hired":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-gray-50 p-6 max-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading applicants...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-gray-50 p-6 max-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50 p-6 max-h-screen overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push("/hr1/admin/evaluation")}
                        className="mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Evaluations
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {job?.title || "Job Applicants"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {job?.department} • {job?.employmentType} • {applications.length} applicant(s)
                        </p>
                    </div>
                </div>

                {/* Applicants List */}
                {applications.length === 0 ? (
                    <div className="p-6 bg-white border border-gray-200 rounded-lg text-gray-600 text-center">
                        No applicants yet for this job posting.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                            >
                                {/* Applicant Header */}
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 pb-4 border-b">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-xl font-semibold text-gray-900">{app.fullName}</h2>
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                                                    app.status
                                                )}`}
                                            >
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {app.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Applied {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <select
                                            value={app.status}
                                            onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                                            disabled={updating === app._id}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none disabled:opacity-50"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="hired">Hired</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {updating === app._id && (
                                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Submitted Documents</h3>

                                    {/* Initial Documents */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {app.resume && (
                                            <DocumentCard
                                                label="Resume"
                                                document={app.resume}
                                                onDownload={downloadFile}
                                                onPreview={previewFile}
                                                formatFileSize={formatFileSize}
                                            />
                                        )}
                                        {app.applicationLetter && (
                                            <DocumentCard
                                                label="Application Letter"
                                                document={app.applicationLetter}
                                                onDownload={downloadFile}
                                                onPreview={previewFile}
                                                formatFileSize={formatFileSize}
                                            />
                                        )}
                                        {app.supportingDocs?.map((doc, idx) => (
                                            <DocumentCard
                                                key={doc.fileId}
                                                label={`Supporting Document ${idx + 1}`}
                                                document={doc}
                                                onDownload={downloadFile}
                                                onPreview={previewFile}
                                                formatFileSize={formatFileSize}
                                            />
                                        ))}
                                    </div>

                                    {/* Requested Documents */}
                                    {app.status === "shortlisted" && (
                                        <div className="mt-6 pt-6 border-t">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-md font-semibold text-gray-900">
                                                    Additional Requested Documents
                                                </h4>
                                                {app.requestedDocsSubmitted && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">
                                                            Submitted:{" "}
                                                            {app.requestedDocsSubmittedAt
                                                                ? new Date(app.requestedDocsSubmittedAt).toLocaleDateString()
                                                                : "N/A"}
                                                        </span>
                                                        <button
                                                            onClick={() => approveRequestedDocs(app._id, true)}
                                                            disabled={updating === app._id}
                                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => approveRequestedDocs(app._id, false)}
                                                            disabled={updating === app._id}
                                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {app.requestedDocsSubmitted ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {app.validId && (
                                                        <DocumentCard
                                                            label="Valid ID"
                                                            document={app.validId}
                                                            onDownload={downloadFile}
                                                            onPreview={previewFile}
                                                            formatFileSize={formatFileSize}
                                                        />
                                                    )}
                                                    {app.portfolio && (
                                                        <DocumentCard
                                                            label="Portfolio"
                                                            document={app.portfolio}
                                                            onDownload={downloadFile}
                                                            onPreview={previewFile}
                                                            formatFileSize={formatFileSize}
                                                        />
                                                    )}
                                                    {app.certificates?.map((doc, idx) => (
                                                        <DocumentCard
                                                            key={doc.fileId}
                                                            label={`Certificate ${idx + 1}`}
                                                            document={doc}
                                                            onDownload={downloadFile}
                                                            onPreview={previewFile}
                                                            formatFileSize={formatFileSize}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <div className="flex items-center gap-2 text-yellow-800">
                                                        <AlertCircle className="w-5 h-5" />
                                                        <span>Additional documents not yet submitted by applicant.</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Contract Documents (for hired) */}
                                    {app.status === "hired" && (
                                        <div className="mt-6 pt-6 border-t">
                                            <h4 className="text-md font-semibold text-gray-900 mb-4">Contract Documents</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {app.contract && (
                                                    <DocumentCard
                                                        label="Contract (Provided)"
                                                        document={app.contract}
                                                        onDownload={downloadFile}
                                                        onPreview={previewFile}
                                                        formatFileSize={formatFileSize}
                                                    />
                                                )}
                                                {app.signedContract && (
                                                    <DocumentCard
                                                        label="Signed Contract"
                                                        document={app.signedContract}
                                                        onDownload={downloadFile}
                                                        onPreview={previewFile}
                                                        formatFileSize={formatFileSize}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DocumentCard({
    label,
    document,
    onDownload,
    onPreview,
    formatFileSize,
}: {
    label: string;
    document: Document;
    onDownload: (fileId: string, filename: string) => void;
    onPreview: (fileId: string) => void;
    formatFileSize: (bytes: number) => string;
}) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm">{label}</p>
                        <p className="text-sm text-gray-600 truncate">{document.filename}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(document.size)} • {new Date(document.uploadedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={() => onPreview(document.fileId)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition"
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDownload(document.fileId, document.filename)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}


