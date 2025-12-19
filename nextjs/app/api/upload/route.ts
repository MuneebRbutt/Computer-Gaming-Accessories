
import { NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = Buffer.from(await (file as Blob).arrayBuffer());

        // Upload to ImageKit
        const uploadResponse = await new Promise((resolve, reject) => {
            imagekit.upload({
                file: buffer,
                fileName: (file as File).name || 'upload.png',
                folder: '/products'
            }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return NextResponse.json(uploadResponse);

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: (error as Error).message },
            { status: 500 }
        );
    }
}
