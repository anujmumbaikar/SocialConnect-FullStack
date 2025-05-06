import { POST_DIMENSIONS } from '@/models/post.model';
import { Image } from '@imagekit/next';
export default function PostComponent({src,caption,aspectRatio}: {src:string, caption:string, aspectRatio?: number}) {
  return (
    <Image
      urlEndpoint="https://ik.imagekit.io/anujmumbaikar12"
      src={src || ""}
      width={POST_DIMENSIONS.width}
      height={POST_DIMENSIONS.height}
      alt="Picture of the author"
      transformation={[{ width:POST_DIMENSIONS.width, height: POST_DIMENSIONS.height, quality: 80 }]}
      loading="lazy"
      style={{
        objectFit: 'contain',
      }}
    />
  )
}