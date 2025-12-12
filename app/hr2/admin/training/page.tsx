"use client";

import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, Star, X } from 'lucide-react';

export default function TrainingPage() {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const CreateTrainingModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Training</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Training Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter training title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Workshop</option>
                            <option>Seminar</option>
                            <option>Webinar</option>
                            <option>Conference</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Room 301 / Auditorium"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={3}
                            placeholder="Enter training description"
                        ></textarea>
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
                            Create Training
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-6 max-h-screen overflow-y-scroll">
            {showModal && <CreateTrainingModal />}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">Training Management (Admin)</h1>
                <p className="text-gray-600 mt-1">Organize and manage training programs</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-purple-700 font-medium">Total Trainings</p>
                            <p className="text-3xl font-bold text-purple-900 mt-1">5</p>
                            <p className="text-xs text-purple-600 mt-1">all programs</p>
                        </div>
                        <Calendar className="text-purple-600" size={24} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-blue-700 font-medium">Total Registrations</p>
                            <p className="text-3xl font-bold text-blue-900 mt-1">133</p>
                            <p className="text-xs text-blue-600 mt-1">across all trainings</p>
                        </div>
                        <Users className="text-blue-600" size={24} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-green-700 font-medium">Total Attendance</p>
                            <p className="text-3xl font-bold text-green-900 mt-1">50</p>
                            <p className="text-xs text-green-600 mt-1">participants attended</p>
                        </div>
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-amber-700 font-medium">Avg Rating</p>
                            <p className="text-3xl font-bold text-amber-900 mt-1">4.7/5</p>
                            <p className="text-xs text-amber-600 mt-1">participant feedback</p>
                        </div>
                        <Star className="text-amber-600" size={24} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="border-b border-gray-200">
                    <div className="flex gap-6 px-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 text-sm font-medium px-4 border-b-2 transition-colors ${activeTab === 'overview'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`py-4 text-sm font-medium px-4 border-b-2 transition-colors ${activeTab === 'upcoming'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Upcoming Trainings
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`py-4 text-sm font-medium px-4 border-b-2 transition-colors ${activeTab === 'completed'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`py-4 text-sm font-medium px-4 border-b-2 transition-colors ${activeTab === 'create'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Create Training
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Upcoming Trainings */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-purple-900 mb-4">Upcoming Trainings</h3>
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-800">Teaching Excellence Workshop</h4>
                                        <span className="text-sm text-indigo-600 font-medium">15/20</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Dec 15, 2024</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        <span>Room 301</span>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-800">AI in Education Seminar</h4>
                                        <span className="text-sm text-indigo-600 font-medium">45/50</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Dec 18, 2024</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        <span>Auditorium</span>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-800">Research Methodology Masterclass</h4>
                                        <span className="text-sm text-indigo-600 font-medium">18/25</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Dec 20, 2024</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        <span>Conference Room</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Rated Trainings */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-900 mb-4">Top Rated Trainings</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-gray-800">Educational Technology Trends</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="text-amber-500 fill-amber-500" size={16} />
                                        <span className="font-bold text-gray-800">4.8</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-gray-800">Data Analytics Fundamentals</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="text-amber-500 fill-amber-500" size={16} />
                                        <span className="font-bold text-gray-800">4.5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Training Types Distribution */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">Training Types Distribution</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-sm text-blue-700 font-medium mb-1">Workshops</p>
                                <p className="text-2xl font-bold text-blue-900">3 trainings</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 font-medium mb-1">Seminars</p>
                                <p className="text-2xl font-bold text-blue-900">2 trainings</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 font-medium mb-1">Webinars</p>
                                <p className="text-2xl font-bold text-blue-900">0 trainings</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 font-medium mb-1">Conferences</p>
                                <p className="text-2xl font-bold text-blue-900">0 trainings</p>
                            </div>
                        </div>
                    </div>

                    {/* Create Training Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                        >
                            Create New Training Program
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}