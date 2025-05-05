'use client'

import { useRouter, useParams } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Post {
  imageUrl: string
  [key: string]: any
}

export default function ProfilePage() {
  const router = useRouter()
  const { username } = useParams() as { username: string }
  const { data: session, status } = useSession()
  const user = session?.user

  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isOwnProfile =
    user && (user.username === username || user.email?.split('@')[0] === username)

  useEffect(() => {
    if (status === 'loading') return

    const fetchUserData = async () => {
      try {
        setLoading(true)
        if (isOwnProfile && user) {
          setProfileData(user)
        } else {
          const res = await axios.get(`/api/get-user-data?username=${encodeURIComponent(username)}`)
          setProfileData(res.data.user)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username, user, status, isOwnProfile])

  const handleLogout = () => signOut()
  const handleProfileClick = () => router.push(`/${username}/stories`)

  if (loading) {
    return (
      <div className="w-[82vw] flex justify-center items-center min-h-[50vh] px-4 py-6">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="w-[82vw] flex justify-center items-center min-h-[50vh] px-4 py-6">
        <p className="text-red-500">{error || 'Profile not found'}</p>
      </div>
    )
  }

  return (
    <div className="w-[82vw] flex mx-auto px-4 py-6">
      <div className="w-full lg:w-[65%] mx-auto">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          {/* Avatar */}
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5 cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="bg-white rounded-full p-0.5 h-full w-full flex items-center justify-center">
              <img
                src={
                  profileData.avatar ||
                  profileData.image ||
                  'https://www.svgrepo.com/show/452030/avatar-default.svg'
                }
                alt={profileData.username}
                className="w-full h-full rounded-full object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = '/default-avatar.png')
                }
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-xl font-medium">{profileData.username}</h2>
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
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-medium">
                      Follow
                    </button>
                    <button className="bg-gray-100 text-black px-4 py-1 rounded-md text-sm font-medium">
                      Message
                    </button>
                    <button className="bg-gray-100 text-black px-2 py-1 rounded-md text-sm">
                      ⌵
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 justify-center md:justify-start text-sm">
              <div><span className="font-semibold">{profileData.posts?.length || 0}</span> posts</div>
              <div><span className="font-semibold">{profileData.followers?.length || 0}</span> followers</div>
              <div><span className="font-semibold">{profileData.following?.length || 0}</span> following</div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold">{profileData.name || profileData.username}</h3>
              <p className="text-sm">{profileData.bio || 'No bio available'}</p>
              {profileData.website && (
                <p className="text-sm text-blue-900">{profileData.website}</p>
              )}
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="mb-8">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300" />
                <span className="text-xs">Highlight {i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <section className="border-t border-gray-300">
          <div className="flex justify-around text-sm font-medium">
            <button className="py-3 border-t border-black">POSTS</button>
            <button className="py-3 text-gray-500">REELS</button>
            <button className="py-3 text-gray-500">TAGGED</button>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="grid grid-cols-3 gap-1">
          {(profileData.posts?.length > 0
            ? profileData.posts
            : [...Array(9)]
          ).map((post: Post | undefined, i: number) => (
            <div key={i} className="aspect-square bg-gray-200 overflow-hidden">
              <img
                src={
                  (post as Post)?.imageUrl || `/api/placeholder/400/403`
                }
                alt={`Post ${i + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
