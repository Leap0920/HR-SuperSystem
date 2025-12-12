'use client';

import { useState } from 'react';

export default function ReportPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [sortBy, setSortBy] = useState('newest');

    const reports = [
        {
            id: 1,
            title: 'Learning Progress Summary',
            type: 'Learning Management',
            generatedBy: 'System',
            date: '2024-11-28',
            size: '2.4 MB',
            format: 'PDF'
        },
        {
            id: 2,
            title: 'Training Attendance Report - October',
            type: 'Training Management',
            generatedBy: 'HR Admin',
            date: '2024-11-25',
            size: '1.8 MB',
            format: 'PDF'
        },
        {
            id: 3,
            title: 'Q3 2024 Competency Report',
            type: 'Competency Assessment',
            generatedBy: 'System',
            date: '2024-10-31',
            size: '3.2 MB',
            format: 'PDF'
        }
    ];

    const reportCategories = [
        {
            id: 'competency',
            name: 'Competency Assessment',
            description: 'Detailed analysis of employee competency levels and skill gaps',
            icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
        },
        {
            id: 'learning',
            name: 'Learning Progress',
            description: 'Track learning modules completion and performance metrics',
            icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        },
        {
            id: 'training',
            name: 'Training Records',
            description: 'Comprehensive training attendance and completion records',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
        }
    ];

    const handleGenerateReport = async (category: string) => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsGenerating(false);
        console.log('Generated report for:', category);
    };

    const handleDownload = (report: any) => {
        console.log('Downloading:', report.title);
    };

    const sortedReports = [...reports].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
    });

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Total Reports</span>
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                    <div className="text-sm text-gray-600">Generated</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">This Month</span>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                    <div className="text-sm text-gray-600">Recent Reports</div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Report Types</span>
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                    <div className="text-sm text-gray-600">Categories</div>
                </div>
            </div>

            {/* Generate New Report */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Generate New Report</h3>
                        <p className="text-sm text-gray-600">Choose a report type to generate</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reportCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleGenerateReport(category.id)}
                            disabled={isGenerating}
                            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <svg className="w-10 h-10 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                            </svg>
                            <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.description}</p>
                        </button>
                    ))}
                </div>

                {isGenerating && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="text-sm font-medium text-indigo-900">Generating report... Please wait.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                            <p className="text-sm text-gray-600">View and download generated reports</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        {sortedReports.map((report) => (
                            <div key={report.id} className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">{report.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                                    {report.type}
                                                </span>
                                                <span>Generated by: {report.generatedBy}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{report.date}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{report.size}</span>
                                                <span>•</span>
                                                <span>{report.format}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDownload(report)}
                                        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {reports.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600 mb-4">No reports generated yet.</p>
                            <p className="text-sm text-gray-500">Generate your first report using the options above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}