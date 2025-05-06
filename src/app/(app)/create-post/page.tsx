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

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file");
      return;
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
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
      const dbResponse = await fetch("/api/upload", {
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
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.push(`/${user?.username}`);
      } else {
        console.error("DB error:", result);
        alert("Failed to save post in DB.");
      }
    } catch (error) {
      console.error("Error during upload or save:", error);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto space-y-4">
      <input type="file" ref={fileInputRef} className="w-full" />
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Enter caption"
        className="w-full border p-2 rounded"
      />
      <button
        type="button"
        onClick={handleUpload}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Post"}
      </button>
      <div>
        Upload progress:
        <progress value={progress} max={100} className="w-full" />
      </div>
    </div>
  );
};

export default UploadExample;
