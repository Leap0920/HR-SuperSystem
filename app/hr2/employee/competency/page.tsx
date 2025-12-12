'use client';

import { useState } from 'react';
import Modal from '../modal';

export default function CompetencyPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [filter, setFilter] = useState('all');
    const [selectedSkill, setSelectedSkill] = useState<any>(null);

    const skills = [
        {
            name: 'Programming',
            category: 'Technical Skills',
            level: 'Advanced',
            progress: 85,
            lastAssessed: '2024-11-01',
            color: 'green'
        },
        {
            name: 'Database Management',
            category: 'Technical Skills',
            level: 'Intermediate',
            progress: 60,
            lastAssessed: '2024-10-15',
            color: 'blue'
        },
        {
            name: 'Communication',
            category: 'Soft Skills',
            level: null,
            progress: 0,
            lastAssessed: null,
            color: 'gray'
        },
        {
            name: 'Project Management',
            category: 'Soft Skills',
            level: null,
            progress: 0,
            lastAssessed: null,
            color: 'gray'
        }
    ];

    const filteredSkills = filter === 'all'
        ? skills
        : filter === 'pending'
            ? skills.filter(s => !s.level)
            : skills.filter(s => s.level);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Overall Competency</span>
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">69%</div>
                    <div className="w-full bg-purple-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '69%' }}></div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Competent Skills</span>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">2/4</div>
                    <div className="text-sm text-gray-600">Skills Assessed</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Needs Development</span>
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                    <div className="text-sm text-gray-600">Skills to Improve</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="border-b border-gray-200">
                    <div className="flex gap-1 p-2">
                        {[
                            { id: 'overview', label: 'Skills Overview' },
                            { id: 'assessment', label: 'Take Assessment' },
                            { id: 'results', label: 'Assessment Results' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Your Skills</h3>
                                    <p className="text-sm text-gray-600">Track your competency levels</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setFilter('pending')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Pending Assessment
                                    </button>
                                    <button
                                        onClick={() => setFilter('completed')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Completed
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredSkills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-lg font-semibold text-gray-900">{skill.name}</h4>
                                                    {skill.level && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${skill.level === 'Advanced' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {skill.level}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{skill.category}</p>
                                                {skill.lastAssessed && (
                                                    <p className="text-xs text-gray-500 mt-1">Last assessed: {skill.lastAssessed}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedSkill(skill)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            >
                                                {skill.level ? 'Reassess' : 'Assess'}
                                            </button>
                                        </div>

                                        {skill.progress > 0 && (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-semibold text-gray-900">{skill.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${skill.progress >= 80 ? 'bg-green-600' : 'bg-indigo-600'
                                                            }`}
                                                        style={{ width: `${skill.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'assessment' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Assessment</h3>
                            <p className="text-sm text-gray-600 mb-6">Choose a skill to assess your competency level</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {skills.filter(s => !s.level).map((skill, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
                                        <h4 className="font-semibold text-gray-900 mb-2">{skill.name}</h4>
                                        <p className="text-sm text-gray-600 mb-4">{skill.category}</p>
                                        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                            Start Assessment
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {skills.filter(s => !s.level).length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-600">All skills have been assessed. Great job!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Results</h3>
                            <p className="text-sm text-gray-600 mb-6">View your completed assessments and scores</p>

                            <div className="space-y-4">
                                {skills.filter(s => s.level).map((skill, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                                                <p className="text-sm text-gray-600">{skill.category}</p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${skill.level === 'Advanced' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {skill.level}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-600">Score</span>
                                            <span className="font-semibold text-gray-900">{skill.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <div
                                                className={`h-2 rounded-full ${skill.progress >= 80 ? 'bg-green-600' : 'bg-indigo-600'}`}
                                                style={{ width: `${skill.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500">Assessed on {skill.lastAssessed}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Skill Detail Modal */}
            {selectedSkill && (
                <Modal
                    isOpen={!!selectedSkill}
                    onClose={() => setSelectedSkill(null)}
                    title={`${selectedSkill.name} Assessment`}
                    size="md"
                >
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Current Level</span>
                                {selectedSkill.level ? (
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedSkill.level === 'Advanced' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {selectedSkill.level}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-500">Not assessed</span>
                                )}
                            </div>
                            {selectedSkill.progress > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${selectedSkill.progress >= 80 ? 'bg-green-600' : 'bg-indigo-600'}`}
                                        style={{ width: `${selectedSkill.progress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-3">
                                This assessment will evaluate your knowledge and skills in {selectedSkill.name}.
                                It consists of multiple-choice questions and practical scenarios.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Duration: 30-45 minutes
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    20 questions
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Passing score: 70%
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setSelectedSkill(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Starting assessment for', selectedSkill.name);
                                    setSelectedSkill(null);
                                }}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Start Assessment
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}