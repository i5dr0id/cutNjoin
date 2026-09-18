import type { Metadata } from "next";
import { Container, PlayButton, SectionEyebrow } from "@/components/primitives";
import { ProjectPoster } from "@/components/sections/ProjectPoster";
import { VideoLightbox } from "@/components/sections/VideoLightbox";
import { formatTimecode } from "@/lib/format";
import { routes } from "@/lib/site";
import { getProjects } from "@/sanity/fetch";

export const metadata: Metadata = {
  title: "Projects",
  description: "Films, documentaries, music videos and commercials finished at CUT&JOIN Studios in Lagos.",
  alternates: { canonical: routes.projects },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Container className="pt-40 pb-24">
      <div className="max-w-[720px]">
        <SectionEyebrow label="Featured Work" />
        <h1 className="pt-4 text-heading font-bold uppercase">Projects</h1>
        <p className="pt-6 text-lg leading-[28.67px] text-fg/66">
          Feature films, documentaries, music videos and commercials cut, graded and finished in Lagos.
        </p>
      </div>

      <div className="grid gap-x-6 gap-y-10 pt-16 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project._id} className="group flex flex-col">
            <div className="relative aspect-video overflow-hidden bg-card">
              <ProjectPoster
                still={project.still}
                title={project.title}
                category={project.category}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              {project.videoUrl ? (
                <VideoLightbox
                  url={project.videoUrl}
                  label={`Play ${project.title}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              ) : (
                <PlayButton
                  label={`Play ${project.title}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </div>
            <div className="flex items-baseline justify-between gap-4 pt-4">
              <div>
                <p className="font-mono text-[10px] leading-[15px] tracking-[2.5px] text-fg/55 uppercase">
                  {project.category}
                </p>
                <h2 className="pt-2 text-base leading-6 font-semibold tracking-[-0.4px]">{project.title}</h2>
              </div>
              {project.timecode && (
                <span className="font-mono text-[10px] leading-[15px] tracking-[1px] text-fg/40">
                  {formatTimecode(project.timecode)}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
