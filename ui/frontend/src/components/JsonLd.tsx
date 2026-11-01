import { jsonLdString } from "@/lib/seo";

type JsonLdValue = Record<string, unknown>;

export function JsonLd({ data }: { data: (JsonLdValue | null)[] }) {
  return (
    <>
      {data
        .filter((d): d is JsonLdValue => d !== null)
        .map((d, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(d) }} />
        ))}
    </>
  );
}
