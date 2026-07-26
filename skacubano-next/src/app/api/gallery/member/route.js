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
    const { nombre, rol, bio, fotoPrincipalUrl } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const data = getGalleryData();
    const slug = slugify(nombre) || `member-${Date.now()}`;
    const id = slug;

    const newMember = {
      id,
      nombre,
      slug,
      rol: rol || 'Integrante',
      bio: bio || '',
      fotoPrincipalUrl: fotoPrincipalUrl || '/images/photos/bio_portrait_natty.jpg'
    };

    if (!data.integrantes) data.integrantes = [];
    data.integrantes.push(newMember);

    saveGalleryData(data);
    return NextResponse.json({ success: true, member: newMember, data });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: 'Creation failed' }, { status: 500 });
  }
}
