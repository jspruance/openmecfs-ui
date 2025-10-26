# Open ME/CFS UI

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## ­ЪДа ME/CFS Subtypes Explorer

The **Subtypes Explorer** (`/subtypes`) visualizes biological clusters discovered by the [Open ME/CFS AI Cure](https://github.com/jspruance/openmecfs-ai-cure) engine.

### Features

- **ClusterGrid:** Displays biological subtypes with keywords and summaries
- **PapersPanel:** Lists related research papers for the selected subtype
- **ScatterPlot:** UMAP-style 2D visualization of clusters (interactive; click to filter)

### Tech Stack

| Layer         | Tools / Frameworks                             | Purpose                          |
| ------------- | ---------------------------------------------- | -------------------------------- |
| Frontend      | Next.js 14 (App Router) + Tailwind + shadcn/ui | UI components and styling        |
| Visualization | `react-plotly.js` + Plotly.js                  | Interactive cluster scatter plot |
| Backend       | FastAPI + Supabase (Postgres + pgvector)       | Data and semantic search API     |

### Environment Variables

Add the backend base URL to your `.env`:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Local Development

```bash
npm run dev
```

Then open [http://localhost:3000/subtypes](http://localhost:3000/subtypes) to explore ME/CFS biological subtypes and their linked papers.
