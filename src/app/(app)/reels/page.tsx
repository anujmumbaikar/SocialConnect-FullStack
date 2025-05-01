"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reels = [
  {
    id: 1,
    username: "user1",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Check out this awesome reel! #fun",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    username: "user2",
    video: "https://www.w3schools.com/html/movie.mp4",
    caption: "Amazing moments captured.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    username: "user3",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Travel vibes!",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    username: "user4",
    video: "https://www.w3schools.com/html/movie.mp4",
    caption: "Dance like nobody's watching 💃",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

export default function ReelsPage() {
  const router = useRouter();

  return (
    <div className="w-[82vw] flex mx-auto px-4 py-6 gap-6 relative">
      {/* Main reels feed */}
      <div className="w-full lg:w-[65%] mx-auto flex flex-col gap-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Reels</h2>
        <div className="flex flex-col gap-8">
          {reels.map((reel, i) => (
            <div
              key={reel.id}
              className="relative rounded-xl overflow-hidden shadow-lg bg-black aspect-[9/16] max-h-[75vh] flex items-end"
            >
              {/* Reel video */}
              <video
                src={reel.video}
                controls
                loop
                className="absolute inset-0 w-full h-full object-cover"
                poster={reel.avatar}
              />

              {/* Overlay info/actions */}
              <div className="relative z-10 w-full flex justify-between items-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                {/* Left: user & caption */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={reel.avatar}
                      alt={reel.username}
                      className="w-9 h-9 rounded-full border-2 border-white"
                    />
                    <span className="text-white font-semibold text-base">
                      {reel.username}
                    </span>
                    <button
                      className="ml-2 text-xs text-blue-400 font-semibold hover:underline"
                      onClick={() => router.push(`/${reel.username}`)}
                    >
                      Follow
                    </button>
                  </div>
                  <div className="text-white text-sm max-w-xs">
                    {reel.caption}
                  </div>
                </div>
                {/* Right: actions */}
                <div className="flex flex-col items-center gap-4 mr-2 mb-2">
                  <button className="text-white text-2xl hover:scale-110 transition">♡</button>
                  <span className="text-xs text-white">1.2k</span>
                  <button className="text-white text-2xl hover:scale-110 transition">💬</button>
                  <span className="text-xs text-white">300</span>
                  <button className="text-white text-2xl hover:scale-110 transition">📤</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Accounts */}
      <div className="hidden lg:block w-[280px] sticky top-4 h-fit">
        <Card className="bg-white border rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Suggested Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <span className="text-sm">user_{i + 6}</span>
                </div>
                <button className="text-blue-500 text-xs font-semibold hover:text-blue-700">
                  Follow
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
