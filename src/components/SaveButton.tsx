import axios from "axios";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

interface SaveButtonProps {
  postId?: string;
  reelId?: string; 
}

const SaveButton = ({ postId, reelId }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleSave = async () => {
    try {
      const endpoint = postId
        ? `/api/post/${postId}/save`
        : `/api/reel/${reelId}/save`;

      const response = await axios.post(endpoint);

      if (response.status === 200 || response.status === 201) {
        setIsSaved((prev) => !prev); 
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to toggle save");
    }
  };

  return (
    <button onClick={handleToggleSave} className="text-gray-500 hover:text-gray-800">
      {isSaved ? (
        <Bookmark className="h-5 w-5 text-blue-500 fill-blue-500" fill="currentColor" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </button>
  );
};

export default SaveButton;