import React from "react";
import { useThreeBackground } from "../hooks/useThreeBackground";

export default function Landing() {
  const { bgRef, fxRef } = useThreeBackground();

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#f2f3f5", background: "#0b0c0f" }}>
      {/* Three.js layers */}
      <canvas ref={bgRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -2, pointerEvents: "none" }} />
      <canvas ref={fxRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none", mixBlendMode: "screen", opacity: .7 }} />

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,.1)",
        background: "linear-gradient(180deg, rgba(11,12,15,.7), rgba(11,12,15,.25) 70%, transparent)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ letterSpacing: ".3px" }}>Audio Psyco</strong>
          <a href="/app" style={{ background: "#a28af7", color: "#fff", padding: "10px 16px", borderRadius: 12, fontWeight: 700 }}>Prova ora</a>
        </div>
      </header>

      {/* Hero */}
      <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: "0 20px" }}>
        <div>
          <div style={{ color: "#a9afb6", letterSpacing: ".18em", textTransform: "uppercase", fontSize: 12, marginBottom: 8 }}>
            Focus · Relax · No Thoughts
          </div>
          <h1 style={{ fontSize: "clamp(38px,7vw,88px)", lineHeight: 1.05, marginBottom: 12 }}>Pulisci la mente. Entra nel tuo stato.</h1>
          <p style={{ color: "#a9afb6", fontSize: "clamp(16px,2.6vw,20px)", maxWidth: 760, margin: "0 auto 22px" }}>
            Audio neurali e rumori ambientali. Nessun autoplay fastidioso, controllo totale del volume.
          </p>
          <a href="/app" style={{ display: "inline-block", background: "#a28af7", color: "#fff", padding: "14px 28px", borderRadius: 14, fontWeight: 700,
            boxShadow: "0 10px 40px rgba(162,138,247,.28)" }}>
            Prova ora
          </a>
        </div>
      </main>
    </div>
  );
}