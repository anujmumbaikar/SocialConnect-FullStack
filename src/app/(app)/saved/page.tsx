"use client";
import React, { useState, useEffect } from "react";
import { Play, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
const SavedContentGrid = () => {
  const [savedContent, setSavedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSavedContent();
  }, []);

  const fetchSavedContent = async () => {
    try {
      const response = await fetch("/api/saved");
      const data = await response.json();

      if (response.ok) {
        setSavedContent(data.savedContent);
      } else {
        setError(data.message || "Failed to fetch saved content");
      }
    } catch (err) {
      setError("Failed to fetch saved content");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: any) => {
    if (item.postId) {
      router.push(`/post/${item.postId._id}`);
    } else if (item.reelId) {
      router.push(`/reel/${item.reelId._id}`);
    }
  };

  const renderGridItem = (item: any) => {
    const isReel = !!item.reelId;
    const content = item.postId || item.reelId;

    if (!content) return null;

    return (
      <div
        key={content._id}
        className="relative aspect-square bg-gray-100 cursor-pointer group overflow-hidden"
        onClick={() => handleItemClick(item)}
      >
        {isReel ? (
          <video
            src={content.reelUrl}
            className="w-full h-full object-cover"
            muted
            loop
          />
        ) : (
          <img
            src={content.postUrl || "/placeholder-image.jpg"}
            alt={content.caption || "Saved content"}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center space-x-4 text-white">
            {isReel ? (
              <div className="flex items-center space-x-1">
                <Play size={20} fill="white" />
                <span className="text-sm font-semibold">
                  {content.views || "0"}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Heart size={20} fill="white" />
                <span className="text-sm font-semibold">
                  {content.likes?.length || "0"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-[82vw] mx-auto py-8">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[82vw] mx-auto py-8 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchSavedContent}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (savedContent.length === 0) {
    return (
      <div className="w-[82vw] mx-auto py-16 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Heart size={32} className="text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700">
            No saved content yet
          </h3>
          <p className="text-gray-500 max-w-md">
            Save posts and reels to see them here. Tap the bookmark icon on any
            post or reel to save it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[82vw] mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Saved Content
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {savedContent.map((item) => renderGridItem(item))}
      </div>
    </div>
  );
};

export default SavedContentGrid;