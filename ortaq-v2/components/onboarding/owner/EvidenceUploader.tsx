"use client";

import { useRef } from "react";
import { FileText, X } from "lucide-react";
import { ChipSelect } from "@/components/shared/ChipSelect";
import { EVIDENCE_TAGS } from "@/data/onboarding/owner-options";
import type { EvidenceFileMeta } from "@/types/opportunity-dossier";

interface EvidenceUploaderProps {
  files: EvidenceFileMeta[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
  onAdd: (file: EvidenceFileMeta) => void;
  onRemove: (id: string) => void;
}

export function EvidenceUploader({
  files,
  selectedTag,
  onTagChange,
  onAdd,
  onRemove,
}: EvidenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length || !selectedTag) return;
    Array.from(fileList).forEach((file) => {
      onAdd({
        id: crypto.randomUUID(),
        name: file.name,
        tag: selectedTag,
        size: file.size,
        addedAt: new Date().toISOString(),
      });
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-ortaq-navy">Dosya türü</p>
        <ChipSelect
          options={EVIDENCE_TAGS}
          value={selectedTag ? [selectedTag] : []}
          onChange={(v) => onTagChange(v[0] ?? "")}
        />
      </div>

      <label
        className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-ortaq-line bg-ortaq-surface px-6 py-8 text-center transition-colors hover:border-ortaq-accent"
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          multiple
          disabled={!selectedTag}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <FileText className="mb-2 h-8 w-8 text-ortaq-text-muted" />
        <p className="text-sm font-medium text-ortaq-navy">
          {selectedTag ? "Dosya seçin" : "Önce dosya türü seçin"}
        </p>
        <p className="mt-1 text-xs text-ortaq-text-muted">
          Bu sprintte dosyalar yalnızca yerel önizleme için tutulur.
        </p>
      </label>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => {
            const tagLabel =
              EVIDENCE_TAGS.find((t) => t.value === file.tag)?.label ?? file.tag;
            return (
              <li
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-ortaq-line bg-ortaq-surface px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ortaq-navy">
                    {file.name}
                  </p>
                  <p className="text-xs text-ortaq-text-muted">{tagLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(file.id)}
                  className="ml-2 shrink-0 rounded p-1 text-ortaq-text-muted hover:bg-ortaq-surface-alt"
                  aria-label="Kaldır"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
