// src/lib/api.ts
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  console.error("❌ NEXT_PUBLIC_API_URL is missing — API URL not configured");
}
console.log("🔧 apiUrl resolved to:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- Clusters -----
export async function fetchClusters() {
  const res = await api.get("/clusters");
  return res.data;
}

// ----- Papers -----
export async function fetchPapersByCluster(clusterId: number) {
  if (clusterId === null || clusterId === undefined) return [];
  const res = await api.get("/papers-sb/", {
    params: { cluster_label: clusterId },
  });
  return res.data;
}

export async function searchPapers(query: string) {
  const res = await api.get("/papers-sb/", {
    params: { q: query },
  });
  return res.data;
}

export default api;
