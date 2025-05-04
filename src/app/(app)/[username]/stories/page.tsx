"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Pause, Play } from "lucide-react";

export default function StoriesPage() {
  const router = useRouter();
  
  // State for stories navigation
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Hardcoded users data (replace with backend fetch later)
  const users = [
    {
      id: 1,
      username: "creator1",
      avatar: "/api/placeholder/32/32",
      stories: [
        {
          id: 101,
          imageUrl: "/api/placeholder/800/1200?sig=1",
          caption: "Enjoying my vacation!",
          timestamp: "2h ago"
        },
        {
          id: 102,
          imageUrl: "/api/placeholder/800/1200?sig=2",
          caption: "Beautiful sunset today",
          timestamp: "5h ago"
        }
      ]
    },
    {
      id: 2,
      username: "creator2",
      avatar: "/api/placeholder/32/32",
      stories: [
        {
          id: 201,
          imageUrl: "/api/placeholder/800/1200?sig=3",
          caption: "Coffee time ☕",
          timestamp: "3h ago"
        }
      ]
    },
    {
      id: 3,
      username: "creator3",
      avatar: "/api/placeholder/32/32",
      stories: [
        {
          id: 301,
          imageUrl: "/api/placeholder/800/1200?sig=4",
          caption: "Working on a new project",
          timestamp: "4h ago"
        },
        {
          id: 302,
          imageUrl: "/api/placeholder/800/1200?sig=5",
          caption: "Out with friends",
          timestamp: "6h ago"
        },
        {
          id: 303,
          imageUrl: "/api/placeholder/800/1200?sig=6",
          caption: "Just chillin'",
          timestamp: "12h ago"
        }
      ]
    },
  ];

  // Get current user and story
  const currentUser = users[activeUserIndex] || null;
  const currentStories = currentUser?.stories || [];
  const currentStory = currentStories[activeStoryIndex] || null;

  // Progress timer for stories
  useEffect(() => {
    if (paused || !currentStory) return;

    const timer = setTimeout(() => {
      goToNextStory();
    }, 5000); // 5 seconds per story

    return () => clearTimeout(timer);
  }, [activeUserIndex, activeStoryIndex, paused]);

  // Navigate to next story or user
  const goToNextStory = () => {
    if (activeStoryIndex < currentStories.length - 1) {
      // Go to next story of current user
      setActiveStoryIndex(activeStoryIndex + 1);
    } else if (activeUserIndex < users.length - 1) {
      // Go to first story of next user
      setActiveUserIndex(activeUserIndex + 1);
      setActiveStoryIndex(0);
    }
  };

  // Navigate to previous story or user
  const goToPrevStory = () => {
    if (activeStoryIndex > 0) {
      // Go to previous story of current user
      setActiveStoryIndex(activeStoryIndex - 1);
    } else if (activeUserIndex > 0) {
      // Go to last story of previous user
      setActiveUserIndex(activeUserIndex - 1);
      setActiveStoryIndex(users[activeUserIndex - 1].stories.length - 1);
    }
  };

  // Toggle pause/play
  const togglePause = () => setPaused(!paused);

  if (!currentUser || !currentStory) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg">No stories available</p>
      </div>
    );
  }

  return (
    <div className="w-[82vw] min-h-screen bg-slate-50 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-white">
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
              {currentStories.map((_, index) => (
                <div 
                  key={index} 
                  className="h-1 bg-slate-200 rounded-full flex-1"
                >
                  {index === activeStoryIndex && (
                    <div 
                      className="h-full bg-purple-600 rounded-full" 
                      style={{
                        width: paused ? "40%" : "100%",
                        animation: paused ? "none" : "progress 5s linear"
                      }}
                    />
                  )}
                  {index < activeStoryIndex && (
                    <div className="h-full bg-purple-600 rounded-full w-full" />
                  )}
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="pt-6 pb-2 px-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-purple-100">
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{currentUser.username}</p>
                  <p className="text-xs text-slate-500">{currentStory.timestamp}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={togglePause}
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>

            {/* Story Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
              <img 
                src={currentStory.imageUrl} 
                alt="Story" 
                className="h-full w-full object-cover"
              />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/70 to-transparent">
                <p className="text-white text-sm">{currentStory.caption}</p>
              </div>

              {/* Navigation Controls - Invisible tap areas */}
              <div 
                className="absolute top-0 left-0 h-full w-1/3 z-10 cursor-pointer"
                onClick={goToPrevStory}
              />
              <div 
                className="absolute top-0 right-0 h-full w-1/3 z-10 cursor-pointer"
                onClick={goToNextStory}
              />

              {/* Visual Navigation Arrows */}
              {(activeStoryIndex > 0 || activeUserIndex > 0) && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20 h-8 w-8 bg-gray-400 text-black hover:bg-white/50"
                  onClick={goToPrevStory}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              
              {(activeStoryIndex < currentStories.length - 1 || activeUserIndex < users.length - 1) && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20 h-8 w-8 bg-gray-400 text-black hover:bg-white/50"
                  onClick={goToNextStory}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}