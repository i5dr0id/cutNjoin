"use client";

import { Download, X } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { routes } from "@/lib/site";

type FootageDownloadProps = {
  id: string;
  title: string;
  available: boolean;
  licenceSummary: string | null;
  label: string;
  variant: "button" | "icon";
};

const buttonFace =
  "inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm leading-5 font-semibold tracking-[1px] text-bg uppercase";

export function FootageDownload({
  id,
  title,
  available,
  licenceSummary,
  label,
  variant,
}: FootageDownloadProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [accepted, setAccepted] = useState(false);
  const headingId = useId();
  const checkboxId = useId();

  if (!available) {
    return variant === "button" ? (
      <span
        aria-disabled
        title="Download coming soon"
        className={`${buttonFace} cursor-not-allowed opacity-70`}
      >
        <Download aria-hidden className="size-3.5" />
        {label}
      </span>
    ) : (
      <Download aria-hidden className="size-3.5 text-fg/80" />
    );
  }

  const open = () => {
    setAccepted(false);
    dialog.current?.showModal();
  };

  return (
    <>
      {variant === "button" ? (
        <button type="button" onClick={open} className={`${buttonFace} transition hover:brightness-110`}>
          <Download aria-hidden className="size-3.5" />
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={open}
          aria-label={`Download ${title}`}
          className="grid size-6 place-items-center text-fg/80 transition-colors hover:text-accent"
        >
          <Download aria-hidden className="size-3.5" />
        </button>
      )}

      <dialog
        ref={dialog}
        aria-labelledby={headingId}
        onClick={(event) => event.target === dialog.current && dialog.current?.close()}
        className="m-auto w-[min(520px,calc(100vw-32px))] border border-fg/12 bg-well p-0 text-fg backdrop:bg-bg/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-6 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow leading-[15px] text-fg/55">Free footage licence</p>
              <h2 id={headingId} className="pt-2 text-lg leading-7 font-bold">
                {title}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialog.current?.close()}
              className="grid size-8 place-items-center text-fg/60 transition-colors hover:text-fg"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          {licenceSummary && <p className="text-sm leading-[22.75px] text-fg/66">{licenceSummary}</p>}

          <label
            htmlFor={checkboxId}
            className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-fg/80"
          >
            <input
              id={checkboxId}
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-0.5 size-4 accent-accent"
            />
            <span>
              I agree to the{" "}
              <Link href={routes.footageLicence} className="underline underline-offset-2 hover:text-fg">
                free footage licence
              </Link>
              .
            </span>
          </label>

          {accepted ? (
            <a
              href={`/api/footage/${id}/download?licence=accepted`}
              onClick={() => dialog.current?.close()}
              className={`${buttonFace} justify-center transition hover:brightness-110`}
            >
              <Download aria-hidden className="size-3.5" />
              Download
            </a>
          ) : (
            <span aria-disabled className={`${buttonFace} cursor-not-allowed justify-center opacity-40`}>
              <Download aria-hidden className="size-3.5" />
              Download
            </span>
          )}
        </div>
      </dialog>
    </>
  );
}
