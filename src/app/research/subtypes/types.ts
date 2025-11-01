// types.ts

export interface Cluster {
  cluster_num: number;
  cluster_label: string;
  cluster_summary: string;
  keywords?: string[];
}

export interface ScatterPoint {
  x: number;
  y: number;
  cluster_num: number;
}
