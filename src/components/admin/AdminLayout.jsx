import { useEffect, useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import {
  HiHome, HiNewspaper, HiDocument, HiPhotograph,
  HiUserGroup, HiCollection, HiGlobe, HiFilm,
  HiCalendar, HiMail, HiChartBar, HiLogout, HiMenu, HiX, HiTag,
} from "react-icons/hi";
import api from "../../api";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: HiHome, end: true },
  { to: "/admin/news", label: "Yangiliklar", icon: HiNewspaper },
  { to: "/admin/pages", label: "Sahifalar", icon: HiDocument },
  { to: "/admin/banners", label: "Bannerlar", icon: HiPhotograph },
  { to: "/admin/leaders", label: "Rahbariyat", icon: HiUserGroup },
  { to: "/admin/projects", label: "Loyihalar", icon: HiCollection },
  { to: "/admin/heritage", label: "Meros", icon: HiGlobe },
  { to: "/admin/media", label: "Media", icon: HiFilm },
  { to: "/admin/events", label: "Tadbirlar", icon: HiCalendar },
  { to: "/admin/categories", label: "Kategoriyalar", icon: HiTag },
  { to: "/admin/feedback", label: "Xabarlar", icon: HiMail },
  { to: "/admin/stats", label: "Statistika", icon: HiChartBar },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/admin/login"); return; }
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => navigate("/admin/login"));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#0f1117] transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-accent-500/30">ZN</div>
          <div>
            <span className="font-bold text-white text-sm block">Ziya Nuri</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        <nav className="px-3 mt-2 space-y-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  isActive ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.name}</p>
              <p className="text-white/30 text-[10px]">{user.role}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
            <HiLogout className="w-4 h-4" /> Chiqish
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between lg:px-6 sticky top-0 z-20">
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <HiMenu className="w-6 h-6" />
          </button>
          <div />
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-gray-400 hover:text-primary-500 transition-colors">Saytni ko'rish</Link>
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 text-xs font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
