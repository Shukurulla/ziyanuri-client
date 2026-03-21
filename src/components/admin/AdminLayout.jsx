import { useEffect, useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import {
  HiHome, HiNewspaper, HiDocument, HiPhotograph,
  HiUserGroup, HiCollection, HiGlobe, HiFilm,
  HiCalendar, HiMail, HiChartBar, HiLogout, HiMenu, HiX,
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
  { to: "/admin/feedback", label: "Xabarlar", icon: HiMail },
  { to: "/admin/stats", label: "Statistika", icon: HiChartBar },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => navigate("/admin/login"));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-900 text-white transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center font-bold">ZN</div>
            <span className="font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? "bg-white/15 text-white" : "text-gray-300 hover:bg-white/10"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 text-gray-300 hover:text-white text-sm w-full px-3 py-2">
            <HiLogout size={18} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between lg:px-6">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <HiMenu size={24} />
          </button>
          <div className="text-sm text-gray-600">
            {user.name} ({user.role})
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
