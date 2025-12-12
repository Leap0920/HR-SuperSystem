"use client";

import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    // Sample data
    const applicantsTrend = [
        { month: 'Jan', applications: 65, hired: 20 },
        { month: 'Feb', applications: 75, hired: 25 },
        { month: 'Mar', applications: 60, hired: 18 },
        { month: 'Apr', applications: 85, hired: 30 },
        { month: 'May', applications: 90, hired: 35 },
        { month: 'Jun', applications: 95, hired: 40 },
    ];

    const departmentData = [
        { dept: 'IT', completed: 85 },
        { dept: 'HR', completed: 65 },
        { dept: 'Finance', completed: 45 },
        { dept: 'Operations', completed: 30 },
    ];

    const completionData = [
        { name: 'Completed', value: 68, fill: '#10b981' },
        { name: 'In Progress', value: 20, fill: '#f59e0b' },
        { name: 'Pending', value: 12, fill: '#ef4444' },
    ];

    const monthlyHires = [
        { month: 'Jul', hired: 25, target: 30 },
        { month: 'Aug', hired: 32, target: 30 },
        { month: 'Sep', hired: 28, target: 30 },
        { month: 'Oct', hired: 35, target: 30 },
    ];

    const StatCard = ({ icon: Icon, label, value, change, bgColor }: { icon: React.ComponentType<{ className: string }>; label: string; value: string; change: string; bgColor: string }) => (
        <div className={`${bgColor} rounded-lg p-6 text-gray-900`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium opacity-80">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <Icon className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-xs opacity-70">{change}</p>
        </div>
    );

    return (
        <div className="w-full bg-gray-50 p-8 max-h-screen overflow-y-scroll">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track your recruitment and hiring metrics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        label="Total Applications"
                        value="353"
                        change="↑ 12% from last month"
                        bgColor="bg-purple-100"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Approval Rate"
                        value="23.2%"
                        change="↑ 2.1% from last month"
                        bgColor="bg-blue-100"
                    />
                    <StatCard
                        icon={Briefcase}
                        label="Open Positions"
                        value="22"
                        change="↓ 3 positions filled"
                        bgColor="bg-yellow-100"
                    />
                    <StatCard
                        icon={Clock}
                        label="Avg Response Time"
                        value="31.5h"
                        change="↓ 5h faster"
                        bgColor="bg-pink-100"
                    />
                </div>

                {/* Second Row Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Active Job Postings</p>
                        <p className="text-3xl font-bold mt-2">15</p>
                        <p className="text-xs opacity-70 mt-3">See all jobs</p>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Interview Scheduled</p>
                        <p className="text-3xl font-bold mt-2">28</p>
                        <p className="text-xs opacity-70 mt-3">View list</p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Pending Review</p>
                        <p className="text-3xl font-bold mt-2">14</p>
                        <p className="text-xs opacity-70 mt-3">Review now</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Candidates Hired</p>
                        <p className="text-3xl font-bold mt-2">87%</p>
                        <p className="text-xs opacity-70 mt-3">View details</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Line Chart */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications & Hiring Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={applicantsTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="applications" stroke="#8b5cf6" />
                                <Line type="monotone" dataKey="hired" stroke="#10b981" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Completion Rate</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dept" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="completed" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Rate</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={completionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Activities */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                        <div className="space-y-3">
                            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3 border-l-4 border-blue-500">
                                <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900">New Application Received</p>
                                    <p className="text-sm text-gray-600">John Smith applied for Senior Developer</p>
                                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3 border-l-4 border-green-500">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900">Interview Completed</p>
                                    <p className="text-sm text-gray-600">Sarah Johnson - Position: Marketing Manager</p>
                                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                                </div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4 flex items-start gap-3 border-l-4 border-yellow-500">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900">Pending Review</p>
                                    <p className="text-sm text-gray-600">12 applications awaiting initial screening</p>
                                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-purple-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Overall Completion</p>
                        <p className="text-4xl font-bold mt-4">87%</p>
                        <p className="text-xs opacity-70 mt-3">All recruitment processes</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Candidates Onboarded</p>
                        <p className="text-4xl font-bold mt-4">92%</p>
                        <p className="text-xs opacity-70 mt-3">Successfully onboarded this quarter</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Avg Time to Hire</p>
                        <p className="text-4xl font-bold mt-4">28d</p>
                        <p className="text-xs opacity-70 mt-3">Down from 35 days last quarter</p>
                    </div>
                </div>
            </div>
        </div>
    );
}