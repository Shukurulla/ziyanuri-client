import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";

export default function EventDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const lang = i18n.language;

  useEffect(() => {
    api.get(`/events/${slug}`).then((r) => setEvent(r.data)).catch(() => {});
  }, [slug]);

  if (!event) return <div className="py-20 text-center text-gray-400">{t("common.loading")}</div>;

  const tr = event.translations?.find((t) => t.lang === lang) || event.translations?.[0];

  return (
    <div className="py-12">
      <div className="container-main max-w-4xl">
        <Link to="/events" className="text-primary-500 hover:underline text-sm mb-4 block">
          ← {t("common.back")}
        </Link>
        {event.date && (
          <span className="text-sm text-primary-500 font-medium">
            {new Date(event.date).toLocaleDateString()}
          </span>
        )}
        <h1 className="text-3xl font-bold text-primary-700 mb-6">{tr?.title || "—"}</h1>
        {event.image && (
          <img src={event.image} alt="" className="w-full rounded-xl mb-8 max-h-[400px] object-cover" />
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tr?.description || "" }} />
      </div>
    </div>
  );
}
