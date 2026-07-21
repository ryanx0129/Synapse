import type { TextPage } from "@/domain/ingestion/chunkDocument";

export async function extractPdfPages(file: File): Promise<TextPage[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data: bytes }).promise;
  const pages: TextPage[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/gu, " ")
      .trim();
    pages.push({ page: pageNumber, text });
  }
  return pages;
}

