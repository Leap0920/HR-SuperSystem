"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Loader2,
    UserPlus,
    ArrowRight,
    CheckCircle,
    Clock,
    FileText,
    Building2,
} from "lucide-react";

type HiredApplicant = {
    _id: string;
    fullName: string;
    email: string;
    jobTitle: string;
    department?: string;
    hiredDate?: string;
    onboardingStatus: "pending" | "in_progress" | "completed";
};

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
};

export default function OnboardingPage() {
    const [hiredApplicants, setHiredApplicants] = useState<HiredApplicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"onboarding" | "transfer">("onboarding");

    useEffect(() => {
        fetchHiredApplicants();
    }, []);

    const fetchHiredApplicants = async () => {
        try {
            setLoading(true);
            const res = await fetch("/hr1/api/admin/onboarding", {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setHiredApplicants(data.applicants || []);
            }
        } catch (err) {
            console.error("Failed to fetch hired applicants:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplicants = hiredApplicants.filter((app) => {
        const q = search.toLowerCase();
        return (
            app.fullName.toLowerCase().includes(q) ||
            app.email.toLowerCase().includes(q) ||
            app.jobTitle.toLowerCase().includes(q)
        );
    });

    return (
        <div className="w-full bg-gray-50 p-6 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Onboarding & Transfer
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage new hire onboarding and employee transfers
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("onboarding")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "onboarding"
                                ? "bg-purple-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <UserPlus className="w-4 h-4 inline mr-2" />
                        Onboarding
                    </button>
                    <button
                        onClick={() => setActiveTab("transfer")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "transfer"
                                ? "bg-purple-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <ArrowRight className="w-4 h-4 inline mr-2" />
                        Transfer
                    </button>
                </div>

                {activeTab === "onboarding" ? (
                    <>
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search new hires..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {hiredApplicants.filter((a) => a.onboardingStatus === "pending").length}
                                        </p>
                                        <p className="text-sm text-gray-500">Pending</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {hiredApplicants.filter((a) => a.onboardingStatus === "in_progress").length}
                                        </p>
                                        <p className="text-sm text-gray-500">In Progress</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {hiredApplicants.filter((a) => a.onboardingStatus === "completed").length}
                                        </p>
                                        <p className="text-sm text-gray-500">Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        {loading ? (
                            <div className="flex items-center justify-center gap-2 text-gray-600 py-12">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Loading...
                            </div>
                        ) : filteredApplicants.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600">No new hires pending onboarding</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Hired applicants will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredApplicants.map((applicant) => (
                                    <div
                                        key={applicant._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {applicant.fullName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {applicant.fullName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {applicant.jobTitle}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[applicant.onboardingStatus]
                                                    }`}
                                            >
                                                {applicant.onboardingStatus.replace("_", " ").toUpperCase()}
                                            </span>
                                            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    /* Transfer Tab */
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Employee Transfer Management</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Transfer requests and interdepartmental moves will be managed here
                        </p>
                        <p className="text-sm text-gray-400 mt-4">
                            Coming soon...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
