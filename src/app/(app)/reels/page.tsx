"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  PlayCircle, 
  Volume2, 
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Flame,
  TrendingUp,
  Users
} from "lucide-react";

const reels = [
  {
    id: 1,
    username: "creator_studio",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Check out this amazing cinematic sequence we captured! #cinematography #filmmaking",
    tags: ["cinema", "film"],
    views: "1.2M",
    likes: "145K",
    comments: "3.2K",
    duration: "0:28",
  },
  {
    id: 2,
    username: "travel_moments",
    video: "https://www.w3schools.com/html/movie.mp4",
    caption: "Exploring hidden gems in the mountains. The view was absolutely breathtaking!",
    tags: ["travel", "adventure"],
    views: "890K",
    likes: "76K",
    comments: "1.5K",
    duration: "0:32",
  },
  {
    id: 3,
    username: "tech_insider",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Behind the scenes look at how modern processors are manufactured. The precision is incredible.",
    tags: ["tech", "engineering"],
    views: "2.5M",
    likes: "320K",
    comments: "8.7K",
    duration: "0:42",
  },
  {
    id: 4,
    username: "dance_collective",
    video: "https://www.w3schools.com/html/movie.mp4",
    caption: "Our latest choreography to the trending sound! What do you think? 💃",
    tags: ["dance", "performance"],
    views: "4.1M",
    likes: "512K",
    comments: "12.3K",
    duration: "0:38",
  },
];

export default function ReelsPage() {
  const router = useRouter();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  const prevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentReel = reels[currentReelIndex];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-64">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>Video Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-md cursor-pointer border-l-4 border-purple-500">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Featured</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>Following</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                  <Flame className="h-5 w-5 text-gray-500" />
                  <span>Trending</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>Recent</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-purple-600 hover:text-purple-700">
                  Browse All Categories
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Main Content - Reels */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-purple-500" />
              <span>Spotlight Videos</span>
            </h2>
            <Tabs defaultValue="for-you" className="w-[300px]">
              <TabsList>
                <TabsTrigger value="for-you">For You</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Reel Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-lg aspect-[9/16] max-h-[75vh]">
            {/* Video */}
            <video
              src={currentReel.video}
              autoPlay={isPlaying}
              loop
              muted={muted}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-white bg-black/20 backdrop-blur-sm rounded-full ml-4 hover:bg-black/40"
                onClick={prevReel}
                disabled={currentReelIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-white bg-black/20 backdrop-blur-sm rounded-full mr-4 hover:bg-black/40"
                onClick={nextReel}
                disabled={currentReelIndex === reels.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Playback Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-white bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <span className="text-xl">⏸️</span>
                ) : (
                  <span className="text-xl">▶️</span>
                )}
              </Button>
              <Button
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-white bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40"
                onClick={toggleMute}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>

            {/* Progress & Duration */}
            <div className="absolute bottom-28 left-0 right-0 px-4">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500" 
                  style={{ width: `${(currentReelIndex / (reels.length - 1)) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-white/80">
                <span>0:12</span>
                <span>{currentReel.duration}</span>
              </div>
            </div>

            {/* Content Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <div className="flex items-start mb-3">
                <Avatar className="h-11 w-11 border-2 border-white mr-3">
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white font-bold">
                    {currentReel.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{currentReel.username}</p>
                      <p className="text-white/70 text-xs">{currentReel.views} views</p>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                      Follow
                    </Button>
                  </div>
                  <p className="text-white/90 text-sm mt-2 line-clamp-2">{currentReel.caption}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                {currentReel.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 flex items-center gap-1 px-0"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{currentReel.likes}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 flex items-center gap-1 px-0"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{currentReel.comments}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 px-0"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 px-0"
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Recommended */}
        <div className="hidden lg:block lg:w-72">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {['creative', 'filmmaking', 'travel', 'tech', 'cooking', 'music', 'fitness', 'education'].map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-slate-100 hover:bg-slate-200 cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}