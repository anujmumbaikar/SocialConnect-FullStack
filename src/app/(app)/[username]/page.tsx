'use client'

import { useRouter, useParams } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

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
  const [activeTab, setActiveTab] = useState('posts')

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

  if (status === 'loading' || loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[70vh] px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="w-full flex justify-center items-center min-h-[70vh] px-4 py-6">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">{error || 'Profile not found'}</p>
          <p className="text-gray-600">The profile you are looking for doesn't exist or is not available.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[82vw] flex flex-col mx-auto px-4 py-6">
      <div className="w-full lg:w-[85%] mx-auto">
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
                alt={profileData.username || "User"}
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
              <h2 className="text-xl font-medium text-center md:text-left">{profileData.username}</h2>
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
                      onClick={() => router.push('/settings')}
                    >
                      Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition">
                      Follow
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-1.5 rounded-md text-sm font-medium transition">
                      Message
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-md text-sm font-medium transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                      </svg>
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
              <p className="text-sm whitespace-pre-wrap">{profileData.bio || 'No bio available'}</p>
              {profileData.website && (
                <a href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-sm text-blue-600 hover:underline">
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

        {/* Highlights */}
        <section className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                </div>
                <span className="text-xs">New</span>
              </div>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="border-t border-gray-300">
          <div className="flex justify-around text-sm font-medium">
            <button 
              className={`py-3 flex items-center gap-1 ${activeTab === 'posts' ? 'border-t border-black text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('posts')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className={activeTab !== 'posts' ? 'opacity-60' : ''}>
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
              </svg>
              POSTS
            </button>
            <button 
              className={`py-3 flex items-center gap-1 ${activeTab === 'reels' ? 'border-t border-black text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reels')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className={activeTab !== 'reels' ? 'opacity-60' : ''}>
                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
              </svg>
              REELS
            </button>
            <button 
              className={`py-3 flex items-center gap-1 ${activeTab === 'tagged' ? 'border-t border-black text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('tagged')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className={activeTab !== 'tagged' ? 'opacity-60' : ''}>
                <path d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3a.5.5 0 0 1 0 1h-2.628l-1.38 3.742a.5.5 0 0 1-.944 0L7 5.464 5.47 9.208A.5.5 0 0 1 5 9.5H2a.5.5 0 0 1 0-1h2.628l1.38-3.742A.5.5 0 0 1 6 2z"/>
              </svg>
              TAGGED
            </button>
            {isOwnProfile && (
              <button 
                className={`py-3 flex items-center gap-1 ${activeTab === 'saved' ? 'border-t border-black text-black' : 'text-gray-500'}`}
                onClick={() => setActiveTab('saved')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className={activeTab !== 'saved' ? 'opacity-60' : ''}>
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                </svg>
                SAVED
              </button>
            )}
          </div>
        </section>

        {/* Posts Grid */}
        {activeTab === 'posts' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2">
            {(profileData.posts?.length > 0
              ? profileData.posts
              : [...Array(9)]
            ).map((post: Post | undefined, i: number) => (
              <div key={i} className="aspect-square bg-gray-200 relative group cursor-pointer">
                <img
                  src={
                    (post as Post)?.imageUrl || `/api/placeholder/400/400`
                  }
                  alt={`Post ${i + 1}`}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-4 text-white font-semibold">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                      </svg>
                      <span>{Math.floor(Math.random() * 100)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                      </svg>
                      <span>{Math.floor(Math.random() * 20)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Alternative content for other tabs */}
        {activeTab === 'reels' && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="text-gray-400 mb-4">
              <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700">No Reels Yet</h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              {isOwnProfile 
                ? "Start creating reels to share your moments with your followers." 
                : "This user hasn't posted any reels yet."}
            </p>
            {isOwnProfile && (
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Create New Reel
              </button>
            )}
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="text-gray-400 mb-4">
              <path d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3a.5.5 0 0 1 0 1h-2.628l-1.38 3.742a.5.5 0 0 1-.944 0L7 5.464 5.47 9.208A.5.5 0 0 1 5 9.5H2a.5.5 0 0 1 0-1h2.628l1.38-3.742A.5.5 0 0 1 6 2z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700">No Tagged Posts</h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              {isOwnProfile 
                ? "When people tag you in photos, they'll appear here." 
                : "This user hasn't been tagged in any posts yet."}
            </p>
          </div>
        )}

        {activeTab === 'saved' && isOwnProfile && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="text-gray-400 mb-4">
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700">No Saved Posts</h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              Save posts to view them later. Only you can see what you've saved.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}