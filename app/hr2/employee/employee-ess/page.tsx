'use client';

import { useState, useEffect } from 'react';

interface ESSRequest {
    _id: string;
    type: string;
    reason: string;
    status: string;
    createdAt: string;
    processedAt?: string;
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export default function ESSPage() {
    const [requests, setRequests] = useState<ESSRequest[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ type: 'Certificate of Employment', reason: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/hr2/api/employee/ess');
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests || []);
                setStats(data.stats || stats);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.reason.trim()) return alert('Please provide a reason');
        setSubmitting(true);
        try {
            const res = await fetch('/hr2/api/employee/ess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ type: 'Certificate of Employment', reason: '' });
                fetchRequests();
                alert('Request submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            Approved: 'bg-green-100 text-green-700',
            Pending: 'bg-orange-100 text-orange-700',
            Rejected: 'bg-red-100 text-red-700',
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">New Request</h2>
                        <form onSubmit={submitRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Request Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                    <option>Certificate of Employment</option>
                                    <option>Training Certificate</option>
                                    <option>Leave Request</option>
                                    <option>Other Documents</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Reason</label>
                                <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Explain why you need this document..." required />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">Employee Self-Service</h1>
                <p className="text-gray-600 mt-1">Manage your document requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200"><p className="text-sm font-bold text-purple-900">Total Requests</p><p className="text-3xl font-bold text-gray-900">{stats.total}</p></div>
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200"><p className="text-sm font-bold text-orange-900">Pending</p><p className="text-3xl font-bold text-gray-900">{stats.pending}</p></div>
                <div className="bg-green-50 rounded-lg p-6 border border-green-200"><p className="text-sm font-bold text-green-900">Approved</p><p className="text-3xl font-bold text-gray-900">{stats.approved}</p></div>
                <div className="bg-red-50 rounded-lg p-6 border border-red-200"><p className="text-sm font-bold text-red-900">Rejected</p><p className="text-3xl font-bold text-gray-900">{stats.rejected}</p></div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Certificate of Employment', 'Training Certificate', 'Leave Request', 'Other Documents'].map((type) => (
                        <button key={type} onClick={() => { setFormData({ type, reason: '' }); setShowModal(true); }} className="p-4 border-2 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 text-center">
                            <div className="font-bold text-gray-900">{type}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-lg shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Your Requests</h3>
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">New Request</button>
                </div>
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <p className="text-center text-gray-700 py-8">No requests yet. Click "New Request" to submit one.</p>
                    ) : (
                        requests.map((req) => (
                            <div key={req._id} className="border rounded-lg p-4 hover:border-indigo-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-gray-900">{req.type}</h4>
                                            {getStatusBadge(req.status)}
                                        </div>
                                        <p className="text-sm text-gray-800 mb-2">{req.reason}</p>
                                        <p className="text-xs font-medium text-gray-700">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                                        {req.processedAt && <p className="text-xs font-medium text-green-700">Processed: {new Date(req.processedAt).toLocaleDateString()}</p>}
                                    </div>
                                    {req.status === 'Approved' && (
                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Download</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
