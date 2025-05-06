"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import ReelComponent from "@/components/ReelComponent";
import axios from "axios";
import { toast } from "sonner";
import Reel,{IReel,IPopulatedReel} from "@/models/reels.model";

export default function ReelsPage() {
  const router = useRouter();
  const [reels, setReels] = useState<IPopulatedReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");

  const toggleMute = () => {
    setMuted(!muted);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const fetchReels = async() => {
      setLoading(true);
      try {
        const response = await axios.get('/api/get-reels');
        const data = response.data;
        if (!data || !data.reels || data.reels.length === 0) {
          toast.error("No reels found");
          return;
        }
        
        // Process the reels data to add default values for likes, comments, views
        const processedReels = data.reels.map((reel: IPopulatedReel) => ({
          ...reel,
          // likes: reel.likes || Math.floor(Math.random() * 1000) + 100,
          // comments: reel.comments || Math.floor(Math.random() * 100) + 10,
          // views: reel.views || Math.floor(Math.random() * 10000) + 1000,
          username: reel.userId?.username || "Unknown User"
        }));
        
        setReels(processedReels);
      } catch (error) {
        console.error("Error fetching reels:", error);
        toast.error("Error fetching reels");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReels();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen w-[82vw]">
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
            <Tabs defaultValue="for-you" className="w-[300px]" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="for-you">For You</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {loading ? (
            <div className="relative bg-black rounded-xl overflow-hidden shadow-lg aspect-[9/16] max-h-[75vh] flex items-center justify-center">
              <div className="text-white">Loading reels...</div>
            </div>
          ) : reels.length === 0 ? (
            <div className="relative bg-black rounded-xl overflow-hidden shadow-lg aspect-[9/16] max-h-[75vh] flex items-center justify-center">
              <div className="text-white">No reels available</div>
            </div>
          ) : (
            <div className="space-y-6">
              {reels.map((reel, index) => (
                <div key={reel._id || index} className="relative bg-black rounded-xl overflow-hidden shadow-lg aspect-[9/16] max-h-[75vh]">
                  <ReelComponent
                    src={reel.reelUrl}
                  />
                  {/* Content Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <div className="flex items-start mb-3">
                      <Avatar className="h-11 w-11 border-2 border-white mr-3">
                        <AvatarImage src={reel.userId?.avatar} alt={reel.userId?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white font-bold">
                          {reel.userId?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">{reel.userId?.username}</p>
                            <p className="text-white/70 text-xs">views</p>
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                            Follow
                          </Button>
                        </div>
                        <p className="text-white/90 text-sm mt-2 line-clamp-2">{reel.caption}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white hover:bg-white/10 flex items-center gap-1 px-0"
                        >
                          <Heart className="h-5 w-5" />
                          <span>Likes</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white hover:bg-white/10 flex items-center gap-1 px-0"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>Comments</span>
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
              ))}
            </div>
          )}
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
                  {['creative', 'filmmaking', 'travel', 'tech', 'coding', 'music', 'fitness', 'education'].map((tag, i) => (
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