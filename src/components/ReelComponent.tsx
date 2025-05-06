import { VIDEO_DIMENSIONS } from '@/models/reels.model';
import { Video } from '@imagekit/next';
export default function PostComponent({src,caption,aspectRatio}: {src:string, caption:string, aspectRatio?: number}) {
  return (
    <div>
      <Video
      urlEndpoint="https://ik.imagekit.io/anujmumbaikar12"
      priority={true} // {false} | {true}
      src={src || ""}
      width={VIDEO_DIMENSIONS.width}
      height={VIDEO_DIMENSIONS.height}
      alt="Picture of the author"
      transformation={[{ width:VIDEO_DIMENSIONS.width, height: VIDEO_DIMENSIONS.height, quality: 80 }]}
      
      style={{
        objectFit: 'contain',
      }}
    />
    </div>
  )
}