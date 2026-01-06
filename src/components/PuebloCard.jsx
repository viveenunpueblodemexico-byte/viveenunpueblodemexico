export default function PuebloCard({ pueblo }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        padding: 14,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800 }}>
        {pueblo.nombre} {pueblo.destacado ? "⭐" : ""}
      </div>

      <div style={{ opacity: 0.85, marginTop: 4 }}>{pueblo.estado}</div>

      {pueblo.descripcionCorta && (
        <div style={{ marginTop: 10, opacity: 0.9 }}>
          {pueblo.descripcionCorta}
        </div>
      )}

      {pueblo.tags?.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
          {pueblo.tags.join(" · ")}
        </div>
      )}
    </div>
  );
}
