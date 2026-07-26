import { NextResponse } from 'next/server';
import { getPrivateLinksData, savePrivateLinksData } from '@/lib/privateLinksStore';
import { verifySignedToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('skacubano_admin_token')?.value;
    if (!verifySignedToken(token)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const clave = formData.get('clave');
    const notasTecnicas = formData.get('notasTecnicas') || '';
    const files = formData.getAll('files');
    const existingFotosRaw = formData.get('existingFotos');

    const data = getPrivateLinksData();
    const index = data.links.findIndex((l) => l.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Enlace privado no encontrado' }, { status: 404 });
    }

    let fotos = [];
    if (existingFotosRaw) {
      try {
        fotos = JSON.parse(existingFotosRaw);
      } catch (e) {}
    }

    if (files && files.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'privado');
      await mkdir(uploadDir, { recursive: true });

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
    }

    data.links[index] = {
      ...data.links[index],
      titulo: titulo || data.links[index].titulo,
      clave: clave || data.links[index].clave,
      notasTecnicas: notasTecnicas !== undefined ? notasTecnicas : data.links[index].notasTecnicas,
      fotos
    };

    savePrivateLinksData(data);
    return NextResponse.json({ success: true, link: data.links[index], data });
  } catch (error) {
    console.error('Error updating private link:', error);
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
    const data = getPrivateLinksData();

    data.links = data.links.filter((l) => l.id !== id);
    savePrivateLinksData(data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error deleting private link:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
