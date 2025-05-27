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
  Calendar,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Post } from "@/types/types";
import PostComponent from "@/components/PostComponent";
import LikeButton from "@/components/LikeButton";
import SaveButton from "@/components/SaveButton";

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<{ username: string; avatar: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchByUsername, setSearchByUsername] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/get-users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/get-posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.posts || []);     
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchByUsername) {
      router.push(`/${searchByUsername}`);
    }
  };

  // Format date nicely
  const formatDate = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.abs(now.getTime() - postDate.getTime()) / 36e5;

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return postDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen w-[82vw]">
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
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                      onClick={() => router.push(`/${user.username}`)}
                    >
                     <Avatar className="border border-red-500">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          {user.username
                            ? user.username.substring(0, 2).toUpperCase()
                            : "NA"}
                        </AvatarFallback>
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
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant={isGridView ? "ghost" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsGridView(false)}
                >
                  List
                </Button>
                <Button
                  variant={isGridView ? "outline" : "ghost"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsGridView(true)}
                >
                  Grid
                </Button>
              </div>
            </div>

            <TabsContent value="featured" className="space-y-6">
              <section className="bg-white shadow-sm rounded-xl p-4">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Highlighted Stories</span>
                </h2>

                <div className="relative">
                  <div
                    className={`flex overflow-x-auto pb-2 no-scrollbar gap-4`}
                  >
                    {users.map((user) => (
                      <div
                        key={user.username}
                        // onClick={() => router.push(`/${user.username}/stories`)}
                        className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-600 p-0.5">
                          <div className="bg-white rounded-full p-0.5 h-full w-full">
                            <Avatar className="h-full w-full">
                              <AvatarImage
                                src={user.avatar}
                                alt={user.username}
                              />
                              <AvatarFallback className="bg-slate-200 text-purple-800">
                                {user.username
                                  ? user.username.substring(0, 2).toUpperCase()
                                  : "NA"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <span className="text-xs truncate max-w-16 text-center">
                          {user.username}
                        </span>
                      </div>
                    ))}

                    {users.length < 2 &&
                      [...Array(2 - users.length)].map((_, i) => (
                        <div
                          key={`placeholder-${i}`}
                          className="flex flex-col items-center gap-1 cursor-pointer shrink-0 opacity-0"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-600 p-0.5">
                            <div className="bg-white rounded-full p-0.5 h-full w-full">
                              <div className="bg-slate-200 h-full w-full rounded-full" />
                            </div>
                          </div>
                          <span className="text-xs">placeholder</span>
                        </div>
                      ))}
                  </div>

                  {users.length > 5 && (
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                  )}
                </div>
              </section>

              {isGridView ? (
                <div className="grid grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <Card
                      key={post._id}
                      className="overflow-hidden border-none shadow-md rounded-xl transition-all hover:shadow-lg"
                      onClick={() => router.push(`/post/${post._id}`)}
                    >
                      <div className="aspect-square">
                        <PostComponent src={post.postUrl} caption={post.caption} />
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.userId.avatar} alt={post.userId.username} />
                            <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                              {post.userId.username?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{post.userId.username}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="py-3 px-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                          <LikeButton postId={post._id} />
                          <SaveButton postId={post._id} />
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                posts.map((post) => (
                  <Card
                    key={post._id}
                    className="overflow-hidden border-none shadow-md rounded-xl transition-all hover:shadow-lg"
                  >
                    <CardHeader className="py-3 px-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() =>
                            router.push(`/${post.userId.username}`)
                          }
                        >
                          <Avatar>
                            <AvatarImage
                              src={post.userId.avatar}
                              alt={post.userId.username}
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-800">
                              {post.userId.username
                                ? post.userId.username
                                    .substring(0, 2)
                                    .toUpperCase()
                                : "NA"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium hover:text-purple-600 transition-colors">
                              {post.userId.username}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(new Date(post.createdAt))}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>

                    <div
                      className="bg-slate-100 overflow-hidden cursor-pointer"
                      onClick={() => router.push(`/post/${post._id}`)}
                    >
                      <div className="max-h-[640px] mx-auto">
                        <PostComponent
                          src={post.postUrl}
                          caption={post.caption}
                          aspectRatio={
                            post.transformation?.height /
                              post.transformation?.width || undefined
                          }
                        />
                      </div>
                    </div>

                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">{post.caption}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>New York, NY</span>
                      </div>
                    </CardContent>
                    <CardFooter className="py-3 px-4 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-4">
                        <LikeButton postId={post._id} />
                        <SaveButton postId={post._id} />
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
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
              <Card className="overflow-hidden border-none shadow-sm">
                <CardContent className="pt-4">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by username"
                      className="w-full rounded-md border border-slate-200 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchByUsername}
                      onChange={(e) => setSearchByUsername(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="ml-2 bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    >
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            {/* Recommended */}
            <Card className="overflow-hidden border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Recommended for you
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!loading && users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between"
                    >
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push(`/${user.username}`)}
                      >
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback className="bg-purple-100 text-purple-800">
                            {user.username
                              ? user.username.substring(0, 2).toUpperCase()
                              : "NA"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm hover:text-purple-600 transition-colors">
                          {user.username}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
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
                  className="w-full text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  View All Recommendations
                </Button>
              </CardFooter>
            </Card>

            {/* Footer */}
            <div className="text-xs text-gray-500 px-2">
              <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
                <span className="cursor-pointer hover:underline hover:text-purple-600 transition-colors">
                  About
                </span>
                <span>•</span>
                <span className="cursor-pointer hover:underline hover:text-purple-600 transition-colors">
                  Terms
                </span>
                <span>•</span>
                <span className="cursor-pointer hover:underline hover:text-purple-600 transition-colors">
                  Privacy
                </span>
                <span>•</span>
                <span className="cursor-pointer hover:underline hover:text-purple-600 transition-colors">
                  Help
                </span>
              </div>
              <p>© 2025 Your Platform Name</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
