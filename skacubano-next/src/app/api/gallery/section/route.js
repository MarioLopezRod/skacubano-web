import { NextResponse } from 'next/server';
import { getGalleryData, saveGalleryData } from '@/lib/galleryStore';
import { verifySignedToken } from '@/lib/auth';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(request) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { nombre } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre de la sección es obligatorio' }, { status: 400 });
    }

    const data = getGalleryData();
    if (!data.secciones) {
      data.secciones = [{ id: 'banda', nombre: 'Galería General de la Banda', slug: 'banda' }];
    }

    const slug = slugify(nombre) || `section-${Date.now()}`;
    const id = slug;

    // Check duplicate
    if (data.secciones.some((s) => s.id === id)) {
      return NextResponse.json({ error: 'Ya existe una sección con ese nombre' }, { status: 400 });
    }

    const newSection = { id, nombre, slug };
    data.secciones.push(newSection);

    saveGalleryData(data);
    return NextResponse.json({ success: true, section: newSection, data });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: 'Section creation failed' }, { status: 500 });
  }
}
