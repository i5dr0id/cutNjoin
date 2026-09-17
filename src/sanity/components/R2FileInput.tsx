import { useRef, useState, type CSSProperties } from "react";
import { set, unset, useClient, useFormValue, type ObjectInputProps } from "sanity";
import { footageFileKinds, formatBytes, type FootageFileKind } from "@/lib/footage/files";
import { apiVersion } from "@/sanity/env";

export type R2FileValue = {
  _type?: string;
  key?: string;
  url?: string;
  filename?: string;
  size?: number;
  contentType?: string;
};

type UploadTicket = { uploadUrl: string; key: string; url: string; error?: string };

const panel: CSSProperties = {
  border: "1px solid var(--card-border-color, rgba(128,128,128,0.35))",
  borderRadius: 3,
  padding: 12,
  fontSize: 13,
  lineHeight: 1.5,
};
const tones = {
  positive: { ...panel, borderColor: "rgba(61,220,79,0.6)" },
  critical: { ...panel, borderColor: "rgba(239,68,68,0.7)", color: "rgb(239,68,68)" },
};
const button: CSSProperties = {
  font: "inherit",
  fontSize: 13,
  fontWeight: 500,
  padding: "8px 12px",
  borderRadius: 3,
  border: "1px solid rgba(128,128,128,0.45)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};

function putWithProgress(url: string, file: File, onProgress: (ratio: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => event.lengthComputable && onProgress(event.loaded / event.total);
    request.onload = () =>
      request.status >= 200 && request.status < 300
        ? resolve()
        : reject(new Error(`Storage rejected the upload (${request.status}).`));
    request.onerror = () => reject(new Error("Upload failed. Check the R2 bucket CORS settings."));
    request.send(file);
  });
}

export function createR2FileInput(kind: FootageFileKind) {
  const rules = footageFileKinds[kind];

  return function R2FileInput(props: ObjectInputProps<R2FileValue>) {
    const { value, onChange, readOnly } = props;
    const client = useClient({ apiVersion });
    const documentId = useFormValue(["_id"]) as string | undefined;
    const fileInput = useRef<HTMLInputElement>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const busy = progress !== null;

    const upload = async (file: File) => {
      setError(null);
      if (!documentId) return setError("Save the document once before uploading.");
      if (file.size > rules.maxBytes) return setError(`Files must be under ${formatBytes(rules.maxBytes)}.`);
      setProgress(0);
      try {
        const response = await fetch("/api/footage/upload-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${client.config().token ?? ""}`,
          },
          body: JSON.stringify({
            documentId,
            kind,
            filename: file.name,
            contentType: file.type,
            size: file.size,
          }),
        });
        const ticket = (await response.json()) as UploadTicket;
        if (!response.ok) throw new Error(ticket.error ?? "Could not start the upload.");
        await putWithProgress(ticket.uploadUrl, file, setProgress);
        onChange(
          set({
            _type: props.schemaType.name,
            key: ticket.key,
            url: ticket.url,
            filename: file.name,
            size: file.size,
            contentType: file.type,
          }),
        );
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      } finally {
        setProgress(null);
      }
    };

    return (
      <div style={{ display: "grid", gap: 12 }}>
        {value?.key ? (
          <div style={tones.positive}>
            <strong>{value.filename}</strong>
            <div style={{ opacity: 0.7 }}>
              {[value.contentType, value.size ? formatBytes(value.size) : null].filter(Boolean).join(" · ")}
            </div>
            {value.url && (
              <a href={value.url} target="_blank" rel="noreferrer">
                Open file
              </a>
            )}
          </div>
        ) : (
          <div style={{ ...panel, opacity: 0.7 }}>No file uploaded yet.</div>
        )}

        {busy && (
          <div role="status" style={panel}>
            Uploading… {Math.round((progress ?? 0) * 100)}%
            <progress
              value={progress ?? 0}
              max={1}
              style={{ display: "block", width: "100%", marginTop: 6 }}
            />
          </div>
        )}
        {error && (
          <div role="alert" style={tones.critical}>
            {error}
          </div>
        )}

        <input
          ref={fileInput}
          type="file"
          hidden
          accept={rules.accept.join(",")}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(file);
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            style={button}
            disabled={readOnly || busy}
            onClick={() => fileInput.current?.click()}
          >
            {value?.key ? "Replace file" : "Upload file"}
          </button>
          {value?.key && (
            <button
              type="button"
              style={{ ...button, color: "rgb(239,68,68)" }}
              disabled={readOnly || busy}
              onClick={() => onChange(unset())}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    );
  };
}
