"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReelComponent from "@/components/ReelComponent";
import axios from "axios";
import { toast } from "sonner";
import type { Reel } from "@/types/types";

export default function ReelsPage() {
  const router = useRouter();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");

  const toggleMute = () => setMuted(!muted);
  const togglePlay = () => setIsPlaying(!isPlaying);

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
        
        // Process the reels data
        const processedReels = data.reels.map((reel: Reel) => ({
          ...reel,
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
    <div className="min-h-screen w-[82vw] mx-auto flex justify-center items-center">
      {loading ? (
        <div className="text-white">Loading reels...</div>
      ) : reels.length === 0 ? (
        <div className="text-white">No reels available</div>
      ) : (
        <div className="overflow-y-scroll snap-y snap-mandatory h-screen w-full space-y-4">
          {reels.map((reel, index) => (
            <div
              key={reel._id || index}
              className="relative bg-black snap-start rounded-xl overflow-hidden shadow-lg aspect-[9/16] max-h-[95vh] mx-auto"
            >
              <ReelComponent src={reel.reelUrl} />

              {/* Overlay Content */}
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
                        <p 
                          onClick={() => router.push(`/${reel.userId?.username}`)} 
                          className="text-white font-semibold cursor-pointer"
                        >
                          {reel.userId?.username}
                        </p>
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
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-1 px-0">
                      <Heart className="h-5 w-5" />
                      <span>Likes</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-1 px-0">
                      <MessageCircle className="h-5 w-5" />
                      <span>Comments</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 px-0">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 px-0">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}