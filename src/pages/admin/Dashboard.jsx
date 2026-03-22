import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiNewspaper, HiCollection, HiGlobe, HiMail,
  HiCalendar, HiPhotograph, HiUserGroup, HiChartBar,
  HiArrowRight,
} from "react-icons/hi";
import api from "../../api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ news: 0, projects: 0, heritage: 0, feedback: 0, events: 0, media: 0 });
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/news/admin/all").then((r) => r.data.length).catch(() => 0),
      api.get("/projects").then((r) => r.data.length).catch(() => 0),
      api.get("/heritage").then((r) => r.data.length).catch(() => 0),
      api.get("/feedback").then((r) => r.data.length).catch(() => 0),
      api.get("/events").then((r) => r.data.length).catch(() => 0),
      api.get("/media").then((r) => r.data.length).catch(() => 0),
    ]).then(([news, projects, heritage, feedback, events, media]) => {
      setCounts({ news, projects, heritage, feedback, events, media });
    });
    api.get("/news?limit=5").then((r) => setRecentNews(r.data?.data || r.data || [])).catch(() => {});
  }, []);

  const cards = [
    { label: "Yangiliklar", count: counts.news, icon: HiNewspaper, to: "/admin/news", gradient: "from-blue-500 to-blue-600" },
    { label: "Loyihalar", count: counts.projects, icon: HiCollection, to: "/admin/projects", gradient: "from-emerald-500 to-emerald-600" },
    { label: "Meros", count: counts.heritage, icon: HiGlobe, to: "/admin/heritage", gradient: "from-purple-500 to-purple-600" },
    { label: "Tadbirlar", count: counts.events, icon: HiCalendar, to: "/admin/events", gradient: "from-orange-500 to-orange-600" },
    { label: "Media", count: counts.media, icon: HiPhotograph, to: "/admin/media", gradient: "from-pink-500 to-pink-600" },
    { label: "Xabarlar", count: counts.feedback, icon: HiMail, to: "/admin/feedback", gradient: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ziya Nuri boshqaruv paneli</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-11 h-11 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent News */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">So'nggi yangiliklar</h2>
            <Link to="/admin/news" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              Barchasi <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentNews.slice(0, 5).map((n) => (
              <div key={n._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                {n.image ? (
                  <img src={n.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <HiNewspaper className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{n.translations?.[0]?.title || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ""}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${n.published ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                  {n.published ? "Nashr" : "Qoralama"}
                </span>
              </div>
            ))}
            {recentNews.length === 0 && <p className="px-6 py-8 text-center text-gray-300 text-sm">Yangiliklar yo'q</p>}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Tezkor havolalar</h2>
          <div className="space-y-2">
            {[
              { to: "/admin/news", label: "Yangilik qo'shish", icon: HiNewspaper, color: "text-blue-500" },
              { to: "/admin/banners", label: "Banner boshqarish", icon: HiPhotograph, color: "text-pink-500" },
              { to: "/admin/leaders", label: "Rahbariyat", icon: HiUserGroup, color: "text-purple-500" },
              { to: "/admin/stats", label: "Statistika", icon: HiChartBar, color: "text-emerald-500" },
              { to: "/admin/feedback", label: "Xabarlarni ko'rish", icon: HiMail, color: "text-amber-500" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                <l.icon className={`w-5 h-5 ${l.color}`} />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{l.label}</span>
                <HiArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
