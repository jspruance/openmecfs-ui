"use client";

interface Props {
  cluster: {
    cluster_num: number;
    cluster_label: string;
    cluster_summary: string;
    keywords?: string[];
  } | null;
}

export default function ClusterIntelligence({ cluster }: Props) {
  if (!cluster) return null;

  const { cluster_label, cluster_summary, keywords = [] } = cluster;

  return (
    <section className="border rounded-xl p-4 mt-4 bg-muted/40">
      <h3 className="text-lg font-semibold mb-2">Subtype Intelligence</h3>

      {cluster_summary && (
        <p className="text-sm text-muted-foreground mb-4">{cluster_summary}</p>
      )}

      <div>
        <h4 className="text-sm font-medium mb-2">Key Concepts</h4>
        <div className="flex flex-wrap gap-2">
          {keywords.length > 0 ? (
            keywords.map((k) => (
              <span
                key={k}
                className="text-xs px-2 py-1 bg-primary/10 rounded-lg"
              >
                {k}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">
              No keywords yet
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
