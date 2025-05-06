"use client";

import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { VideoIcon, X, Upload as UploadIcon, Loader2 } from "lucide-react";

const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

const UploadReel = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const abortController = new AbortController();

  const authenticator = async () => {
    const res = await fetch("/api/imagekit-auth");
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      toast.error("Only video files are allowed");
      fileInputRef.current && (fileInputRef.current.value = "");
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    setUploading(true);
    try {
      const { signature, expire, token, publicKey } = await authenticator();

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => setProgress((event.loaded / event.total) * 100),
        abortSignal: abortController.signal,
      });

      const dbResponse = await fetch("/api/upload-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelUrl: uploadResponse.url,
          title,
          caption,
          transformation: {
            width: VIDEO_DIMENSIONS.width,
            height: VIDEO_DIMENSIONS.height,
            quality: 80,
          },
        }),
      });

      const result = await dbResponse.json();
      if (dbResponse.ok) {
        toast.success("Reel uploaded successfully!");
        setTitle("");
        setCaption("");
        setProgress(0);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.push(`/${user?.username}`);
      } else {
        console.error("DB Error:", result);
        toast.error("Failed to save reel");
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error. Check your connection.");
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server error. Try again later.");
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid request. Please check the file.");
      } else {
        toast.error("Upload failed.");
      }
    } finally {
      setUploading(false);
    }
  };

  const clearFileSelection = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewUrl(null);
  };

  const cancelUpload = () => {
    abortController.abort();
    setUploading(false);
    setProgress(0);
    toast.info("Upload canceled");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Upload Reel</h2>

        <div className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-all
              ${previewUrl ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"}`}
          >
            {!previewUrl ? (
              <div
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <VideoIcon className="w-16 h-16 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">Click or drag to upload a video</p>
                <p className="text-xs text-gray-400 mt-2">
                  Recommended: {VIDEO_DIMENSIONS.width}×{VIDEO_DIMENSIONS.height}px
                </p>
              </div>
            ) : (
              <div className="relative">
                <video controls className="w-full rounded-md max-h-64">
                  <source src={previewUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 hover:bg-opacity-80"
                  onClick={clearFileSelection}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="video/*"
            />
          </div>

          {/* Title and Caption Inputs */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your reel a title"
              className="w-full border border-gray-300 rounded-md p-3 mb-3 focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />

            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 min-h-20"
              maxLength={2200}
            />
            <div className="flex justify-end mt-1 text-xs text-gray-500">
              {caption.length}/2200
            </div>
          </div>

          {/* Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Uploading: {Math.round(progress)}%</span>
                <button onClick={cancelUpload} className="text-xs text-red-600 hover:text-red-800">
                  Cancel
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                clearFileSelection();
                setCaption("");
                setTitle("");
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={uploading}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${
                !previewUrl || uploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={!previewUrl || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload Reel
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">Your reel will appear on your profile after successful upload.</p>
      </div>
    </div>
  );
};

export default UploadReel;
