import { VIDEO_DIMENSIONS } from '@/models/reels.model';
import { Video } from '@imagekit/next';
export default function Page() {
  return (
    <Video
      urlEndpoint="https://ik.imagekit.io/anujmumbaikar12"
      src="/video.mp4"
      controls
      width={500}
      height={500}
    />
  )
}