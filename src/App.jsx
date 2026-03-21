import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Heritage from "./pages/Heritage";
import HeritageDetail from "./pages/HeritageDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import MediaLibrary from "./pages/MediaLibrary";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminPages from "./pages/admin/AdminPages";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminLeaders from "./pages/admin/AdminLeaders";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminHeritage from "./pages/admin/AdminHeritage";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminStats from "./pages/admin/AdminStats";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/heritage/:slug" element={<HeritageDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/media" element={<MediaLibrary />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="leaders" element={<AdminLeaders />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="heritage" element={<AdminHeritage />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="stats" element={<AdminStats />} />
      </Route>
    </Routes>
  );
}
