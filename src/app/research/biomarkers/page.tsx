return (
  <div className="mx-auto max-w-6xl px-6 py-8">
    {/* ------------------- Graph Section (moved up) ------------------- */}
    <div className="border border-slate-200 rounded-lg shadow-sm bg-white p-5 mb-10">
      <h2 className="text-xl font-semibold mb-2">
        Biomarker–Mechanism Network
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Visualizing relationships between biomarkers and biological mechanisms
        reported in ME/CFS research.
      </p>

      <div className="w-full h-[700px] overflow-hidden rounded-md">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error react-force-graph types missing nodeAutoColorBy prop */}
        <ForceGraph2D
          graphData={graph}
          nodeAutoColorBy="type"
          linkColor={() => "rgba(0,0,0,0.2)"}
          backgroundColor="#fafafa"
          // make layout denser
          nodeRelSize={8}
          cooldownTicks={60}
          d3VelocityDecay={0.25}
          d3AlphaDecay={0.03}
          width={window.innerWidth * 0.9}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = node.type === "mechanism" ? "#2563eb" : "#16a34a";
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, node.val ?? 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.fillText(label, (node.x ?? 0) + 8, (node.y ?? 0) + 3);
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}
        />
      </div>
    </div>

    {/* ------------------- Biomarker Cards (below) ------------------- */}
    <h1 className="text-2xl font-semibold mb-4">Biomarkers</h1>
    <p className="text-slate-600 mb-6 max-w-3xl">
      Key biological markers reported in ME/CFS studies, grouped by underlying
      mechanisms. Data are aggregated automatically from AI evidence and
      manually curated research sources.
    </p>

    {error && <p className="text-red-600">{error}</p>}
    {data.length === 0 && !error && (
      <p className="text-slate-500 italic">
        Loading biomarkers or no data found...
      </p>
    )}

    <div className="grid gap-4 mb-10">
      {data.map((b) => (
        <div
          key={b.biomarker}
          className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">{b.biomarker}</h3>
          <p className="text-sm text-slate-600 mt-1">
            Reported in {b.count} studies
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Mechanisms:{" "}
            <span className="italic">{b.mechanisms.join(", ")}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
);
