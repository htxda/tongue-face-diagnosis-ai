"use client";

import React, { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type UploadAreaProps = {
  label: string;
  hint?: string;
  onChange: (file: File | null, dataUrl: string | null) => void;
  accept?: string;
};

export default function UploadArea({ label, hint, onChange, accept = "image/*" }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) {
      onChange(null, null);
      setPreview(null);
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      onChange(file, url);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  return (
    <Card
      className={cn(
        "p-4 border-dashed cursor-pointer select-none",
        drag ? "border-primary bg-secondary/60" : ""
      )}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      aria-label={`${label} 上传区域`}
    >
      <div className="flex items-center gap-4">
        {preview ? (
          <img src={preview} alt={`${label} 预览`} className="h-20 w-20 rounded object-cover border" />
        ) : (
          <div className="h-20 w-20 rounded border flex items-center justify-center text-muted-foreground">无预览</div>
        )}
        <div className="flex-1">
          <div className="font-medium">{label}</div>
          <div className="text-sm text-muted-foreground">{hint || "点击或拖拽图片到此处上传"}</div>
        </div>
        <Button type="button" variant="secondary" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>选择文件</Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </Card>
  );
}