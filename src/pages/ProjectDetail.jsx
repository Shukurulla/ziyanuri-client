import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState(null);
  const lang = i18n.language;

  useEffect(() => {
    api.get(`/projects/${slug}`).then((r) => setProject(r.data)).catch(() => {});
  }, [slug]);

  if (!project) return <div className="py-20 text-center text-gray-400">{t("common.loading")}</div>;

  const tr = project.translations?.find((t) => t.lang === lang) || project.translations?.[0];

  return (
    <div className="py-12">
      <div className="container-main max-w-4xl">
        <Link to="/projects" className="text-primary-500 hover:underline text-sm mb-4 block">
          ← {t("common.back")}
        </Link>
        <h1 className="text-3xl font-bold text-primary-700 mb-6">{tr?.title || "—"}</h1>
        {project.image && (
          <img src={project.image} alt="" className="w-full rounded-xl mb-8 max-h-[400px] object-cover" />
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tr?.description || "" }} />
        {tr?.results && (
          <div className="mt-8 p-6 bg-green-50 rounded-xl">
            <h3 className="font-bold text-lg text-green-800 mb-3">Natijalar</h3>
            <div dangerouslySetInnerHTML={{ __html: tr.results }} />
          </div>
        )}
      </div>
    </div>
  );
}
