import { useEffect, useRef, useState } from "react";
import { FileText, LoaderCircle, ShieldCheck, Upload, X } from "lucide-react";
import { chunkPages, chunkPlainText } from "@/domain/ingestion/chunkDocument";
import { hashText } from "@/services/documentHash";
import { extractPdfPages } from "@/services/pdfParser";
import { useSynapseStore } from "@/stores/useSynapseStore";

export function DocumentUploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"text" | "pdf">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [localOnly, setLocalOnly] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const state = useSynapseStore();

  useEffect(() => {
    if (open) window.setTimeout(() => closeRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setError(null);
    try {
      let chunks;
      let title;
      let hash;
      if (tab === "pdf") {
        if (!file) throw new Error("Choose a text-based PDF first.");
        if (file.size > 20 * 1024 * 1024) throw new Error("This PDF exceeds the 20 MB demo limit. Choose a smaller file or paste a bounded excerpt.");
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          throw new Error("Unsupported file type. Upload a .pdf file or use the pasted-text tab.");
        }
        state.setProcessingStage("extracting");
        const pages = await extractPdfPages(file);
        const allText = pages.map((page) => page.text).join("\n").trim();
        if (!allText) throw new Error("No selectable text was found. This may be a scanned PDF; paste OCR text instead.");
        if (allText.length > 100_000) throw new Error("Extracted text exceeds 100,000 characters. Paste the most relevant sections instead.");
        hash = await hashText(allText);
        state.setProcessingStage("chunking");
        chunks = chunkPages(hash, pages);
        title = file.name.replace(/\.pdf$/iu, "");
      } else {
        const clean = text.trim();
        if (!clean) throw new Error("Paste plain text or Markdown before generating a graph.");
        if (clean.length > 50_000) throw new Error("Pasted text exceeds the 50,000 character limit. Use a focused excerpt.");
        hash = await hashText(clean);
        state.setProcessingStage("chunking");
        chunks = chunkPlainText(hash, clean);
        title = clean.match(/^#{1,6}\s+(.+)$/mu)?.[1]?.trim() ?? "Pasted study material";
      }
      const success = await state.ingestGraph(
        {
          document: { id: hash, title },
          chunks,
          options: { targetConceptCount: 12, includeFormulas: true },
        },
        localOnly,
      );
      if (success) onClose();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "The document could not be processed.";
      setError(message);
      state.setProcessingStage("error");
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <div className="modal-heading">
          <div><span className="eyebrow">Source-grounded ingestion</span><h2 id="upload-title">Create a knowledge twin</h2></div>
          <button ref={closeRef} className="icon-button" onClick={onClose} aria-label="Close upload dialog"><X size={19} /></button>
        </div>
        <div className="tab-list" role="tablist" aria-label="Document input method">
          <button role="tab" aria-selected={tab === "text"} className={tab === "text" ? "active" : ""} onClick={() => setTab("text")}><FileText size={16} />Paste text / Markdown</button>
          <button role="tab" aria-selected={tab === "pdf"} className={tab === "pdf" ? "active" : ""} onClick={() => setTab("pdf")}><Upload size={16} />Upload PDF</button>
        </div>
        {tab === "text" ? (
          <label className="upload-field">
            <span>Study material <small>{text.length.toLocaleString()} / 50,000</small></span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} rows={12} placeholder="# Neural Networks&#10;&#10;Backpropagation applies the chain rule…" />
          </label>
        ) : (
          <label className={`file-drop ${file ? "has-file" : ""}`}>
            <input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <Upload size={28} />
            <strong>{file?.name ?? "Choose a text-based PDF"}</strong>
            <span>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Maximum 20 MB · extraction stays in your browser"}</span>
          </label>
        )}
        <label className="mode-choice">
          <input type="checkbox" checked={localOnly} onChange={(event) => setLocalOnly(event.target.checked)} />
          <span><strong>Deterministic demo mode</strong><small>Generate locally without an API key. Turn off to use the server-side GPT route.</small></span>
        </label>
        <div className="privacy-note"><ShieldCheck size={17} /><p>PDF text is extracted locally. In GPT mode, only bounded chunks are sent to the configured server route; API keys never enter the browser.</p></div>
        {state.processingStage !== "idle" && state.processingStage !== "ready" && (
          <p className="processing-state" role="status"><LoaderCircle className={state.processingStage !== "error" ? "spin" : ""} size={16} />{state.processingStage.replace(/-/gu, " ")}</p>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions"><button className="button-secondary" onClick={onClose}>Cancel</button><button className="button-primary" onClick={() => void submit()} disabled={state.processingStage === "generating" || state.processingStage === "extracting"}>{localOnly ? "Generate locally" : "Generate with GPT"}</button></div>
      </section>
    </div>
  );
}

