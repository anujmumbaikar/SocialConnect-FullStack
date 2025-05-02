'use client'

import React from 'react'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'

export default function ExplorePage() {
  return (
    <div className="w-[82vw]">
      {/* Header - Instagram Style */}
      <div className="border-b py-4 px-4 md:px-0 flex justify-center">
        <div className="w-full max-w-screen-lg">
          <h1 className="text-xl font-semibold">Explore</h1>
        </div>
      </div>
      <div className="flex justify-center px-0 py-0">
        <div className="w-full max-w-screen-lg">
          {/* Instagram-style grid - exactly 3 columns with tiny gaps */}
          <div className="grid grid-cols-3 gap-1">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="aspect-square relative group cursor-pointer">
                <img
                  src={`https://source.unsplash.com/random/900x900?sig=${i}`}
                  alt={`Explore ${i}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Instagram-style hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <div className="flex items-center space-x-6 text-white">
                    <div className="flex items-center">
                      <Heart className="h-6 w-6 fill-white mr-2" />
                      <span className="font-semibold">{Math.floor(Math.random() * 1000) + 5}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-6 w-6 fill-white mr-2" />
                      <span className="font-semibold">{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}