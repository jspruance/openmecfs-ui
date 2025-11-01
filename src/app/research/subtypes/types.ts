// types.ts

export interface Cluster {
  cluster_num: number;
  cluster_label: string;
  cluster_summary: string;
  keywords?: string[];
}

export type ScatterPoint = {
  pmid: string; // ✅ this matches backend (paper ID)
  cluster_label: number;
  x: number;
  y: number;
};
