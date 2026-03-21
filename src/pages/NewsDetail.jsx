import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";

export default function NewsDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState(null);
  const lang = i18n.language;

  useEffect(() => {
    api.get(`/news/${slug}`).then((r) => setNews(r.data)).catch(() => {});
  }, [slug]);

  if (!news) return <div className="py-20 text-center text-gray-400">{t("common.loading")}</div>;

  const tr = news.translations?.find((t) => t.lang === lang) || news.translations?.[0];

  return (
    <div className="py-12">
      <div className="container-main max-w-4xl">
        <Link to="/" className="text-primary-500 hover:underline text-sm mb-4 block">
          ← {t("common.back")}
        </Link>
        {news.publishedAt && (
          <span className="text-sm text-gray-500">
            {new Date(news.publishedAt).toLocaleDateString()}
          </span>
        )}
        <h1 className="text-3xl font-bold text-primary-700 mb-6">{tr?.title || "—"}</h1>
        {news.image && (
          <img src={news.image} alt="" className="w-full rounded-xl mb-8 max-h-[400px] object-cover" />
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tr?.content || "" }} />
      </div>
    </div>
  );
}
