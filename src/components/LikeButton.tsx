import axios from "axios";
import { useState } from "react";
import { Heart } from "lucide-react"; // Example icon
import { toast } from "sonner";

const LikeButton = ({ postId }: { postId: string }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleToggleLike = async () => {
    try {
      const response = await axios.post(`/api/post/${postId}/like`);
      if (response.status === 200 || response.status === 201) {
        setIsLiked((prev) => !prev); // Toggle the like state
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to toggle like");
    }
  };

  return (
    <button onClick={handleToggleLike} className="text-gray-500 hover:text-gray-800">
      {isLiked ? <Heart className="h-5 w-5 text-red-500" fill="currentColor" /> : <Heart className="h-5 w-5" />}
    </button>
  );
};

export default LikeButton;