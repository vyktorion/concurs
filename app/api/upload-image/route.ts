import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Autentificare necesară' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const folder = formData.get('folder') as string || '/uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'Nu a fost selectat niciun fișier' },
        { status: 400 }
      );
    }

    // Validare tip fișier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Doar fișierele imagine sunt permise' },
        { status: 400 }
      );
    }

    // Validare dimensiune (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fișierul este prea mare. Dimensiunea maximă este 5MB' },
        { status: 400 }
      );
    }

    // Convertim fișierul în buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configurare ImageKit
    const ImageKit = require('imagekit');
    
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    });

    // Upload la ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName || `upload-${Date.now()}`,
      folder: folder,
      useUniqueFileName: true,
    
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea imaginii' },
      { status: 500 }
    );
  }
}