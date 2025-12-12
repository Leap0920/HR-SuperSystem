"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Search, Plus, Eye, Edit, Trash2, X, Play } from 'lucide-react';

interface Module {
    _id: string;
    title: string;
    description: string;
    category: string;
    numberOfTopics: number;
    fileName?: string;
    filePath?: string;
    userProgress?: {
        status: string;
        progress: number;
        quizScore?: number;
    };
}

interface Stats {
    totalModules: number;
    completed: number;
    inProgress: number;
    notStarted: number;
}

export default function LearningPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [stats, setStats] = useState<Stats>({ totalModules: 0, completed: 0, inProgress: 0, notStarted: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Modules');
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Technical', numberOfTopics: 8 });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const res = await fetch('/hr2/api/employee/learning');
            if (res.ok) {
                const data = await res.json();
                setModules(data.modules || []);
                setStats(data.stats || stats);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    };

    const startModule = async (moduleId: string) => {
        try {
            const res = await fetch('/hr2/api/employee/learning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleId, progress: 10, status: 'In Progress' }),
            });
            if (res.ok) {
                fetchModules();
            }
        } catch (error) {
            console.error('Error starting module:', error);
        }
    };

    const continueModule = async (moduleId: string, currentProgress: number) => {
        const newProgress = Math.min(currentProgress + 15, 100);
        try {
            const res = await fetch('/hr2/api/employee/learning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleId, progress: newProgress }),
            });
            if (res.ok) {
                fetchModules();
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const completeModule = async (moduleId: string, quizScore: number) => {
        try {
            const res = await fetch('/hr2/api/employee/learning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleId, progress: 100, quizScore, status: 'Completed' }),
            });
            if (res.ok) {
                fetchModules();
            }
        } catch (error) {
            console.error('Error completing module:', error);
        }
    };

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('category', formData.category);
            form.append('numberOfTopics', formData.numberOfTopics.toString());

            const res = await fetch('/hr2/api/admin/module', {
                method: 'POST',
                body: form,
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ title: '', description: '', category: 'Technical', numberOfTopics: 8 });
                fetchModules();
            }
        } catch (error) {
            console.error('Error creating module:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('Are you sure you want to delete this module?')) return;
        try {
            const res = await fetch(`/hr2/api/admin/module/${moduleId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchModules();
            }
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    const viewModule = (module: Module) => {
        setSelectedModule(module);
        setShowViewModal(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            default: return 'bg-purple-100 text-purple-700';
        }
    };

    const getStatusText = (status: string) => {
        return status === 'Not Started' ? 'Available' : status;
    };

    const filteredModules = modules.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All Modules' || m.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const estimateHours = (topics: number) => Math.ceil(topics * 0.5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 max-h-screen overflow-y-scroll">
            {/* Create Module Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Create New Module</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateModule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter module title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Enter module description"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topics</label>
                                    <input
                                        type="number"
                                        value={formData.numberOfTopics}
                                        onChange={(e) => setFormData({ ...formData, numberOfTopics: parseInt(e.target.value) || 1 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option>Technical</option>
                                        <option>Pedagogy</option>
                                        <option>Leadership</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                    {saving ? 'Creating...' : 'Create Module'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Module Modal */}
            {showViewModal && selectedModule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{selectedModule.title}</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-600">{selectedModule.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Category:</span> {selectedModule.category}</div>
                                <div><span className="font-medium">Topics:</span> {selectedModule.numberOfTopics}</div>
                                <div><span className="font-medium">Duration:</span> ~{estimateHours(selectedModule.numberOfTopics)} hours</div>
                                <div><span className="font-medium">Status:</span> {getStatusText(selectedModule.userProgress?.status || 'Not Started')}</div>
                            </div>
                            {selectedModule.userProgress?.progress !== undefined && selectedModule.userProgress.progress > 0 && (
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Progress</span>
                                        <span>{selectedModule.userProgress.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${selectedModule.userProgress.progress}%` }}></div>
                                    </div>
                                </div>
                            )}
                            {selectedModule.filePath && (
                                <a href={selectedModule.filePath} target="_blank" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Download Material
                                </a>
                            )}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">Learning Management</h1>
                <p className="text-gray-600 mt-1">Access learning materials and complete modules</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-purple-700 font-medium">Total Modules</p>
                            <p className="text-3xl font-bold text-purple-900 mt-1">{stats.totalModules}</p>
                            <p className="text-xs text-purple-600 mt-1">Available Courses</p>
                        </div>
                        <BookOpen className="text-purple-600" size={24} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-green-700 font-medium">Completed</p>
                            <p className="text-3xl font-bold text-green-900 mt-1">{stats.completed}</p>
                            <p className="text-xs text-green-600 mt-1">Modules Finished</p>
                        </div>
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-blue-700 font-medium">In Progress</p>
                            <p className="text-3xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
                            <p className="text-xs text-blue-600 mt-1">Currently Learning</p>
                        </div>
                        <Clock className="text-blue-600" size={24} />
                    </div>
                </div>
            </div>

            {/* Search and Create */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search learning modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option>All Modules</option>
                    <option>Technical</option>
                    <option>Pedagogy</option>
                    <option>Leadership</option>
                </select>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 whitespace-nowrap"
                >
                    <Plus size={20} />
                    Create Module
                </button>
            </div>

            {/* Learning Modules */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Modules</h3>
                {filteredModules.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No modules found</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredModules.map((module) => {
                            const status = module.userProgress?.status || 'Not Started';
                            const progress = module.userProgress?.progress || 0;
                            const quizScore = module.userProgress?.quizScore;

                            return (
                                <div key={module._id} className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-800">{module.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ml-2 ${getStatusBadge(status)}`}>
                                            {getStatusText(status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <span>{module.numberOfTopics} topics</span>
                                        <span>•</span>
                                        <span>{estimateHours(module.numberOfTopics)} hours</span>
                                        <span>•</span>
                                        <span>{module.category}</span>
                                    </div>

                                    {status === 'Completed' && quizScore !== undefined && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle className="text-green-600" size={16} />
                                            <span className="text-sm font-medium text-green-700">Quiz Score: {quizScore}%</span>
                                        </div>
                                    )}

                                    {status === 'In Progress' && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium text-indigo-600">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {status === 'Completed' ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => completeModule(module._id, Math.floor(Math.random() * 30) + 70)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                            >
                                                Retake Quiz
                                            </button>
                                            <button onClick={() => viewModule(module)} className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                                <Eye size={20} />
                                            </button>
                                            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                                <Edit size={20} />
                                            </button>
                                            <button onClick={() => handleDeleteModule(module._id)} className="p-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ) : status === 'In Progress' ? (
                                        <>
                                            <button
                                                onClick={() => progress >= 85 ? completeModule(module._id, Math.floor(Math.random() * 30) + 70) : continueModule(module._id, progress)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                            >
                                                <Play size={20} />
                                                {progress >= 85 ? 'Complete & Take Quiz' : 'Continue Learning'}
                                            </button>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => viewModule(module)} className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                                    <Eye size={20} className="mx-auto" />
                                                </button>
                                                <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                                    <Edit size={20} className="mx-auto" />
                                                </button>
                                                <button onClick={() => handleDeleteModule(module._id)} className="flex-1 p-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">
                                                    <Trash2 size={20} className="mx-auto" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startModule(module._id)}
                                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mb-2"
                                            >
                                                Start Module
                                            </button>
                                            <div className="flex gap-2">
                                                <button onClick={() => viewModule(module)} className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                                    <Eye size={20} className="mx-auto" />
                                                </button>
                                                <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                                    <Edit size={20} className="mx-auto" />
                                                </button>
                                                <button onClick={() => handleDeleteModule(module._id)} className="flex-1 p-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">
                                                    <Trash2 size={20} className="mx-auto" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
