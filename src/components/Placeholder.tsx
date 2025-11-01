export function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>{title}</h2>
      <p style={{ opacity: 0.7 }}>Coming soon…</p>
    </div>
  );
}
