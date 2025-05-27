'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import type { Post } from '@/types/types'; // <-- Use shared type here
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from 'lucide-react';
import LikeButton from '@/components/LikeButton';
import SaveButton from '@/components/SaveButton';

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
export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post>();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/post/${postId}`);
        if (response.status === 200) {
          setPost(response.data);
          setLikesCount(response.data.likes?.length || 0);
        } else {
          toast.error("Error fetching post");
        }
      } catch (error) {
        toast.error("Error fetching post");
      }
    };
    fetchPost();
  }, [postId]);

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
          title: 'Check out this post',
          text: post?.caption || 'Amazing post!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Error sharing post");
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

  if (!post) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          <p className="text-white text-sm">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <button 
        onClick={() => window.history.back()}
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex w-full h-full max-w-7xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        <div className="flex-1 bg-black flex items-center justify-center min-h-0">
          <img
            src={post.postUrl}
            alt="Post"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="w-[400px] bg-gray-900 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                onClick={() => router.push(`/${post.userId?.username}`)}
                  src={post.userId?.avatar || '/default-avatar.png'}
                  alt={post.userId?.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600"
                />
              </div>
              <div>
                <h3
                  className="font-semibold text-sm text-white"
                  onClick={() => router.push(`/${post.userId?.username}`)}
                >
                  {post.userId?.username}
                </h3>
                <p className="text-xs text-gray-400">
                  {post?.createdAt ? formatTimeAgo(post.createdAt.toString()) : ''}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>


          <div className="flex-1 overflow-y-auto min-h-0">
            {post.caption && (
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-start space-x-3">
                  <img
                    src={post.userId?.avatar || '/default-avatar.png'}
                    alt={post.userId?.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-white mr-2">{post.userId?.username}</span>
                      <span className="text-gray-300">{post.caption}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {post?.createdAt ? formatTimeAgo(post.createdAt.toString()) : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1">
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
          <div className="border-t border-gray-700 bg-gray-900">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <LikeButton postId={post._id}/>
                <button className="p-2 -m-2 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 -m-2 text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-110"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <SaveButton postId={post._id} />
            </div>
            <div className="border-t border-gray-700 p-4">
              <form onSubmit={handleComment} className="flex items-center space-x-3">
                <div className="flex-1 flex items-center space-x-3 bg-gray-800 rounded-full px-4 py-2 focus-within:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500/30 transition-colors">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="text-blue-400 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:text-blue-300 transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}