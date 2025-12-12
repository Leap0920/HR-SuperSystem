"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Users,
    CheckCircle,
    Clock,
    Award,
    Filter,
    RefreshCw,
    ChevronDown,
    Mail,
    Calendar,
    Briefcase,
    FileText,
    Eye,
    AlertCircle,
    ClipboardCheck,
    ClipboardList,
    TrendingUp,
    Building2,
    Loader2,
} from "lucide-react";

type Applicant = {
    _id: string;
    fullName: string;
    email: string;
    jobId: string;
    jobTitle: string;
    department: string;
    employmentType: string;
    status: string;
    appliedAt: string;
    hasEvaluation: boolean;
    evaluationScore: number | null;
    evaluationTotal: number | null;
    evaluationSubmittedAt: string | null;
    hasResume: boolean;
    hasApplicationLetter: boolean;
};

type Stats = {
    total: number;
    pendingEvaluation: number;
    completedEvaluation: number;
    departments: string[];
};

export default function EvaluationDashboard() {
    const router = useRouter();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");
    const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
    const [departments, setDepartments] = useState<string[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pendingEvaluation: 0,
        completedEvaluation: 0,
        departments: [],
    });
    const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/hr1/api/admin/evaluation", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to load applicants");
            const data = await res.json();

            setApplicants(data.applicants || []);
            setStats(data.stats || {
                total: 0,
                pendingEvaluation: 0,
                completedEvaluation: 0,
                departments: [],
            });
            setDepartments(data.departments || []);
        } catch (err) {
            setError("Failed to load evaluation data. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter applicants based on tab, department, and search
    const filteredApplicants = applicants.filter((app) => {
        // Tab filter
        if (activeTab === "pending" && app.hasEvaluation) return false;
        if (activeTab === "completed" && !app.hasEvaluation) return false;

        // Department filter
        if (departmentFilter !== "all" && app.department !== departmentFilter) return false;

        // Search filter
        const q = search.trim().toLowerCase();
        if (q) {
            return (
                app.fullName.toLowerCase().includes(q) ||
                app.email.toLowerCase().includes(q) ||
                app.jobTitle.toLowerCase().includes(q) ||
                app.department.toLowerCase().includes(q)
            );
        }

        return true;
    });

    // Group by department for display
    const groupedByDepartment = filteredApplicants.reduce((acc, app) => {
        const dept = app.department || "Unassigned";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(app);
        return acc;
    }, {} as Record<string, Applicant[]>);

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 70) return "text-emerald-600 bg-emerald-100 border-emerald-200";
        if (percentage >= 50) return "text-yellow-600 bg-yellow-100 border-yellow-200";
        return "text-red-600 bg-red-100 border-red-200";
    };

    const getScorePercentage = (score: number, total: number) => {
        return Math.round((score / total) * 100);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
                        <ClipboardCheck className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading evaluations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Applicant Evaluations
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                Track and manage evaluation tests for all applicants
                            </p>
                        </div>
                        <button
                            onClick={fetchApplicants}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl 
                                     text-gray-700 hover:bg-gray-50 hover:border-purple-300 transition-all shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                            <span>Across all departments</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Evaluation</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingEvaluation}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-105 transition-transform">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
                            <span>Haven't taken the test yet</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Completed Evaluation</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedEvaluation}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                                <CheckCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <Award className="w-4 h-4 text-emerald-500 mr-1" />
                            <span>Test completed with scores</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "pending"
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            Pending Evaluation
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "pending" ? "bg-white/20" : "bg-amber-100 text-amber-700"
                                }`}>
                                {stats.pendingEvaluation}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "completed"
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <CheckCircle className="w-5 h-5" />
                            Completed Evaluation
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "completed" ? "bg-white/20" : "bg-emerald-100 text-emerald-700"
                                }`}>
                                {stats.completedEvaluation}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, job title, or department..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white
                                         outline-none transition-all text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                                         outline-none transition-all text-gray-700 cursor-pointer min-w-[180px]"
                            >
                                <option value="all">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={fetchApplicants}
                            className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Applicants List - Grouped by Department */}
                {filteredApplicants.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {activeTab === "pending" ? (
                                <Clock className="w-10 h-10 text-gray-400" />
                            ) : (
                                <CheckCircle className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {activeTab === "pending" ? "No Pending Evaluations" : "No Completed Evaluations"}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {activeTab === "pending"
                                ? "All applicants have completed their evaluation tests, or no applicants match your filters."
                                : "No applicants have completed their evaluation yet, or no applicants match your filters."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedByDepartment).map(([department, deptApplicants]) => (
                            <div key={department} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Department Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{department}</h3>
                                                <p className="text-sm text-gray-500">{deptApplicants.length} applicant(s)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Applicants in this Department */}
                                <div className="divide-y divide-gray-100">
                                    {deptApplicants.map((applicant) => (
                                        <div
                                            key={applicant._id}
                                            className="p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div
                                                className="flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
                                                onClick={() => setExpandedApplicant(
                                                    expandedApplicant === applicant._id ? null : applicant._id
                                                )}
                                            >
                                                {/* Avatar & Name */}
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                        {applicant.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 truncate">{applicant.fullName}</h4>
                                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-0.5">
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="w-3.5 h-3.5" />
                                                                {applicant.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Job Info */}
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700 font-medium">{applicant.jobTitle}</span>
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                                                        {applicant.employmentType}
                                                    </span>
                                                </div>

                                                {/* Evaluation Status */}
                                                <div className="flex items-center gap-3">
                                                    {applicant.hasEvaluation ? (
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getScoreColor(applicant.evaluationScore!, applicant.evaluationTotal!)
                                                            }`}>
                                                            <Award className="w-4 h-4" />
                                                            {applicant.evaluationScore}/{applicant.evaluationTotal}
                                                            <span className="text-xs opacity-75">
                                                                ({getScorePercentage(applicant.evaluationScore!, applicant.evaluationTotal!)}%)
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                            <Clock className="w-4 h-4" />
                                                            Pending
                                                        </div>
                                                    )}
                                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedApplicant === applicant._id ? "rotate-180" : ""
                                                        }`} />
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedApplicant === applicant._id && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-gray-50 rounded-xl p-4">
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Application Info</h5>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-500">Applied</span>
                                                                <span className="font-medium text-gray-900">
                                                                    {new Date(applicant.appliedAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-500">Status</span>
                                                                <span className="font-medium text-gray-900 capitalize">
                                                                    {applicant.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 rounded-xl p-4">
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Documents</h5>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                {applicant.hasResume ? (
                                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                ) : (
                                                                    <AlertCircle className="w-4 h-4 text-gray-300" />
                                                                )}
                                                                <span className={applicant.hasResume ? "text-gray-900" : "text-gray-400"}>
                                                                    Resume
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {applicant.hasApplicationLetter ? (
                                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                ) : (
                                                                    <AlertCircle className="w-4 h-4 text-gray-300" />
                                                                )}
                                                                <span className={applicant.hasApplicationLetter ? "text-gray-900" : "text-gray-400"}>
                                                                    Application Letter
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 rounded-xl p-4">
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Evaluation</h5>
                                                        {applicant.hasEvaluation ? (
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-gray-500">Score</span>
                                                                    <span className="font-bold text-gray-900">
                                                                        {applicant.evaluationScore}/{applicant.evaluationTotal}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-gray-500">Completed</span>
                                                                    <span className="font-medium text-gray-900">
                                                                        {applicant.evaluationSubmittedAt
                                                                            ? new Date(applicant.evaluationSubmittedAt).toLocaleDateString()
                                                                            : "N/A"
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {/* Progress bar */}
                                                                <div className="mt-2">
                                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full ${getScorePercentage(applicant.evaluationScore!, applicant.evaluationTotal!) >= 70
                                                                                    ? "bg-emerald-500"
                                                                                    : getScorePercentage(applicant.evaluationScore!, applicant.evaluationTotal!) >= 50
                                                                                        ? "bg-yellow-500"
                                                                                        : "bg-red-500"
                                                                                }`}
                                                                            style={{
                                                                                width: `${getScorePercentage(applicant.evaluationScore!, applicant.evaluationTotal!)}%`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                                                <Clock className="w-4 h-4" />
                                                                <span>Waiting for applicant to take test</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* View Full Application Button */}
                                                    <div className="md:col-span-3 flex justify-end">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/hr1/admin/evaluation/${applicant.jobId}`);
                                                            }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 
                                                                     text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all font-medium shadow-md"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Full Application
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
