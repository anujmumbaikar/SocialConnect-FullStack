"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
export default function ProfilePage() {
  const router = useRouter();
  const { username } = useParams() as { username: string };
  const { data: session, status } = useSession();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile =
    session?.user &&
    (profileData?.user.email === session.user.email ||
      profileData?.user.username === session.user.username);

  useEffect(() => {
    if (status === "loading") return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/get-user-data?username=${encodeURIComponent(username)}`
        );
        setProfileData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username, status]);
  const handleLogout = () => signOut();
  const handleProfileClick = () => router.push(`/${username}/stories`);

  if (status === "loading" || loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[70vh] px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="w-full flex justify-center items-center min-h-[70vh] px-4 py-6">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            {error || "Profile not found"}
          </p>
          <p className="text-gray-600">
            The profile you are looking for doesn't exist or is not available.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[82vw] flex flex-col mx-auto px-4 py-6">
      <div className="w-full lg:w-[85%] mx-auto">
        <section className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">

          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5 cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="bg-white rounded-full p-0.5 h-full w-full flex items-center justify-center">
              <img
                src={profileData.user.avatar || profileData.user.image}
                alt={profileData.username || "User"}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-xl font-medium text-center md:text-left">
                {profileData.user.username}
              </h2>
              <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                {isOwnProfile ? (
                  <>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-1.5 rounded-md text-sm font-medium transition"
                      onClick={() => router.push(`/${username}/edit-profile`)}
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
                    >
                      Logout
                    </button>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-1.5 rounded-md text-sm font-medium transition"
                      onClick={() => router.push("/settings")}
                    >
                      Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition">
                      Follow
                    </button>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-1.5 rounded-md text-sm font-medium transition"
                      onClick={() => router.push(`/messages`)}
                    >
                      Message
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-md text-sm font-medium transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 justify-center md:justify-start text-sm">
              <div>
                <span className="font-semibold">
                  {profileData.posts?.length || 0}
                </span>{" "}
                posts
              </div>
              <div>
                <span className="font-semibold">
                  {profileData.followers?.length || 0}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold">
                  {profileData.following?.length || 0}
                </span>{" "}
                following
              </div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold">
                {profileData.user.fullname || profileData.user.username}
              </h3>
              <p className="text-sm whitespace-pre-wrap">
                {profileData.user.bio || "No bio available"}
              </p>
              {profileData.website && (
                <a
                  href={
                    profileData.website.startsWith("http")
                      ? profileData.website
                      : `https://${profileData.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {profileData.website}
                </a>
              )}
              {profileData.location && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="inline-block mr-1">📍</span>
                  {profileData.location}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                  <div className="bg-white rounded-full p-0.5 h-full w-full flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gray-200" />
                  </div>
                </div>
                <span className="text-xs">Highlight {i + 1}</span>
              </div>
            ))}
            {isOwnProfile && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                </div>
                <span className="text-xs">New</span>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-gray-300">
          <div className="flex justify-around text-sm font-medium">
            <button
              className={`py-3 flex items-center gap-1 ${activeTab === "posts" ? "border-t border-black text-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("posts")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
                className={activeTab !== "posts" ? "opacity-60" : ""}
              >
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
              </svg>
              POSTS
            </button>
            <button
              className={`py-3 flex items-center gap-1 ${activeTab === "reels" ? "border-t border-black text-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("reels")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
                className={activeTab !== "reels" ? "opacity-60" : ""}
              >
                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
              </svg>
              REELS
            </button>
            <button
              className={`py-3 flex items-center gap-1 ${activeTab === "tagged" ? "border-t border-black text-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("tagged")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
                className={activeTab !== "tagged" ? "opacity-60" : ""}
              >
                <path d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3a.5.5 0 0 1 0 1h-2.628l-1.38 3.742a.5.5 0 0 1-.944 0L7 5.464 5.47 9.208A.5.5 0 0 1 5 9.5H2a.5.5 0 0 1 0-1h2.628l1.38-3.742A.5.5 0 0 1 6 2z" />
              </svg>
              TAGGED
            </button>
            {isOwnProfile && (
              <button
                className={`py-3 flex items-center gap-1 ${activeTab === "saved" ? "border-t border-black text-black" : "text-gray-500"}`}
                onClick={() => router.push("/saved")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className={activeTab !== "saved" ? "opacity-60" : ""}
                >
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                </svg>
                SAVED
              </button>
            )}
          </div>
        </section>
        {activeTab === "posts" && (
          <section className="grid grid-cols-3 gap-1 md:gap-4">
            {profileData.posts?.map((post: any) => (
              <div
                key={post._id}
                className="relative group aspect-square cursor-pointer overflow-hidden rounded-[16px] bg-gray-100"
                onClick={() => router.push(`/post/${post._id}`)}
              >
                <img
                  src={post.postUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {/* Overlay with user info, appears on hover */}
                <div className="absolute bottom-2 left-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 rounded-full px-2 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={post.userId.avatar}
                      alt={post.userId.username}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                      {post.userId.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-white">
                    {post.userId.username}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "reels" && (
          <section className="grid grid-cols-3 gap-1 md:gap-4">
            {profileData.reels?.length === 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="text-gray-400 mb-4"
                >
                  <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2z" />
                </svg>
                <p className="text-gray-500 text-lg">No reels yet</p>
              </div>
            )}
            {profileData.reels?.map((reel: any) => (
              <div
                key={reel._id}
                className="relative group aspect-[3/4] bg-black rounded-[16px] overflow-hidden cursor-pointer"
                onClick={() => router.push(`/reel/${reel._id}`)}
              >
                <video
                  src={reel.reelUrl}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={reel.thumbnailUrl || ""}
                  // Play/pause on hover
                  onMouseOver={(e) => e.currentTarget.play()}
                  onMouseOut={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                {/* Optional: Play icon overlay */}
                <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                  </svg>
                </div>
                {/* Optional: Caption on hover */}
                <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white truncate">
                  {reel.caption}
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "tagged" && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="text-gray-400 mb-4"
            >
              <path d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3a.5.5 0 0 1 0 1h-2.628l-1.38 3.742a.5.5 0 0 1-.944 0L7 5.464 5.47 9.208A.5.5 0 0 1 5 9.5H2a.5.5 0 0 1 0-1h2.628l1.38-3.742A.5.5 0 0 1 6 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700">
              No Tagged Posts
            </h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              {isOwnProfile
                ? "When people tag you in photos, they'll appear here."
                : "This user hasn't been tagged in any posts yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}