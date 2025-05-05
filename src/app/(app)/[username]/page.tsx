'use client'
import { useRouter, useParams } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'


interface Post {
  imageUrl: string;
  [key: string]: any;
}

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const user = session?.user
  const username = params?.username as string

  const [profileData, setProfileData] = useState<any>(null)
  const [avatar, setAvatar] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) {
        setLoading(false)
        setError("No username provided")
        return
      }
      
      try {
        setLoading(true)
        // Determine if this is the current user's profile
        const sessionUsername = user?.username || user?.email?.split('@')[0]
        const isOwnProfile = sessionUsername === username
        
        if (isOwnProfile && user) {
          // Use session data for current user
          setProfileData(user)
          setAvatar(user.avatar || user.image || "/default-avatar.png")
        } else {
          // Fetch data from API for other users
          const response = await axios.get(`/api/get-user-data?username=${encodeURIComponent(username)}`)
          const userData = response.data.user
          setProfileData(userData)
          setAvatar(userData.avatar || "/default-avatar.png")
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error)
        setError(error.response?.data?.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchUserData()
    }
  }, [username, user, status])

  // Determine if this is the current user's profile
  const isOwnProfile = user && (
    user.username === username || 
    (!user.username && user.email?.split('@')[0] === username)
  )

  const handleProfileClick = () => {
    router.push(`/${username}/stories`)
  }

  const handleLogout = () => {
    signOut()
  }

  if (loading) {
    return (
      <div className="w-[82vw] flex mx-auto px-4 py-6 justify-center items-center min-h-[50vh]">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="w-[82vw] flex mx-auto px-4 py-6 justify-center items-center min-h-[50vh]">
        <p className="text-red-500">{error || "Profile not found"}</p>
      </div>
    )
  }

  return (
    <div className="w-[82vw] flex mx-auto px-4 py-6">
      <div className="w-full lg:w-[65%] mx-auto">
        <section className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          <div 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5 flex-shrink-0 cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="bg-white rounded-full p-0.5 h-full w-full flex items-center justify-center">
              <img
                src={avatar}
                alt={profileData?.username || "Profile"}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = "/default-avatar.png"
                }}
              />
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-xl font-medium">{profileData?.username}</h2>
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <button
                      className="bg-gray-100 text-black px-4 py-1 rounded-md text-sm font-medium"
                      onClick={() => router.push(`/${username}/edit-profile`)}
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-1 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-medium">Follow</button>
                    <button className="bg-gray-100 text-black px-4 py-1 rounded-md text-sm font-medium">Message</button>
                    <button className="bg-gray-100 text-black px-2 py-1 rounded-md text-sm">⌵</button>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-6 mb-4 justify-center md:justify-start">
              <div className="text-center md:text-left">
                <span className="font-semibold">{profileData?.posts?.length || 42}</span> posts
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">{profileData?.followers?.length || 1234}</span> followers
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">{profileData?.following?.length || 567}</span> following
              </div>
            </div>

            <div className="md:text-left text-center">
              <h3 className="font-semibold">{profileData?.name || profileData?.username}</h3>
              <p className="text-sm">{profileData?.bio || "No bio available"}</p>
              {profileData?.website && (
                <p className="text-sm text-blue-900">{profileData?.website}</p>
              )}
            </div>
          </div>
        </section>

        {/* Highlights */}
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

        {/* Navigation Tabs */}
        <section className="border-t border-gray-300">
          <div className="flex justify-around">
            <button className="py-3 text-sm font-medium border-t border-black">POSTS</button>
            <button className="py-3 text-sm font-medium text-gray-500">REELS</button>
            <button className="py-3 text-sm font-medium text-gray-500">TAGGED</button>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="grid grid-cols-3 gap-1">
            {profileData?.posts?.length > 0 ? (
            profileData.posts.map((post: Post, i: number) => (
              <div key={i} className="aspect-square bg-gray-200 overflow-hidden">
              <img 
                src={post.imageUrl || `/api/placeholder/400/403`}
                alt={`Post ${i + 1}`}
                className="object-cover w-full h-full" 
              />
              </div>
            ))
            ) : (
            [...Array(9)].map((_, i: number) => (
              <div key={i} className="aspect-square bg-gray-200 overflow-hidden">
              <img 
                src={`/api/placeholder/400/403`} 
                alt={`Post ${i + 1}`}
                className="object-cover w-full h-full" 
              />
              </div>
            ))
            )}
        </section>
      </div>
    </div>
  )
}