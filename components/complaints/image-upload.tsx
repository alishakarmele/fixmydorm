/**
 * FixMyDorm - Image Upload Component
 *
 * Drag-and-drop image upload with preview thumbnails.
 * Uploads to S3 via presigned URLs from /api/upload.
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageFile {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  fileUrl?: string;
  error?: string;
}

interface ImageUploadProps {
  complaintId: string;
  maxFiles?: number;
  onImagesChange: (urls: string[]) => void;
}

export function ImageUpload({
  complaintId,
  maxFiles = 3,
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateImageUrls = useCallback(
    (updatedImages: ImageFile[]) => {
      const urls = updatedImages
        .filter((img) => img.uploaded && img.fileUrl)
        .map((img) => img.fileUrl!);
      onImagesChange(urls);
    },
    [onImagesChange]
  );

  const uploadImage = useCallback(
    async (imageFile: ImageFile, index: number) => {
      try {
        // Get presigned URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: imageFile.file.name,
            contentType: imageFile.file.type,
            complaintId,
            fileSize: imageFile.file.size,
          }),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        // Upload directly to S3
        await fetch(data.data.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": imageFile.file.type },
          body: imageFile.file,
        });

        setImages((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            uploading: false,
            uploaded: true,
            fileUrl: data.data.fileUrl,
          };
          updateImageUrls(updated);
          return updated;
        });
      } catch (error) {
        setImages((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            uploading: false,
            error: error instanceof Error ? error.message : "Upload failed",
          };
          return updated;
        });
      }
    },
    [complaintId, updateImageUrls]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxFiles - images.length;
      const toAdd = fileArray.slice(0, remaining);

      const newImages: ImageFile[] = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
        uploaded: false,
      }));

      setImages((prev) => {
        const updated = [...prev, ...newImages];
        // Start uploads
        newImages.forEach((img, i) => {
          uploadImage(img, prev.length + i);
        });
        return updated;
      });
    },
    [images.length, maxFiles, uploadImage]
  );

  const removeImage = useCallback(
    (index: number) => {
      setImages((prev) => {
        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(prev[index].preview);
        const updated = prev.filter((_, i) => i !== index);
        updateImageUrls(updated);
        return updated;
      });
    },
    [updateImageUrls]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      {images.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop images or{" "}
            <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Up to {maxFiles} images · JPG, PNG, WebP · Max 5 MB each
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border bg-muted aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Upload overlay */}
              {img.uploading && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center p-2">
                  <p className="text-xs text-destructive text-center">
                    {img.error}
                  </p>
                </div>
              )}

              {/* Success indicator */}
              {img.uploaded && (
                <div className="absolute top-1 left-1">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                </div>
              )}

              {/* Remove button */}
              <Button
                variant="destructive"
                size="icon-xs"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
