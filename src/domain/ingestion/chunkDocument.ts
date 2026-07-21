import type { SourceChunk } from "@/domain/graph/graphSchema";

export interface TextPage {
  page: number;
  text: string;
}

export function detectSection(text: string) {
  const firstLine = text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine || firstLine.length > 100) return undefined;
  return /^#{1,6}\s|^[A-Z][A-Za-z\s:–—-]{2,80}$/u.test(firstLine)
    ? firstLine.replace(/^#{1,6}\s*/u, "")
    : undefined;
}

export function chunkPages(
  documentId: string,
  pages: TextPage[],
  targetSize = 1_100,
  overlap = 100,
): SourceChunk[] {
  const chunks: SourceChunk[] = [];
  for (const page of pages) {
    const clean = page.text.replace(/[ \t]+/gu, " ").replace(/\n{3,}/gu, "\n\n").trim();
    if (!clean) continue;
    const section = detectSection(clean);
    let start = 0;
    let index = 0;
    while (start < clean.length) {
      let end = Math.min(clean.length, start + targetSize);
      if (end < clean.length) {
        const boundary = Math.max(clean.lastIndexOf(". ", end), clean.lastIndexOf("\n", end));
        if (boundary > start + targetSize * 0.55) end = boundary + 1;
      }
      const text = clean.slice(start, end).trim();
      if (text) {
        chunks.push({
          id: `${documentId}-p${page.page}-c${index}`,
          documentId,
          page: page.page,
          ...(section ? { section } : {}),
          text,
          charStart: start,
          charEnd: end,
        });
      }
      if (end >= clean.length) break;
      start = Math.max(start + 1, end - overlap);
      index += 1;
    }
  }
  return chunks;
}

export function chunkPlainText(documentId: string, text: string): SourceChunk[] {
  const pageBreaks = text.split(/\f|\n\s*---\s*\n/gu);
  return chunkPages(
    documentId,
    pageBreaks.map((pageText, index) => ({ page: index + 1, text: pageText })),
  );
}

