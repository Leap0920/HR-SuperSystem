'use client';

import { useState } from 'react';
import Modal from '../modal';

export default function DashboardPage() {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const recentActivities = [
        {
            title: 'Completed AI Fundamentals Assessment',
            date: '2025-11-12',
            status: 'Completed',
            color: 'green'
        },
        {
            title: 'Started Advanced Data Analytics Module',
            date: '2025-11-15',
            status: 'In Progress',
            color: 'blue'
        },
        {
            title: 'Registered for Teaching Excellence Workshop',
            date: '2025-11-08',
            status: 'Upcoming',
            color: 'orange'
        }
    ];

    const upcomingTrainings = [
        {
            title: 'Teaching Excellence Workshop',
            description: 'Modern teaching methodologies and student engagement',
            room: 'Room 301',
            time: '13:00'
        },
        {
            title: 'AI in Education Seminar',
            description: 'Exploring AI applications in educational settings',
            location: 'Auditorium',
            time: '13:00'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Competency Level</span>
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">75%</div>
                    <div className="w-full bg-purple-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                    </div>
                </div>

                <div className="bg-pink-50 rounded-lg p-6 border border-pink-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Learning Progress</span>
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">12/20</div>
                    <div className="w-full bg-pink-200 rounded-full h-2.5">
                        <div className="bg-pink-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Upcoming Trainings</span>
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                    <div className="text-sm text-gray-600">Events Scheduled</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Pending Assessments</span>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
                    <div className="text-sm text-gray-600">Action Required</div>
                </div>
            </div>

            {/* Recent Activity & Upcoming Training */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
                    <p className="text-sm text-gray-600 mb-4">Your latest learning and development activities</p>

                    <div className="space-y-3">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 mb-1">{activity.title}</div>
                                    <div className="text-sm text-gray-500">{activity.date}</div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-3
                  ${activity.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                  ${activity.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                  ${activity.color === 'orange' ? 'bg-orange-100 text-orange-700' : ''}
                `}>
                                    {activity.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Training */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Training</h3>
                    <p className="text-sm text-gray-600 mb-4">Scheduled workshops and seminars</p>

                    <div className="space-y-4">
                        {upcomingTrainings.map((training, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                <div className="font-semibold text-gray-900 mb-2">{training.title}</div>
                                <div className="space-y-1.5 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{training.room || training.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{training.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        View All Training
                    </button>
                </div>
            </div>

            {/* Jump Actions */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Jump Actions</h3>
                <p className="text-sm text-gray-600 mb-4">Jump to important tasks</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'assessment', label: 'Start Assessment', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                        { id: 'courses', label: 'Browse Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                        { id: 'training', label: 'Schedule Training', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { id: 'document', label: 'Request Document', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
                    ].map((action) => (
                        <button
                            key={action.id}
                            onClick={() => setSelectedAction(action.id)}
                            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all text-center group"
                        >
                            <svg className="w-10 h-10 mx-auto mb-3 text-indigo-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                            </svg>
                            <div className="font-medium text-gray-900">{action.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={selectedAction === 'assessment'}
                onClose={() => setSelectedAction(null)}
                title="Start Assessment"
                size="md"
            >
                <div className="space-y-3">
                    <p className="text-gray-600 mb-4">Select an assessment to begin:</p>
                    {[
                        { name: 'Programming Assessment', type: 'Technical Skills', duration: '45 minutes' },
                        { name: 'Communication Assessment', type: 'Soft Skills', duration: '30 minutes' }
                    ].map((assessment, i) => (
                        <button key={i} className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                            <div className="font-semibold text-gray-900">{assessment.name}</div>
                            <div className="text-sm text-gray-600">{assessment.type} • {assessment.duration}</div>
                        </button>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={selectedAction === 'courses'}
                onClose={() => setSelectedAction(null)}
                title="Browse Learning Courses"
                size="lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { name: 'AI Fundamentals', topics: '6 topics', hours: '8 hours', category: 'Technical' },
                        { name: 'Teaching Excellence', topics: '8 topics', hours: '5 hours', category: 'Pedagogy' },
                        { name: 'Research Methodology', topics: '4 topics', hours: '4 hours', category: 'Pedagogy' },
                        { name: 'Data Analytics', topics: '5 topics', hours: '6 hours', category: 'Technical' }
                    ].map((course, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                            <div className="font-semibold text-gray-900 mb-2">{course.name}</div>
                            <div className="text-sm text-gray-600 mb-4">{course.topics} • {course.hours} • {course.category}</div>
                            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                Start Module
                            </button>
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={selectedAction === 'training'}
                onClose={() => setSelectedAction(null)}
                title="Available Training Programs"
                size="lg"
            >
                <div className="space-y-4">
                    {[
                        { name: 'Teaching Excellence Workshop', desc: 'Interactive workshop on modern teaching methodologies', date: '2025-11-08', slots: '15/30', time: '9:00 AM - 4:00 PM' },
                        { name: 'AI in Education Seminar', desc: 'Exploring AI applications in educational settings', date: '2025-11-20', slots: '30/50', time: '2:00 PM - 5:00 PM' }
                    ].map((training, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{training.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">{training.desc}</div>
                                </div>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm ml-4">
                                    Register
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                                <span>📅 {training.date}</span>
                                <span>👥 {training.slots} slots</span>
                                <span>⏰ {training.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={selectedAction === 'document'}
                onClose={() => setSelectedAction(null)}
                title="Request Document"
                size="md"
            >
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { name: 'New Request', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                        { name: 'Certificate', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                        { name: 'Leave Request', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { name: 'Other Documents', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' }
                    ].map((doc, i) => (
                        <button key={i} className="p-5 border border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all text-center">
                            <svg className="w-8 h-8 mx-auto mb-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={doc.icon} />
                            </svg>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
}