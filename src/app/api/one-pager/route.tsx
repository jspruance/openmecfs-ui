// app/api/one-pager/route.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";

// ...keep your onePager object & styles exactly as-is...

Font.registerHyphenationCallback((word) => [word]);

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={{ marginLeft: 10, marginTop: 2 }}>
      {items.map((t, i) => (
        <Text key={i} style={{ marginBottom: 2 }}>
          • {t}
        </Text>
      ))}
    </View>
  );
}

function OnePagerPDF() {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          padding: 32,
          fontSize: 10,
          fontFamily: "Helvetica",
          color: "#111827",
        }}
      >
        {/* ...your existing PDF content unchanged... */}
      </Page>
    </Document>
  );
}

export async function GET() {
  // Buffer is a Uint8Array → valid BodyInit (BufferSource)
  const buf: Buffer = await pdf(<OnePagerPDF />).toBuffer();

  return new Response(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ME-CFS-One-Pager.pdf"',
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
