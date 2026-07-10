"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { projectMetaLine, typeLabel } from "@/lib/format";
import { localizedHref } from "@/lib/paths";
import KalyaniMark from "@/components/KalyaniMark";

export default function ProjectGrid({
  projects,
  types,
  lang,
  allLabel,
}: {
  projects: Project[];
  types: string[];
  lang: Lang;
  allLabel: string;
}) {
  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all" ? projects : projects.filter((p) => p.type === active);

  return (
    <>
      {types.length > 1 ? (
        <div className="filter-row">
          <button
            type="button"
            className={`filter-btn${active === "all" ? " is-active" : ""}`}
            onClick={() => setActive("all")}
          >
            {allLabel}
          </button>
          {types.map((type) => (
            <button
              key={type}
              type="button"
              className={`filter-btn${active === type ? " is-active" : ""}`}
              onClick={() => setActive(type)}
            >
              {typeLabel(type, lang)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid">
        {visible.map((project) => (
          <a
            key={project.id}
            href={localizedHref(lang, `/projects/${project.slug}`)}
            className="card"
          >
            <div className={`card__photo${project.photos[0] ? "" : " placeholder"}`}>
              {project.photos[0] ? (
                <img src={project.photos[0]} alt={project.title} />
              ) : (
                <KalyaniMark size={44} />
              )}
            </div>
            <div className="card__body">
              <h3>{project.title}</h3>
              {projectMetaLine(project, lang) ? (
                <p className="card__meta">{projectMetaLine(project, lang)}</p>
              ) : null}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
