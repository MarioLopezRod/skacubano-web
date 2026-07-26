import { NextResponse } from 'next/server';
import { getPrivateLinksData } from '@/lib/privateLinksStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, clave } = body;

    if (!slug || !clave) {
      return NextResponse.json({ error: 'Falta el identificador o la clave de acceso' }, { status: 400 });
    }

    const data = getPrivateLinksData();
    const link = data.links.find((l) => l.slug === slug);

    if (!link) {
      return NextResponse.json({ error: 'El enlace privado no existe o ha caducado' }, { status: 404 });
    }

    if (link.clave.trim() !== clave.trim()) {
      return NextResponse.json({ error: 'La clave de acceso es incorrecta' }, { status: 401 });
    }

    // Hide password before returning payload
    const { clave: _, ...publicLink } = link;

    return NextResponse.json({ success: true, link: publicLink });
  } catch (error) {
    console.error('Error verifying private link:', error);
    return NextResponse.json({ error: 'Error al verificar la clave de acceso' }, { status: 500 });
  }
}
