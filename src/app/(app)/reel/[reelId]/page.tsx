'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { IReel } from '@/models/reels.model';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from 'lucide-react';
import ReelComponent from '@/components/ReelComponent'; // Adjust path as needed

interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

export default function ReelPage() {
  const { reelId } = useParams();
  const [reel, setReel] = useState<IReel | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!reelId) return;

    const fetchReel = async () => {
      try {
        const response = await axios.get(`/api/reel/${reelId}`);
        if (response.status === 200) {
          setReel(response.data);
          setLikesCount(response.data.likes?.length || 0);
        } else {
          toast.error("Error fetching reel");
        }
      } catch (error) {
        toast.error("Error fetching reel");
      }
    };
    fetchReel();
  }, [reelId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      _id: Date.now().toString(),
      userId: {
        _id: 'current-user',
        username: 'you',
        avatar: '/default-avatar.png'
      },
      text: newComment,
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
    toast.success("Comment added!");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this reel',
          text: reel?.caption || reel?.title || 'Amazing reel!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Error sharing reel");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (!reel) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          <p className="text-white text-sm">Loading reel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto">
      <button 
        onClick={() => window.history.back()}
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl max-h-[90vh]">
        {/* Video Section */}
        <div className="md:flex-1 bg-black flex items-center justify-center min-h-[400px] max-h-[90vh] overflow-hidden">
          <div className="w-full h-full max-w-md md:max-w-full md:max-h-[90vh] mx-auto flex items-center justify-center">
            {/* Make ReelComponent fill height and maintain aspect ratio */}
            <ReelComponent
              src={reel.reelUrl}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[400px] bg-gray-900 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  onClick={() => router.push(`/${reel.userId?.username}`)}
                  src={reel.userId?.avatar || '/default-avatar.png'}
                  alt={reel.userId?.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600 cursor-pointer"
                />
              </div>
              <div>
                <h3
                  className="font-semibold text-sm text-white cursor-pointer hover:text-gray-300"
                  onClick={() => router.push(`/${reel.userId?.username}`)}
                >
                  {reel.userId?.username}
                </h3>
                <p className="text-xs text-gray-400">
                  {reel?.createdAt ? formatTimeAgo(reel.createdAt.toString()) : ''}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Title and Caption Section */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Title */}
            {reel.title && (
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-2">{reel.title}</h2>
              </div>
            )}

            {/* Caption */}
            {reel.caption && (
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-start space-x-3">
                  <img
                    src={reel.userId?.avatar || '/default-avatar.png'}
                    alt={reel.userId?.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-white mr-2">{reel.userId?.username}</span>
                      <span className="text-gray-300">{reel.caption}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {reel?.createdAt ? formatTimeAgo(reel.createdAt.toString()) : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-3 p-4 hover:bg-gray-800/50 transition-colors">
                    <img
                      src={comment.userId?.avatar || '/default-avatar.png'}
                      alt={comment.userId?.username}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-white mr-2">{comment.userId?.username}</span>
                        <span className="text-gray-300">{comment.text}</span>
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(comment.createdAt)}
                        </p>
                        <button className="text-xs text-gray-400 hover:text-gray-200 font-medium">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm">No comments yet</p>
                  <p className="text-gray-500 text-xs">Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons & Engagement */}
          <div className="border-t border-gray-700 bg-gray-900">
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`p-2 -m-2 transition-all duration-200 hover:scale-110 ${
                    isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className="w-6 h-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Share"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <button
                onClick={handleBookmark}
                className={`p-2 transition-all duration-200 hover:scale-110 ${
                  isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Likes count */}
            <div className="px-4 pb-2">
              <p className="text-sm text-gray-400">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</p>
            </div>

            {/* Add Comment Input */}
            <form
              onSubmit={handleComment}
              className="flex items-center p-4 gap-2 border-t border-gray-700"
            >
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-sm text-white placeholder-gray-500 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
