"use client";
import { useState, useEffect } from "react";
import { useParams,useRouter } from "next/navigation";

export default function StoriesPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;
  
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Hardcoded stories data (replace with backend fetch later)
  const stories = [
    {
      id: 1,
      username: username || "user1",
      imageUrl: "https://source.unsplash.com/random/800x1200?sig=1",
      caption: "Enjoying my vacation!",
      timestamp: "2h ago"
    },
    {
      id: 2,
      username: username || "user1",
      imageUrl: "https://source.unsplash.com/random/800x1200?sig=2",
      caption: "Beautiful sunset today",
      timestamp: "5h ago"
    },
    {
      id: 3,
      username: username || "user1",
      imageUrl: "https://source.unsplash.com/random/800x1200?sig=3",
      caption: "Coffee time ☕",
      timestamp: "8h ago"
    },
    {
      id: 4,
      username: username || "user1",
      imageUrl: "https://source.unsplash.com/random/800x1200?sig=4",
      caption: "Working on a new project",
      timestamp: "12h ago"
    },
    {
      id: 5,
      username: username || "user1",
      imageUrl: "https://source.unsplash.com/random/800x1200?sig=5",
      caption: "Out with friends",
      timestamp: "1d ago"
    },
  ];

  // Progress timer for stories
  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(() => {
      if (activeStoryIndex < stories.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
      }
    }, 5000); // 5 seconds per story

    return () => clearTimeout(timer);
  }, [activeStoryIndex, paused, stories.length]);

  // Navigate to previous story
  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  // Navigate to next story
  const nextStory = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    }
  };

  // Handle mouse events to pause/resume timer
  const handleMouseDown = () => setPaused(true);
  const handleMouseUp = () => setPaused(false);

  if (stories.length === 0) {
    return (
      <div className="w-[82vw] h-screen flex items-center justify-center">
        <p className="text-lg">No stories available</p>
      </div>
    );
  }

  const activeStory = stories[activeStoryIndex];

  return (
    <div className="w-[82vw] h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md h-full max-h-[80vh] mx-auto">
        {/* Story Content */}
        <div className="relative h-full rounded-lg overflow-hidden bg-gray-300">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {stories.map((_, index) => (
              <div 
                key={index} 
                className="h-1 bg-gray-500 rounded-full flex-1"
              >
                {index === activeStoryIndex && (
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{
                      width: paused ? "100%" : "100%",
                      animation: paused ? "none" : "progress 5s linear"
                    }}
                  />
                )}
                {index < activeStoryIndex && (
                  <div className="h-full bg-white rounded-full w-full" />
                )}
              </div>
            ))}
          </div>

          {/* Story Header */}
          <div className="absolute top-2 left-0 right-0 z-20 flex items-center justify-between px-4 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                <div className="bg-white rounded-full p-0.5 h-full w-full">
                  <div className="bg-gray-300 h-full w-full rounded-full" />
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{activeStory.username}</p>
                <p className="text-gray-300 text-xs">{activeStory.timestamp}</p>
              </div>
            </div>
            <button className="text-white" onClick={()=>router.push('/dashboard')}>✕</button>
          </div>

          {/* Story Image */}
          <img 
            src={activeStory.imageUrl} 
            alt="Story" 
            className="h-full w-full object-cover"
          />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-10">
            <p className="text-white text-sm">{activeStory.caption}</p>
          </div>

          {/* Navigation Controls */}
          <div 
            className="absolute top-0 left-0 h-full w-1/3 z-10 cursor-pointer"
            onClick={prevStory}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
          <div 
            className="absolute top-0 right-0 h-full w-1/3 z-10 cursor-pointer"
            onClick={nextStory}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />

          {/* Visual Navigation Indicators */}
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
            {activeStoryIndex > 0 && (
              <button 
                className="bg-black/30 text-white p-1 rounded-full"
                onClick={prevStory}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
          </div>
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
            {activeStoryIndex < stories.length - 1 && (
              <button 
                className="bg-black/30 text-white p-1 rounded-full"
                onClick={nextStory}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}