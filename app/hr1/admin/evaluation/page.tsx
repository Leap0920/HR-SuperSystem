"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, ClipboardList, Loader2, Search, X } from "lucide-react";

type Job = {
    _id: string;
    title: string;
    department: string;
    employmentType: string;
    status?: string;
    applicants?: number;
};

type QuestionForm = {
    question: string;
    options: string[];
    correctAnswer: string;
};

const defaultQuestion: QuestionForm = {
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
};

export default function EvaluationDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    const [questionForm, setQuestionForm] = useState<QuestionForm>(defaultQuestion);
    const [savingQuestion, setSavingQuestion] = useState(false);

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
            setJobs(data || []);
        } catch (err) {
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const openQuestionsModal = (jobId: string) => {
        setActiveJobId(jobId);
        setQuestionForm(defaultQuestion);
        setShowQuestionModal(true);
    };

    const closeQuestionsModal = () => {
        setShowQuestionModal(false);
        setActiveJobId(null);
        setQuestionForm(defaultQuestion);
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

            alert("Question added");
            closeQuestionsModal();
        } catch (err: any) {
            alert(err.message || "Failed to save question");
        } finally {
            setSavingQuestion(false);
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            job.title.toLowerCase().includes(q) ||
            job.department.toLowerCase().includes(q) ||
            job.employmentType.toLowerCase().includes(q)
        );
    });

    return (
        <div className="w-full bg-gray-50 p-6 max-h-screen overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Evaluations</h1>
                        <p className="text-gray-600 mt-1">
                            Manage applicants, documents, and questionnaires per job.
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                       focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading jobs...
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="p-6 bg-white border border-gray-200 rounded-lg text-gray-600">
                        No jobs found.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-white border border-gray-200 rounded-lg p-4 
                                        flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>

                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                            {job.department}
                                        </span>

                                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                                            {job.employmentType}
                                        </span>

                                        {job.status && (
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    job.status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-700"
                                                }`}
                                            >
                                                {job.status}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mt-1">
                                        Applicants: {job.applicants ?? 0}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() =>
                                            router.push(`/hr1/admin/evaluation/${job._id}`)
                                        }
                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 
                                                   text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Applicants & Docs
                                    </button>

                                    <button
                                        onClick={() => openQuestionsModal(job._id)}
                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 
                                                   text-white rounded-lg hover:bg-purple-700 transition"
                                    >
                                        <ClipboardList className="w-4 h-4" />
                                        Manage Evaluation Questionnaire
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showQuestionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Add Evaluation Question
                            </h2>
                            <button
                                onClick={closeQuestionsModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 
                                               focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Options
                                    </label>
                                    <small className="text-gray-500">
                                        At least 2 options required
                                    </small>
                                </div>

                                {questionForm.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 
                                                       focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                            placeholder={`Option ${idx + 1}`}
                                        />

                                        <input
                                            type="radio"
                                            name="correct"
                                            checked={questionForm.correctAnswer === opt}
                                            onChange={() =>
                                                setQuestionForm((p) => ({
                                                    ...p,
                                                    correctAnswer: opt,
                                                }))
                                            }
                                        />
                                        <span className="text-xs text-gray-500">Correct</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={closeQuestionsModal}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg 
                                               hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSaveQuestion}
                                    disabled={savingQuestion}
                                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg 
                                               hover:bg-purple-700 disabled:opacity-60"
                                >
                                    {savingQuestion ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}

                                    <span className="ml-2">Save Question</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
