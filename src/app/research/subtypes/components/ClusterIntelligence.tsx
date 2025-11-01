"use client";

import React from "react";

interface Props {
  cluster: {
    cluster_num: number;
    label: string;
    keywords?: string[];
    biomarkers?: string[];
    summary?: string;
  } | null;
}

export default function ClusterIntelligence({ cluster }: Props) {
  if (!cluster) return null;

  const { keywords = [], biomarkers = [], summary = "" } = cluster;

  return (
    <section className="border rounded-xl p-4 mt-4 bg-muted/40">
      <h3 className="text-lg font-semibold mb-2">Subtype Intelligence</h3>

      {summary && (
        <p className="text-sm text-muted-foreground mb-4">{summary}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Key Concepts</h4>
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
              <span className="text-xs text-muted-foreground">No data yet</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Potential Biomarkers</h4>
          <div className="flex flex-wrap gap-2">
            {biomarkers.length > 0 ? (
              biomarkers.map((b) => (
                <span
                  key={b}
                  className="text-xs px-2 py-1 bg-accent rounded-lg"
                >
                  {b}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No data yet</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
