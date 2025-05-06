"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageIcon, X, Upload as UploadIcon, Loader2 } from "lucide-react";

const POST_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

const UploadExample = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const abortController = new AbortController();

  const authenticator = async () => {
    const response = await fetch("/api/imagekit-auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth failed: ${errorText}`);
    }
    const { signature, expire, token, publicKey } = await response.json();
    return { signature, expire, token, publicKey };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select an image to upload");
      return;
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
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
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      console.log("Upload success:", uploadResponse);

      // Send to your backend
      const dbResponse = await fetch("/api/upload-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postUrl: uploadResponse.url,
          caption,
          transformation: {
            width: POST_DIMENSIONS.width,
            height: POST_DIMENSIONS.height,
            quality: 80,
          },
        }),
      });

      const result = await dbResponse.json();

      if (dbResponse.ok) {
        toast.success("Post uploaded successfully!");
        setCaption("");
        setProgress(0);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.push(`/${user?.username}`);
      } else {
        console.error("DB error:", result);
        toast.error("Failed to save post");
      }
    } catch (error) {
      console.error("Error during upload or save:", error);
      if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error. Please check your connection.");
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server error. Please try again later.");
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid request. Please check your image.");
      } else {
        toast.error("Upload failed. Please try again.");
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
        <h2 className="text-2xl font-bold text-center text-gray-800">Create New Post</h2>
        
        {/* File Upload Area */}
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-all
              ${previewUrl ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}
          >
            {!previewUrl ? (
              <div 
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-16 h-16 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  Click to select an image or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Recommended: {POST_DIMENSIONS.width}×{POST_DIMENSIONS.height}px
                </p>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full rounded-md object-cover max-h-64" 
                />
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
              accept="image/*"
            />
          </div>
          
          {/* Caption Input */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your post..."
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-20"
              maxLength={2200}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{caption.length}/2200</span>
            </div>
          </div>
          
          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Upload progress: {Math.round(progress)}%
                </span>
                <button 
                  onClick={cancelUpload}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Cancel
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                clearFileSelection();
                setCaption("");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={uploading}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md 
                ${!previewUrl || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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
                  Upload Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Images will be optimized automatically. Your post will appear on your profile after successful upload.
        </p>
      </div>
    </div>
  );
};

export default UploadExample;