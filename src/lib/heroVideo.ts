export type HeroVideoSource =
  { kind: "file"; src: string } | { kind: "embed"; provider: "youtube" | "vimeo"; id: string };

type HeroVideoInput = {
  heroVideo?: { url?: string | null; contentType?: string | null } | null;
  heroVideoUrl?: string | null;
};

const youtubeHosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"];

function parseEmbed(link: string): HeroVideoSource | null {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  if (youtubeHosts.includes(url.hostname)) {
    const id = url.hostname.endsWith("youtu.be")
      ? url.pathname.slice(1)
      : (url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1) ?? "");
    return /^[\w-]{6,20}$/.test(id) ? { kind: "embed", provider: "youtube", id } : null;
  }
  if (url.hostname.endsWith("vimeo.com")) {
    const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    return /^\d+$/.test(id) ? { kind: "embed", provider: "vimeo", id } : null;
  }
  return null;
}

export function heroVideoSource(page: HeroVideoInput): HeroVideoSource | null {
  if (page.heroVideo?.url) return { kind: "file", src: page.heroVideo.url };
  return page.heroVideoUrl ? parseEmbed(page.heroVideoUrl) : null;
}

type EmbedOptions = { autoplay?: boolean; muted?: boolean; loop?: boolean; controls?: boolean };

export function embedUrl(source: Extract<HeroVideoSource, { kind: "embed" }>, options: EmbedOptions = {}) {
  const { autoplay = true, muted = false, loop = false, controls = true } = options;
  const flag = (value: boolean) => (value ? "1" : "0");
  if (source.provider === "youtube") {
    const params = new URLSearchParams({
      autoplay: flag(autoplay),
      mute: flag(muted),
      controls: flag(controls),
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      ...(loop ? { loop: "1", playlist: source.id } : {}),
    });
    return `https://www.youtube-nocookie.com/embed/${source.id}?${params}`;
  }
  const params = new URLSearchParams({
    autoplay: flag(autoplay),
    muted: flag(muted),
    loop: flag(loop),
    controls: flag(controls),
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
  });
  return `https://player.vimeo.com/video/${source.id}?${params}`;
}
