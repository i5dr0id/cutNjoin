import { Search } from "lucide-react";
import { routes } from "@/lib/site";
import type { FootageFilter } from "@/sanity/fetch";

const typeOptions: { value: FootageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "video", label: "Videos" },
  { value: "image", label: "Images" },
  { value: "drone", label: "Drone shots" },
];

export function FootageSearch({ query, type }: { query: string; type: FootageFilter }) {
  return (
    <form
      action={routes.footage}
      method="get"
      role="search"
      className="flex h-[62px] w-full max-w-[710px] items-center bg-fg text-bg"
    >
      <button type="submit" aria-label="Search" className="grid h-full w-14 shrink-0 place-items-center">
        <Search aria-hidden className="size-5" />
      </button>
      <label htmlFor="footage-query" className="sr-only">
        Search footage
      </label>
      <input
        id="footage-query"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search free high resolution videos and images"
        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-bg/60"
      />
      <label htmlFor="footage-type" className="sr-only">
        Type
      </label>
      <select
        id="footage-type"
        name="type"
        defaultValue={type}
        className="h-full shrink-0 cursor-pointer bg-transparent pr-4 pl-2 text-sm outline-none"
      >
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}

export { typeOptions as footageTypeOptions };
