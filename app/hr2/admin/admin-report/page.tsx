// app/hr2/reports/page.tsx
import { FileText, Download, Calendar, Search } from "lucide-react";
import  StatCard  from "@/components/ui/statcard";
// In your page.tsx
async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/hr2/api/admin/reports`, {
    credentials: "include",
  });
  return res.json();
}
export default async function ReportsPage() {
    const data = await getData();
  const reports = data.reports || [];     // ← extract the array
  const stats = data.stats || {};         // ← optional: for dynamic stats later
  
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                <p className="text-gray-600 mb-8">Generate and download HR2 system reports</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Reports Generated" value={22} icon={<FileText />} color="purple" />
                    <StatCard title="This Month" value={0} subtitle="Recent Reports" icon={<Calendar />} color="blue" />
                    <StatCard title="Report Types" value={6} subtitle="Categories" icon={<FileText />} color="green" />
                    <StatCard title="Departments Covered" value={3} subtitle="CS, IT, IS" icon={<Download />} color="yellow" />
                </div>

                {/* Generate Button */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-6">Generate New Report</h2>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-4 rounded-xl flex items-center gap-3 transition">
                        <FileText className="w-5 h-5" /> Generate Report
                    </button>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-xl font-semibold mb-6">Recent Reports</h2>
                    <div className="flex items-center gap-4 mb-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <select className="px-4 py-3 border rounded-xl">
                            <option>Newest First</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        {reports.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No reports generated yet.</p>
                        ) : (
                            reports.map((r: any) => (
                                <div key={r._id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{r.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(r.createdAt).toLocaleDateString()} by {r.generatedBy} •{" "}
                                                <span className="text-purple-600">{r.type}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
