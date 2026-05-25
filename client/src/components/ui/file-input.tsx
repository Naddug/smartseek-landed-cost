import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileInputProps = {
  onChange: (file: File | null) => void;
  accept?: string;
  className?: string;
  disabled?: boolean;
};

export function FileInput({ onChange, accept, className, disabled }: FileInputProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setFileName(file?.name ?? null);
          onChange(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {t("common.chooseFile")}
      </Button>
      <span className="text-sm text-muted-foreground truncate max-w-[220px]">
        {fileName || t("common.noFileChosen")}
      </span>
    </div>
  );
}
