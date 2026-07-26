import { NextResponse } from 'next/server';
import { getGalleryData, saveGalleryData } from '@/lib/galleryStore';
import { verifySignedToken } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nombre, rol, bio, fotoPrincipalUrl } = body;

    const data = getGalleryData();
    const index = data.integrantes.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Integrante no encontrado' }, { status: 404 });
    }

    data.integrantes[index] = {
      ...data.integrantes[index],
      nombre: nombre !== undefined ? nombre : data.integrantes[index].nombre,
      rol: rol !== undefined ? rol : data.integrantes[index].rol,
      bio: bio !== undefined ? bio : data.integrantes[index].bio,
      fotoPrincipalUrl: fotoPrincipalUrl !== undefined ? fotoPrincipalUrl : data.integrantes[index].fotoPrincipalUrl,
    };

    saveGalleryData(data);
    return NextResponse.json({ success: true, member: data.integrantes[index], data });
  } catch (error) {
    console.error('Error updating member:', error);
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

    data.integrantes = data.integrantes.filter((m) => m.id !== id);

    // Reassign photos of deleted member to banda general
    data.fotos = data.fotos.map((f) => (f.integranteId === id ? { ...f, integranteId: null, esPrincipal: false } : f));

    saveGalleryData(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
