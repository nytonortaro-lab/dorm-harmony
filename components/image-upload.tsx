"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Upload, X, Image as ImageIcon } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { motion } from "framer-motion";

interface ImageUploadProps {
  onImageChange?: (imageUrl: string) => void;
  currentImage?: string;
  onImageDelete?: () => void;
  isDark?: boolean;
}

export function ImageUpload({
  onImageChange,
  currentImage,
  onImageDelete,
  isDark = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useApp();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        return;
      }

      onImageChange?.(data.data.url);
    } catch (err) {
      setError(t("networkError"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = () => {
    onImageDelete?.();
  };

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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border flex items-start gap-2 transition-colors ${
            isDark ? "bg-red-500/20 border-red-500" : "bg-red-50 border-red-200"
          }`}
        >
          <AlertTriangle
            size={18}
            className={`flex-shrink-0 mt-0.5 ${isDark ? "text-red-400" : "text-red-500"}`}
          />
          <p className={`text-sm ${isDark ? "text-red-300" : "text-red-700"}`}>{error}</p>
        </motion.div>
      )}

      {currentImage && (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
          <img
            src={currentImage}
            alt="Profile"
            className="w-full h-64 object-cover"
          />
          <button
            onClick={handleDelete}
            className={`absolute top-2 right-2 p-2 rounded-lg transition ${
              isDark
                ? "bg-slate-900/70 hover:bg-slate-900 text-white"
                : "bg-white/70 hover:bg-white text-slate-900"
            }`}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {!currentImage && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full py-8 px-4 rounded-2xl border-2 border-dashed transition flex items-center justify-center gap-2 flex-col ${
            isDark
              ? "border-slate-600 hover:border-purple-500 hover:bg-purple-500/10 bg-slate-700/30"
              : "border-slate-300 hover:border-purple-500 hover:bg-purple-50 bg-slate-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ImageIcon size={24} className={isDark ? "text-slate-400" : "text-slate-400"} />
          <div className="text-center">
            <p className={`font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {isUploading ? t("uploadingImage") : t("selectImage")}
            </p>
            <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              JPG, PNG, WebP • {t("imageTooLarge")}
            </p>
          </div>
        </button>
      )}

      {currentImage && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outline"
          className="w-full rounded-2xl"
        >
          {isUploading ? t("uploadingImage") : t("uploadImage")}
          <Upload size={18} className="ml-2" />
        </Button>
      )}
    </div>
  );
}
