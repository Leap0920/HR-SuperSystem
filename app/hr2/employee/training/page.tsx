'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

interface Training {
    _id: string;
    title: string;
    type: string;
    description?: string;
    date: string;
    time?: string;
    location?: string;
    maxParticipants: number;
    registrations: string[];
    status: string;
    rating?: number;
}

interface Stats {
    total: number;
    upcoming: number;
    completed: number;
    totalRegistrations: number;
}

export default function TrainingPage() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, upcoming: 0, completed: 0, totalRegistrations: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [registering, setRegistering] = useState<string | null>(null);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const res = await fetch('/hr2/api/admin/training');
            if (res.ok) {
                const data = await res.json();
                setTrainings(data.trainings || []);
                setStats(data.stats || stats);
            }
        } catch (error) {
            console.error('Error fetching trainings:', error);
        } finally {
            setLoading(false);
        }
    };

    const registerForTraining = async (trainingId: string) => {
        setRegistering(trainingId);
        try {
            const res = await fetch('/hr2/api/employee/training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: trainings.find(t => t._id === trainingId)?.title, type: 'Workshop' }),
            });
            if (res.ok) {
                alert('Successfully registered for training!');
                fetchTrainings();
            }
        } catch (error) {
            console.error('Error registering:', error);
        } finally {
            setRegistering(null);
        }
    };

    const filteredTrainings = trainings.filter(t => {
        if (activeTab === 'all') return true;
        if (activeTab === 'upcoming') return t.status === 'Upcoming';
        if (activeTab === 'completed') return t.status === 'Completed';
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Training Programs</h1>
                <p className="text-gray-600 mt-1">Browse and register for available training programs</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <p className="text-sm font-bold text-purple-900">Total Programs</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-sm font-bold text-blue-900">Upcoming</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <p className="text-sm font-bold text-green-900">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <p className="text-sm font-bold text-orange-900">Total Registrations</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-2">
                {['all', 'upcoming', 'completed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        {tab === 'all' ? 'All Programs' : tab}
                    </button>
                ))}
            </div>

            {/* Training List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTrainings.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 col-span-2">No training programs found</p>
                ) : (
                    filteredTrainings.map((training) => (
                        <div key={training._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${training.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : training.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {training.status}
                                    </span>
                                </div>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{training.type}</span>
                            </div>
                            {training.description && <p className="text-sm text-gray-600 mb-4">{training.description}</p>}
                            <div className="space-y-2 text-sm text-gray-800 mb-4">
                                <div className="flex items-center gap-2"><Calendar size={16} /><span className="font-medium">{new Date(training.date).toLocaleDateString()}</span></div>
                                {training.time && <div className="flex items-center gap-2"><Clock size={16} /><span className="font-medium">{training.time}</span></div>}
                                {training.location && <div className="flex items-center gap-2"><MapPin size={16} /><span className="font-medium">{training.location}</span></div>}
                                <div className="flex items-center gap-2"><Users size={16} /><span className="font-medium">{training.registrations?.length || 0}/{training.maxParticipants} registered</span></div>
                            </div>
                            {training.status === 'Upcoming' && (
                                <button
                                    onClick={() => registerForTraining(training._id)}
                                    disabled={registering === training._id}
                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {registering === training._id ? 'Registering...' : 'Register Now'}
                                </button>
                            )}
                            {training.status === 'Completed' && training.rating && (
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span>⭐</span><span className="font-bold">{training.rating}/5</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
