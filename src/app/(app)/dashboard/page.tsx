"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="w-[82vw] flex mx-auto px-4 py-6 gap-6">
      <div className="w-full lg:w-[65%] space-y-6 mx-auto">
        <section className="bg-white border rounded-xl p-4">
          <h2 className="text-base font-semibold mb-3">Stories</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {[...Array(15)].map((_, i) => {
              const username = `user${i + 1}`;
              return (
                <div
                  key={i}
                  onClick={() => router.push(`/${username}/stories`)}
                  className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                    <div className="bg-white rounded-full p-0.5 h-full w-full">
                      <div className="bg-gray-300 h-full w-full rounded-full" />
                    </div>
                  </div>
                  <span className="text-xs">{username}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6 w-[60%] flex flex-col mx-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#121212] rounded-xl border border-[#2a2a2a]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600" />
                  <span className="text-sm font-semibold text-white">
                    user_{i + 1}
                  </span>
                </div>
                <button className="text-white text-xl">•••</button>
              </div>

              {/* Post Image */}
              <div className="w-full aspect-square bg-gray-800 overflow-hidden">
                <img
                  src={`https://source.unsplash.com/random/800x800?sig=${i}`} // Random image with square aspect ratio
                  alt="post"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 px-4 py-2 text-white text-xl">
                <button>♡</button> {/* Like */}
                <button>💬</button> {/* Comment */}
                <button>📤</button> {/* Share */}
              </div>

              {/* Caption */}
              <div className="px-4 pb-4">
                <p className="text-sm text-white">
                  <span className="font-semibold">user_{i + 1}</span> This is
                  the caption for post {i + 1}.
                </p>
              </div>
            </div>
          ))}
        </section>
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