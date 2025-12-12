// app/hr2/competency/page.tsx
import StatCard from "@/components/ui/statcard";


export default function CompetencyPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Competency Management (Admin)</h1>
                <p className="text-gray-700 mb-8">Manage employee competencies and standards</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <StatCard title="Total Employees" value={6} subtitle="in system" color="purple" />
                    <StatCard title="Competent" value={4} subtitle="meet standards" color="green" />
                    <StatCard title="Needs Improvement" value={1} subtitle="require training" color="yellow" />
                    <StatCard title="Average Score" value="71%" subtitle="organization-wide" color="blue" />
                    <StatCard title="Competency Evaluation" value={6} subtitle="need evaluation" color="orange" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">Top Performers</h2>
                        {["Dr. Sarah Johnson (95%)", "Maria Santos (92%)", "Prof. Michael Chen (88%)"].map((p) => (
                            <div key={p} className="py-3 border-b last:border-0 flex justify-between">
                                <span className="text-gray-900 font-medium">{p.split(" (")[0]}</span>
                                <span className="text-xl font-bold text-green-600">{p.match(/\d+%/)![0]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">Needs Attention</h2>
                        <div className="py-3 flex justify-between">
                            <span className="text-gray-900 font-medium">Pedro Garcia</span>
                            <span className="text-2xl font-bold text-yellow-600">65%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Competency Evaluation</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-gray-800">
                                <th className="py-3 font-semibold">Name</th>
                                <th className="py-3 font-semibold">Department/Program</th>
                                <th className="py-3 font-semibold">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: "Dr. Sarah Johnson", dept: "Computer Science", role: "Lecturer" },
                                { name: "Prof. Michael Chen", dept: "Information Technology", role: "Instructor" },
                                { name: "Pedro Garcia", dept: "Computer Science", role: "Laboratory Facilitator" },
                            ].map((e) => (
                                <tr key={e.name} className="border-b">
                                    <td className="py-4 text-gray-900 font-medium">{e.name}</td>
                                    <td className="py-4 text-gray-800">{e.dept}</td>
                                    <td className="py-4 text-gray-800">{e.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}