import {NextResponse} from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import ImageKit from 'imagekit';
import { getUploadAuthParams } from "@imagekit/next/server"

const imagekit = new ImageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
//check at 2.52.00
    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    })
    return Response.json({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error check auth parameters' }, { status: 500 });
    }
}