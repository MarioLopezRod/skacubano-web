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
    const { nombre } = body;

    const data = getGalleryData();
    if (!data.secciones) data.secciones = [{ id: 'banda', nombre: 'Galería General de la Banda', slug: 'banda' }];

    const index = data.secciones.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 });
    }

    data.secciones[index].nombre = nombre || data.secciones[index].nombre;

    saveGalleryData(data);
    return NextResponse.json({ success: true, section: data.secciones[index], data });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Section update failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    if (id === 'banda') {
      return NextResponse.json({ error: 'No se puede eliminar la sección principal de la banda' }, { status: 400 });
    }

    const data = getGalleryData();
    if (!data.secciones) return NextResponse.json({ success: true, data });

    data.secciones = data.secciones.filter((s) => s.id !== id);

    // Reassign photos from deleted section to default banda general
    data.fotos = data.fotos.map((f) => (f.seccionId === id ? { ...f, seccionId: null, integranteId: null } : f));

    saveGalleryData(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json({ error: 'Section delete failed' }, { status: 500 });
  }
}
