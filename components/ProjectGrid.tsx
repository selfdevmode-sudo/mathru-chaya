"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { projectMetaLine, typeLabel } from "@/lib/format";

export default function ProjectGrid({
  projects,
  types,
}: {
  projects: Project[];
  types: string[];
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
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              type="button"
              className={`filter-btn${active === type ? " is-active" : ""}`}
              onClick={() => setActive(type)}
            >
              {typeLabel(type)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid">
        {visible.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="card"
          >
            <div className={`card__photo${project.photos[0] ? "" : " placeholder"}`}>
              {project.photos[0] ? (
                <img src={project.photos[0]} alt={project.title} />
              ) : (
                <span>🛕</span>
              )}
            </div>
            <div className="card__body">
              <h3>{project.title}</h3>
              {projectMetaLine(project) ? (
                <p className="card__meta">{projectMetaLine(project)}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
