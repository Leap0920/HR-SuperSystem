"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Eye,
    ClipboardList,
    Loader2,
    Search,
    X,
    Users,
    Briefcase,
    CheckCircle,
    Clock,
    TrendingUp,
    FileText,
    ChevronRight,
    Award,
    Filter,
    BarChart3,
    UserCheck,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

type Job = {
    _id: string;
    title: string;
    department: string;
    employmentType: string;
    status?: string;
    applicants?: number;
};

type Question = {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
};

type QuestionForm = {
    question: string;
    options: string[];
    correctAnswer: string;
};

type Stats = {
    totalJobs: number;
    totalApplicants: number;
    activeJobs: number;
    pendingEvaluations: number;
};

const defaultQuestion: QuestionForm = {
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
};

export default function EvaluationDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showQuestionsListModal, setShowQuestionsListModal] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    const [activeJobTitle, setActiveJobTitle] = useState<string>("");
    const [questionForm, setQuestionForm] = useState<QuestionForm>(defaultQuestion);
    const [savingQuestion, setSavingQuestion] = useState(false);
    const [existingQuestions, setExistingQuestions] = useState<Question[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const [stats, setStats] = useState<Stats>({
        totalJobs: 0,
        totalApplicants: 0,
        activeJobs: 0,
        pendingEvaluations: 0,
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/hr1/api/admin/evaluation/jobs", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to load jobs");
            const data = await res.json();
            const jobsData = data || [];
            setJobs(jobsData);

            // Calculate stats
            const totalApplicants = jobsData.reduce((acc: number, j: Job) => acc + (j.applicants || 0), 0);
            const activeJobs = jobsData.filter((j: Job) => j.status === "Active").length;

            setStats({
                totalJobs: jobsData.length,
                totalApplicants,
                activeJobs,
                pendingEvaluations: totalApplicants, // This could be refined with actual evaluation status
            });
        } catch (err) {
            setError("Failed to load evaluation data. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestionsForJob = async (jobId: string) => {
        try {
            setLoadingQuestions(true);
            const res = await fetch(`/hr1/api/evaluation/questions?jobId=${jobId}`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch questions");
            const data = await res.json();
            setExistingQuestions(data.questions || []);
        } catch (err) {
            console.error("Failed to fetch questions:", err);
            setExistingQuestions([]);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const openQuestionsModal = (jobId: string, jobTitle: string) => {
        setActiveJobId(jobId);
        setActiveJobTitle(jobTitle);
        setQuestionForm(defaultQuestion);
        fetchQuestionsForJob(jobId);
        setShowQuestionsListModal(true);
    };

    const openAddQuestionModal = () => {
        setShowQuestionsListModal(false);
        setShowQuestionModal(true);
    };

    const closeQuestionsModal = () => {
        setShowQuestionModal(false);
        setShowQuestionsListModal(false);
        setActiveJobId(null);
        setActiveJobTitle("");
        setQuestionForm(defaultQuestion);
        setExistingQuestions([]);
    };

    const handleOptionChange = (idx: number, val: string) => {
        setQuestionForm((prev) => {
            const nextOptions = [...prev.options];
            nextOptions[idx] = val;
            return { ...prev, options: nextOptions };
        });
    };

    const handleSaveQuestion = async () => {
        if (!activeJobId) return;

        if (!questionForm.question.trim()) {
            alert("Question is required");
            return;
        }

        const cleanedOptions = questionForm.options
            .map((o) => o.trim())
            .filter(Boolean);

        if (cleanedOptions.length < 2) {
            alert("At least 2 options are required");
            return;
        }

        if (!cleanedOptions.includes(questionForm.correctAnswer.trim())) {
            alert("Correct answer must match one of the options");
            return;
        }

        try {
            setSavingQuestion(true);

            const res = await fetch(
                `/hr1/api/admin/evaluation/questions?jobId=${activeJobId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        question: questionForm.question.trim(),
                        options: cleanedOptions,
                        correctAnswer: questionForm.correctAnswer.trim(),
                    }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to save question");
            }

            // Refresh questions list
            await fetchQuestionsForJob(activeJobId);
            setQuestionForm(defaultQuestion);
            setShowQuestionModal(false);
            setShowQuestionsListModal(true);
        } catch (err: any) {
            alert(err.message || "Failed to save question");
        } finally {
            setSavingQuestion(false);
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const q = search.trim().toLowerCase();
        const matchesSearch = !q ||
            job.title.toLowerCase().includes(q) ||
            job.department.toLowerCase().includes(q) ||
            job.employmentType.toLowerCase().includes(q);

        const matchesStatus = statusFilter === "all" || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Inactive":
                return "bg-gray-100 text-gray-600 border-gray-200";
            case "Closed":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const getDepartmentColor = (dept: string) => {
        const colors = [
            "bg-blue-100 text-blue-700",
            "bg-purple-100 text-purple-700",
            "bg-pink-100 text-pink-700",
            "bg-indigo-100 text-indigo-700",
            "bg-cyan-100 text-cyan-700",
        ];
        const index = dept.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
                        <ClipboardList className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
                                Evaluation Center
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                Manage applicant evaluations, questionnaires, and assessments
                            </p>
                        </div>
                        <button
                            onClick={fetchJobs}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl 
                                     text-gray-700 hover:bg-gray-50 hover:border-purple-300 transition-all shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Positions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalJobs}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                                <Briefcase className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            <span className="text-emerald-600 font-medium">{stats.activeJobs} active</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalApplicants}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <UserCheck className="w-4 h-4 text-blue-500 mr-1" />
                            <span>Awaiting evaluation</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeJobs}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                                <CheckCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <BarChart3 className="w-4 h-4 text-emerald-500 mr-1" />
                            <span>Currently recruiting</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingEvaluations}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-105 transition-transform">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
                            <span>Need attention</span>
                        </div>
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
                                placeholder="Search by job title, department, or type..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white
                                         outline-none transition-all text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                                         outline-none transition-all text-gray-700 cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Closed">Closed</option>
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
                            onClick={fetchJobs}
                            className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {search || statusFilter !== "all"
                                ? "No jobs match your current filters. Try adjusting your search or filter criteria."
                                : "No job postings available for evaluation yet. Create a new job posting to get started."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg 
                                         hover:border-purple-200 transition-all duration-300 overflow-hidden group"
                            >
                                <div className="p-6">
                                    {/* Job Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status || "Inactive")}`}>
                                                    {job.status || "Inactive"}
                                                </span>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDepartmentColor(job.department)}`}>
                                                    {job.department}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">{job.employmentType}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                                                <Users className="w-6 h-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Applicants Count */}
                                    <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-gray-500" />
                                            <span className="text-2xl font-bold text-gray-900">{job.applicants ?? 0}</span>
                                            <span className="text-gray-500">applicants</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => router.push(`/hr1/admin/evaluation/${job._id}`)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 
                                                     bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl 
                                                     hover:from-blue-600 hover:to-blue-700 transition-all font-medium
                                                     shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                                        >
                                            <Eye className="w-5 h-5" />
                                            View Applicants
                                            <ChevronRight className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => openQuestionsModal(job._id, job.title)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 
                                                     bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl 
                                                     hover:from-purple-600 hover:to-purple-700 transition-all font-medium
                                                     shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300"
                                        >
                                            <ClipboardList className="w-5 h-5" />
                                            Questions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Questions List Modal */}
            {showQuestionsListModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Evaluation Questions</h2>
                                    <p className="text-purple-100 text-sm mt-1">{activeJobTitle}</p>
                                </div>
                                <button
                                    onClick={closeQuestionsModal}
                                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {loadingQuestions ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                </div>
                            ) : existingQuestions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-10 h-10 text-purple-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
                                    <p className="text-gray-500 mb-6">Add evaluation questions for applicants to answer.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {existingQuestions.map((q, idx) => (
                                        <div key={q._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {q.options.map((opt, optIdx) => (
                                                            <div
                                                                key={optIdx}
                                                                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${opt === q.correctAnswer
                                                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                                        : "bg-white text-gray-700 border border-gray-200"
                                                                    }`}
                                                            >
                                                                {opt === q.correctAnswer && <CheckCircle className="w-4 h-4" />}
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                {existingQuestions.length} question(s) total
                            </span>
                            <button
                                onClick={openAddQuestionModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 
                                         text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                                Add Question
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Question Modal */}
            {showQuestionModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Add New Question</h2>
                                    <p className="text-purple-100 text-sm mt-1">{activeJobTitle}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowQuestionModal(false);
                                        setShowQuestionsListModal(true);
                                    }}
                                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            {/* Question Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Question <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={questionForm.question}
                                    onChange={(e) =>
                                        setQuestionForm((prev) => ({
                                            ...prev,
                                            question: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                    placeholder="Enter your evaluation question here..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 
                                             focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                                             outline-none transition resize-none"
                                />
                            </div>

                            {/* Options */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Answer Options <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        At least 2 required
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {questionForm.options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-medium text-gray-600 text-sm">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 
                                                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                                                         outline-none transition"
                                                placeholder={`Option ${idx + 1}`}
                                            />
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={questionForm.correctAnswer === opt && opt.trim() !== ""}
                                                    onChange={() =>
                                                        setQuestionForm((p) => ({
                                                            ...p,
                                                            correctAnswer: opt,
                                                        }))
                                                    }
                                                    disabled={!opt.trim()}
                                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className={`text-xs font-medium ${questionForm.correctAnswer === opt && opt.trim()
                                                        ? "text-emerald-600"
                                                        : "text-gray-500"
                                                    }`}>
                                                    Correct
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowQuestionModal(false);
                                    setShowQuestionsListModal(true);
                                }}
                                className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-xl 
                                         hover:bg-gray-100 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveQuestion}
                                disabled={savingQuestion}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 
                                         text-white rounded-xl hover:from-purple-700 hover:to-blue-700 
                                         transition-all font-medium shadow-md disabled:opacity-60"
                            >
                                {savingQuestion ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Save Question
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
