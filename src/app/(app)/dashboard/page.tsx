"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<{ username: string; avatar: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchByUsername, setSearchByUsername] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/get-users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchByUsername) {
      router.push(`/${searchByUsername}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <span>Explore</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-md cursor-pointer">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Trending</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>Communities</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                  <Bookmark className="h-5 w-5 text-gray-500" />
                  <span>Saved</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <h3 className="text-sm font-medium mb-3">Top Creators</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                      onClick={() => router.push(`/${user.username}`)}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.username} />
                      </Avatar>
                      <span className="text-sm">{user.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-6 space-y-6">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-6">
              <section className="bg-white shadow-sm rounded-xl p-4">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Highlighted Stories</span>
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {[...Array(8)].map((_, i) => {
                    const username = `creator${i + 1}`;
                    return (
                      <div
                        key={i}
                        onClick={() => router.push(`/${username}/stories`)}
                        className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-tr from-purple-400 to-indigo-600 p-0.5">
                          <div className="bg-white rounded-lg p-0.5 h-full w-full">
                            <div className="bg-slate-200 h-full w-full rounded-lg" />
                          </div>
                        </div>
                        <span className="text-xs">{username}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-none shadow-md">
                  <CardHeader className="py-3 px-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-800">
                            {`C${i + 1}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">creator_{i + 1}</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>

                  <div className="w-full aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={`/api/placeholder/800/500`}
                      alt="Post content"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="font-medium mb-2">
                      Amazing discovery in the forest
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      This is an interesting caption that describes what this
                      post is about. It provides context and engages viewers to
                      interact with the content.
                    </p>
                  </CardContent>

                  <CardFooter className="py-3 px-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 px-2"
                      >
                        <Heart className="h-5 w-5" />
                        <span>{243 + i * 57}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 px-2"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span>{42 + i * 13}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="px-2">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="px-2">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="following" className="text-center py-12">
              <p className="text-gray-500">
                Content from accounts you follow will appear here
              </p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                Discover Accounts
              </Button>
            </TabsContent>

            <TabsContent value="recent" className="text-center py-12">
              <p className="text-gray-500">Recent content from the community</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                Browse All
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="space-y-6 sticky top-6">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <Card>
                <CardContent className="pt-4">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by username"
                      className="w-full rounded-md border border-slate-200 pl-10 py-2 text-sm"
                      value={searchByUsername}
                      onChange={(e) => setSearchByUsername(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="ml-2 bg-purple-600 text-white"
                    >
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            {/* Recommended */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Recommended for you
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!loading && users.length > 0 ? (
                  users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                      onClick={() => router.push(`/${user.username}`)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.username} />
                        </Avatar>
                        <span className="text-sm">{user.username}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Follow
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    {loading ? "Loading..." : "No users found."}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-purple-600"
                >
                  View All Recommendations
                </Button>
              </CardFooter>
            </Card>

            {/* Footer */}
            <div className="text-xs text-gray-500 px-2">
              <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
                <span className="cursor-pointer hover:underline">About</span>
                <span>•</span>
                <span className="cursor-pointer hover:underline">Terms</span>
                <span>•</span>
                <span className="cursor-pointer hover:underline">Privacy</span>
                <span>•</span>
                <span className="cursor-pointer hover:underline">Help</span>
              </div>
              <p>© 2025 Your Platform Name</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
