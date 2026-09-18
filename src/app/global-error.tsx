"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#0d0d0d",
          color: "#f2f2f2",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ display: "grid", gap: "16px", maxWidth: "480px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", textTransform: "uppercase" }}>CUT&amp;JOIN Studios</h1>
          <p style={{ margin: 0, color: "rgb(242 242 242 / 0.66)" }}>
            The site hit an unexpected error. Please try again, or email hello@cutandjoinstudios.com.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              justifySelf: "center",
              padding: "14px 32px",
              background: "#3ddc4f",
              color: "#0d0d0d",
              border: 0,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ margin: 0, fontSize: "12px", color: "rgb(242 242 242 / 0.4)" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
