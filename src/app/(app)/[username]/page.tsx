'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const { username } = useParams();
  interface UserData {
    displayName: string;
    bio: string;
    website: string;
    posts: number;
    followers: number;
    following: number;
  }
  
  const [userData, setUserData] = useState<UserData | null>(null);

  // Example: Fetch user data (you can remove this block if you're not fetching yet)
  useEffect(() => {
    // Simulate API call
    setUserData({
      displayName: 'Display Name',
      bio: 'This is my bio. I share photos about my interests and life.',
      website: 'website.com',
      posts: 42,
      followers: 1234,
      following: 567,
    });
  }, [username]);

  return (
    <div className="w-[82vw] flex mx-auto px-4 py-6">
      <div className="w-full lg:w-[65%] mx-auto">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          {/* Profile Picture */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5 flex-shrink-0">
            <div className="bg-white rounded-full p-0.5 h-full w-full">
              <div className="bg-gray-300 h-full w-full rounded-full" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-xl font-medium">{username}</h2>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-medium">Follow</button>
                <button className="bg-gray-100 text-black px-4 py-1 rounded-md text-sm font-medium">Message</button>
                <button className="bg-gray-100 text-black px-2 py-1 rounded-md text-sm">⌵</button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 justify-center md:justify-start">
              <div className="text-center md:text-left">
                <span className="font-semibold">{userData?.posts ?? 0}</span> posts
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">{userData?.followers ?? 0}</span> followers
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">{userData?.following ?? 0}</span> following
              </div>
            </div>

            {/* Bio */}
            <div className="md:text-left text-center">
              <h3 className="font-semibold">{userData?.displayName ?? 'Loading...'}</h3>
              <p className="text-sm">{userData?.bio}</p>
              <p className="text-sm text-blue-900">{userData?.website}</p>
            </div>
          </div>
        </section>

        {/* Stories Highlights */}
        <section className="mb-8">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300"></div>
                <span className="text-xs">Highlight {i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Content Navigation */}
        <section className="border-t border-gray-300">
          <div className="flex justify-around">
            <button className="py-3 text-sm font-medium border-t border-black">POSTS</button>
            <button className="py-3 text-sm font-medium text-gray-500">REELS</button>
            <button className="py-3 text-sm font-medium text-gray-500">TAGGED</button>
          </div>
        </section>

        {/* Photo Grid */}
        <section className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 overflow-hidden">
              <img
                src={`/api/placeholder/400/400`}
                alt={`Post ${i + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
