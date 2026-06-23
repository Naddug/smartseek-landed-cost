"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  label?: string;
  hint?: string;
  accept?: string;
  onFilesSelected?: (files: FileList) => void;
  className?: string;
}

export function UploadDropzone({
  label = "Dosya yükle",
  hint = "Sürükleyip bırakın veya seçmek için tıklayın",
  accept,
  onFilesSelected,
  className,
}: UploadDropzoneProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ortaq-line bg-ortaq-surface px-6 py-10 text-center transition-colors hover:border-ortaq-accent hover:bg-ortaq-surface-alt/50",
        className
      )}
    >
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple
        onChange={(e) => {
          if (e.target.files && onFilesSelected) {
            onFilesSelected(e.target.files);
          }
        }}
      />
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ortaq-surface-alt text-ortaq-text-muted">
        <Upload className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-ortaq-navy">{label}</p>
      <p className="mt-1 text-xs text-ortaq-text-muted">{hint}</p>
      {/* TODO: Wire file upload API and validation */}
    </label>
  );
}
