"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, ImagePlus, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

interface ImageUploadProps {
  onImageChange?: (imageUrl: string) => void;
  currentImage?: string;
  onImageDelete?: () => void;
}

export function ImageUpload({
  onImageChange,
  currentImage,
  onImageDelete,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useApp();

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("imageTooLarge"));
        setIsUploading(false);
        return;
      }

      onImageChange?.(data.data.url);
    } catch {
      setError(t("networkError"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {currentImage ? (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/60">
          <div className="relative">
            <div className="relative h-64 w-full">
              <Image
                src={currentImage}
                alt={t("uploadedImageAlt")}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={onImageDelete}
              className="absolute right-3 top-3 rounded-lg border border-border/70 bg-background/85 p-2 transition hover:bg-background"
              aria-label={t("deleteImage")}
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-3">
            <p className="text-sm text-muted-foreground">{t("imageRequirements")}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-xl"
            >
              <Upload className="size-4" />
              {isUploading ? t("uploadingImage") : t("uploadImage")}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="grid min-h-44 w-full place-items-center rounded-xl border border-dashed border-border bg-muted/35 px-5 py-8 text-center transition hover:border-primary/40 hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="grid gap-3">
            <ImagePlus className="mx-auto size-7 text-muted-foreground" />
            <div className="grid gap-1">
              <p className="font-medium">
                {isUploading ? t("uploadingImage") : t("selectImage")}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {t("imageRequirements")}
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
