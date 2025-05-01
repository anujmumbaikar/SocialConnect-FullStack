'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="w-full flex mx-auto px-4 py-6 gap-6 bg-amber-200">
      {/* Left feed: Stories + Posts */}
      <div className="w-[50%] space-y-6 mx-auto">
        {/* Stories Section */}
        <section className="bg-white border rounded-xl p-4">
          <h2 className="text-base font-semibold mb-3">Stories</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {[...Array(15)].map((_, i) => {
              const username = `user${i + 1}`
              return (
                <div
                  key={i}
                  onClick={() => router.push(`/${username}/stories`)}
                  className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-300 border-2 border-pink-500" />
                  <span className="text-xs">{username}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Post Cards */}
        <section className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <CardTitle className="text-sm font-semibold">user_{i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gray-100 rounded-md mb-3" />
                <p className="text-sm">This is the caption for post {i + 1}.</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      {/* Suggested Accounts */}
      <div className="hidden lg:block w-[280px] space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Suggested Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <span className="text-sm">user_{i + 6}</span>
                </div>
                <button className="text-blue-500 text-xs hover:underline">Follow</button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
