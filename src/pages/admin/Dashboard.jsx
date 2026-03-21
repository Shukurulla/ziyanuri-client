import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiNewspaper, HiCollection, HiGlobe, HiMail } from "react-icons/hi";
import api from "../../api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ news: 0, projects: 0, heritage: 0, feedback: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/news/admin/all").then((r) => r.data.length).catch(() => 0),
      api.get("/projects").then((r) => r.data.length).catch(() => 0),
      api.get("/heritage").then((r) => r.data.length).catch(() => 0),
      api.get("/feedback").then((r) => r.data.length).catch(() => 0),
    ]).then(([news, projects, heritage, feedback]) => {
      setCounts({ news, projects, heritage, feedback });
    });
  }, []);

  const cards = [
    { label: "Yangiliklar", count: counts.news, icon: HiNewspaper, to: "/admin/news", color: "bg-blue-500" },
    { label: "Loyihalar", count: counts.projects, icon: HiCollection, to: "/admin/projects", color: "bg-green-500" },
    { label: "Meros", count: counts.heritage, icon: HiGlobe, to: "/admin/heritage", color: "bg-purple-500" },
    { label: "Xabarlar", count: counts.feedback, icon: HiMail, to: "/admin/feedback", color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{c.label}</p>
                <p className="text-3xl font-bold mt-1">{c.count}</p>
              </div>
              <div className={`${c.color} p-3 rounded-xl text-white`}>
                <c.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
