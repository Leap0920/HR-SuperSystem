"use client";

import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Search, Plus, Eye, Edit, Trash2, X, Play } from 'lucide-react';

export default function LearningPage() {
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const CreateModuleModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Module</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter module title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={3}
                            placeholder="Enter module description"
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topics</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="8"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Technical</option>
                            <option>Pedagogy</option>
                            <option>Leadership</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Create Module
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-6 max-h-screen overflow-y-scroll">
            {showModal && <CreateModuleModal />}

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
                            <p className="text-3xl font-bold text-purple-900 mt-1">4</p>
                            <p className="text-xs text-purple-600 mt-1">Available Courses</p>
                        </div>
                        <BookOpen className="text-purple-600" size={24} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-green-700 font-medium">Completed</p>
                            <p className="text-3xl font-bold text-green-900 mt-1">1</p>
                            <p className="text-xs text-green-600 mt-1">Modules Finished</p>
                        </div>
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-blue-700 font-medium">In Progress</p>
                            <p className="text-3xl font-bold text-blue-900 mt-1">1</p>
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
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Module 1 - Completed */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">AI Fundamentals</h4>
                                <p className="text-sm text-gray-600 mt-1">Introduction to Artificial Intelligence and Machine Learning</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm whitespace-nowrap ml-2">Completed</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>8 topics</span>
                            <span>•</span>
                            <span>4 hours</span>
                            <span>•</span>
                            <span>Technical</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="text-green-600" size={16} />
                            <span className="text-sm font-medium text-green-700">Quiz Score: 92%</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Retake Quiz
                            </button>
                            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Eye size={20} />
                            </button>
                            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Edit size={20} />
                            </button>
                            <button className="p-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Module 2 - In Progress */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">Advanced Data Analytics</h4>
                                <p className="text-sm text-gray-600 mt-1">Deep dive into data analysis techniques and visualization</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap ml-2">In Progress</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>12 topics</span>
                            <span>•</span>
                            <span>6 hours</span>
                            <span>•</span>
                            <span>Technical</span>
                        </div>
                        <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-indigo-600">65%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <Play size={20} />
                            Start Learning
                        </button>
                        <div className="flex gap-2 mt-2">
                            <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Eye size={20} className="mx-auto" />
                            </button>
                            <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Edit size={20} className="mx-auto" />
                            </button>
                            <button className="flex-1 p-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">
                                <Trash2 size={20} className="mx-auto" />
                            </button>
                        </div>
                    </div>

                    {/* Module 3 - Available */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">Teaching Excellence</h4>
                                <p className="text-sm text-gray-600 mt-1">Modern teaching methodologies and student engagement</p>
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm whitespace-nowrap ml-2">Available</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>8 topics</span>
                            <span>•</span>
                            <span>5 hours</span>
                            <span>•</span>
                            <span>Pedagogy</span>
                        </div>
                        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mb-2">
                            Start Module
                        </button>
                        <div className="flex gap-2">
                            <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Eye size={20} className="mx-auto" />
                            </button>
                            <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Edit size={20} className="mx-auto" />
                            </button>
                            <button className="flex-1 p-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">
                                <Trash2 size={20} className="mx-auto" />
                            </button>
                        </div>
                    </div>

                    {/* Module 4 - Available */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">Research Methodology</h4>
                                <p className="text-sm text-gray-600 mt-1">Comprehensive guide to academic research and publication</p>
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm whitespace-nowrap ml-2">Available</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>8 topics</span>
                            <span>•</span>
                            <span>4 hours</span>
                            <span>•</span>
                            <span>Pedagogy</span>
                        </div>
                        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mb-2">
                            Start Module
                        </button>
                        <div className="flex gap-2">
                            <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Eye size={20} className="mx-auto" />
                            </button>
                            <button className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                <Edit size={20} className="mx-auto" />
                            </button>
                            <button className="flex-1 p-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">
                                <Trash2 size={20} className="mx-auto" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}