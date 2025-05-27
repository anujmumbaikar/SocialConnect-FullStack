import axios from "axios";
import { useState } from "react";
import { Bookmark } from "lucide-react"; // Example icon
import { toast } from "sonner";

const SaveButton = ({ postId }: { postId: string }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleSave = async () => {
    try {
      const response = await axios.post(`/api/post/${postId}/save`);
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
      <Bookmark className={`h-5 w-5 ${isSaved ? "text-blue-500 fill-blue-500" : ""}`} />
    </button>
  );
};

export default SaveButton;