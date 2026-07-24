import { NextResponse } from 'next/server';
import { getGalleryData, saveGalleryData } from '@/lib/galleryStore';
import { verifySignedToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { descripcion, fecha, integranteId, esPrincipal } = body;

    const data = getGalleryData();
    const photoIndex = data.fotos.findIndex((f) => f.id === id);

    if (photoIndex === -1) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const currentPhoto = data.fotos[photoIndex];
    const targetMemberId = integranteId !== undefined ? (integranteId === 'banda' ? null : integranteId) : currentPhoto.integranteId;

    if (esPrincipal && targetMemberId) {
      data.fotos = data.fotos.map((f) =>
        f.integranteId === targetMemberId ? { ...f, esPrincipal: false } : f
      );
      data.integrantes = data.integrantes.map((m) =>
        m.id === targetMemberId ? { ...m, fotoPrincipalUrl: currentPhoto.url } : m
      );
    }

    data.fotos[photoIndex] = {
      ...data.fotos[photoIndex],
      descripcion: descripcion !== undefined ? descripcion : currentPhoto.descripcion,
      fecha: fecha !== undefined ? fecha : currentPhoto.fecha,
      integranteId: targetMemberId,
      esPrincipal: esPrincipal !== undefined ? esPrincipal : currentPhoto.esPrincipal
    };

    saveGalleryData(data);
    return NextResponse.json({ success: true, photo: data.fotos[photoIndex], data });
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const data = getGalleryData();

    const photoToDelete = data.fotos.find((f) => f.id === id);
    if (!photoToDelete) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    if (photoToDelete.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', photoToDelete.url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not delete file:', e);
        }
      }
    }

    data.fotos = data.fotos.filter((f) => f.id !== id);

    if (photoToDelete.esPrincipal && photoToDelete.integranteId) {
      const remainingMemberPhotos = data.fotos.filter((f) => f.integranteId === photoToDelete.integranteId);
      if (remainingMemberPhotos.length > 0) {
        remainingMemberPhotos[0].esPrincipal = true;
        data.integrantes = data.integrantes.map((m) =>
          m.id === photoToDelete.integranteId ? { ...m, fotoPrincipalUrl: remainingMemberPhotos[0].url } : m
        );
      }
    }

    saveGalleryData(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
