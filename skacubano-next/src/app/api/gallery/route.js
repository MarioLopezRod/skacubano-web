import { NextResponse } from 'next/server';
import { getGalleryData, saveGalleryData } from '@/lib/galleryStore';
import { verifySignedToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const data = getGalleryData();
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado. Inicie sesión como administrador.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const descripcion = formData.get('descripcion') || '';
    const fecha = formData.get('fecha') || new Date().getFullYear().toString();
    const integranteId = formData.get('integranteId') === 'banda' ? null : formData.get('integranteId');
    const esPrincipal = formData.get('esPrincipal') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const filePublicUrl = `/uploads/gallery/${fileName}`;

    const data = getGalleryData();

    const relevantPhotos = data.fotos.filter((f) => f.integranteId === integranteId);
    const maxOrder = relevantPhotos.reduce((max, f) => Math.max(max, f.orden || 0), 0);

    const newPhoto = {
      id: `photo_${timestamp}`,
      url: filePublicUrl,
      descripcion,
      fecha,
      integranteId,
      orden: maxOrder + 1,
      esPrincipal
    };

    if (esPrincipal && integranteId) {
      data.fotos = data.fotos.map((f) => 
        f.integranteId === integranteId ? { ...f, esPrincipal: false } : f
      );
      data.integrantes = data.integrantes.map((m) => 
        m.id === integranteId ? { ...m, fotoPrincipalUrl: filePublicUrl } : m
      );
    }

    data.fotos.unshift(newPhoto);
    saveGalleryData(data);

    return NextResponse.json({ success: true, photo: newPhoto, data });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
