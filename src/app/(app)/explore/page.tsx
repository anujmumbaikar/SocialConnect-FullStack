'use client';

import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Bookmark, Zap, Filter, TrendingUp, Grid, Layout } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IPopulatedPost } from '@/models/post.model';

export default function ExplorePage() {
  const [posts, setPosts] = useState<IPopulatedPost[]>([]);

  useEffect(()=>{
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/get-posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        console.log("Fetched posts:", data.posts);
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="bg-slate-50 w-[82vw]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <h1 className="text-xl font-semibold">Explore</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <div className="flex border rounded-md overflow-hidden">
              <Button variant="ghost" size="sm" className="rounded-none border-r px-3 py-1 h-9">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-none px-3 py-1 h-9">
                <Layout className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="trending" className="w-full mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Featured Highlight */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0 relative aspect-[21/9]">
            <img
              src="https://static.vecteezy.com/system/resources/previews/017/214/886/non_2x/spring-green-fields-landscape-with-mountain-blue-sky-and-clouds-background-panorama-peaceful-rural-nature-in-springtime-with-green-grass-land-cartoon-illustration-for-spring-and-summer-banner-vector.jpg"
              alt="Featured post"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Featured Content</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Discover trending content from top creators</h2>
                <p className="text-sm text-gray-200 mb-4">Explore the most popular posts across our community</p>
                <div className="flex items-center gap-4">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Learn More
                  </Button>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>2.4k</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>142</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid - Modified but keeping the essence */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((posts) => (
            <div 
              key={posts._id} 
              className="aspect-square relative group cursor-pointer bg-slate-200 rounded-lg overflow-hidden shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              <img
                src={`${posts.postUrl}`}
                alt={`Explore`}
                className="w-full h-full object-cover"
              />
              
              {/* Hover overlay with improved styling */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 1000) + 5}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Load More Content
          </Button>
        </div>
      </div>
    </div>
  );
}