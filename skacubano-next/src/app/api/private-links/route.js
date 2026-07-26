import { NextResponse } from 'next/server';
import { getPrivateLinksData, savePrivateLinksData } from '@/lib/privateLinksStore';
import { verifySignedToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

export async function GET(request) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = getPrivateLinksData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch private links' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const clave = formData.get('clave');
    const notasTecnicas = formData.get('notasTecnicas') || '';
    const files = formData.getAll('files');

    if (!titulo || !clave) {
      return NextResponse.json({ error: 'El título y la clave son obligatorios' }, { status: 400 });
    }

    const data = getPrivateLinksData();
    let slug = slugify(titulo) || `stage-${Date.now()}`;

    if (data.links.some((l) => l.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'privado');
    await mkdir(uploadDir, { recursive: true });

    const fotos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && typeof file.arrayBuffer === 'function') {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = path.extname(file.name) || '.jpg';
        const isPdf = ext.toLowerCase() === '.pdf' || file.type === 'application/pdf';
        const filename = `doc_${Date.now()}_${i}${ext}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        fotos.push({
          id: `file-${Date.now()}-${i}`,
          url: `/uploads/privado/${filename}`,
          nombre: file.name,
          esPdf: isPdf,
          tipo: isPdf ? 'pdf' : 'imagen'
        });
      }
    }

    const newLink = {
      id: `link-${Date.now()}`,
      titulo,
      slug,
      clave,
      notasTecnicas,
      fotos,
      creadoEn: new Date().toISOString(),
      activo: true
    };

    data.links.unshift(newLink);
    savePrivateLinksData(data);

    return NextResponse.json({ success: true, link: newLink, data });
  } catch (error) {
    console.error('Error creating private link:', error);
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
