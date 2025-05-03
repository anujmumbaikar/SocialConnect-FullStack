'use client'
import { useRouter, useParams } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import React from 'react'

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()

  const username = params?.username as string

  const handleProfileClick = () => {
    router.push(`/${username}/stories`)
  }

  const handleLogout = () => {
    signOut()
  }

  // const isOwnProfile = session?.user?.username === username
  const isOwnProfile = true // For demo purposes, assume it's own profile

  return (
    <div className="w-[82vw] flex mx-auto px-4 py-6">
      <div className="w-full lg:w-[65%] mx-auto">
        <section className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          <div 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5 flex-shrink-0 cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="bg-white rounded-full p-0.5 h-full w-full">
              <div className="bg-gray-300 h-full w-full rounded-full" />
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-xl font-medium">{username}</h2>
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <button className="bg-gray-100 text-black px-4 py-1 rounded-md text-sm font-medium" onClick={()=> router.push(`/${username}/edit-profile`)}>
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
                <span className="font-semibold">42</span> posts
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">1,234</span> followers
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">567</span> following
              </div>
            </div>

            <div className="md:text-left text-center">
              <h3 className="font-semibold">Display Name</h3>
              <p className="text-sm">This is my bio. I share photos about my interests and life.</p>
              <p className="text-sm text-blue-900">website.com</p>
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
  )
}
