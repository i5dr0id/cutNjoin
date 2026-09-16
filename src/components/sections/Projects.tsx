import { ArrowLink, PlayButton, SanityImage, Section, SprocketRail } from "@/components/primitives";
import { formatTimecode } from "@/lib/format";
import { routes, sections } from "@/lib/site";
import { ProjectsCarousel } from "./ProjectsCarousel";
import type { HomePage, Project } from "./types";

const FRAMES_PER_TILE = 24;
const labelRow = "flex w-max min-w-full bg-strip-3 px-8 py-[3px]";
const labelCell =
  "w-[480px] shrink-0 text-center font-mono text-[9px] leading-[13.5px] tracking-[2.25px] text-fg/13";

const frameRange = (index: number) => {
  const pad = (n: number) => String(n).padStart(4, "0");
  return `FRAME ${pad(index * FRAMES_PER_TILE + 1)}–${pad((index + 1) * FRAMES_PER_TILE)}`;
};

function ProjectTile({ project }: { project: Project }) {
  return (
    <article className="flex w-[480px] shrink-0 snap-start flex-col border-r-2 border-fg/12 bg-bg last:border-r-0">
      <div className="relative h-[299px] overflow-hidden">
        <SanityImage image={project.still} fill sizes="480px" className="object-cover" />
        <PlayButton
          href={project.videoUrl}
          label={`Play ${project.title}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <p className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgb(6_6_6/0.9)] to-transparent px-4 py-2 font-mono text-[9px] leading-[13.5px] tracking-[0.9px] text-fg/27 uppercase">
          {project.timecode && `${formatTimecode(project.timecode)} — `}
          {project.category}
        </p>
      </div>
      <div className="p-4">
        <p className="font-mono text-[10px] leading-[15px] tracking-[2.5px] text-fg/31 uppercase">
          {project.category}
        </p>
        <h3 className="pt-2 text-base leading-6 font-semibold tracking-[-0.4px]">{project.title}</h3>
      </div>
    </article>
  );
}

export function Projects({ page, projects }: { page: HomePage; projects: Project[] }) {
  return (
    <Section
      id={sections.projects}
      eyebrow={page.projects.eyebrow}
      heading={page.projects.heading}
      divider
      bleed
      contentGap="mt-12"
      action={
        page.projects.linkLabel && (
          <ArrowLink href={routes.projects} variant="link">
            {page.projects.linkLabel}
          </ArrowLink>
        )
      }
    >
      <ProjectsCarousel titles={projects.map((p) => p.title)} rail={<SprocketRail />}>
        <div aria-hidden className={`${labelRow} border-b border-line-soft`}>
          {projects.map((project, index) => (
            <span key={project._id} className={labelCell}>
              {frameRange(index)}
            </span>
          ))}
        </div>
        <div className="flex h-[379px] w-max min-w-full bg-strip-4 px-8">
          {projects.map((project) => (
            <ProjectTile key={project._id} project={project} />
          ))}
        </div>
        <div aria-hidden className={`${labelRow} border-t border-line-soft`}>
          {projects.map((project, index) => (
            <span key={project._id} className={labelCell}>
              ◆ {String(index + 1).padStart(2, "0")} ◆
            </span>
          ))}
        </div>
      </ProjectsCarousel>
    </Section>
  );
}
