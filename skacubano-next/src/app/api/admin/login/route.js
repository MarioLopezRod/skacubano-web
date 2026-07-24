import { NextResponse } from 'next/server';
import { getAdminPassword, createSignedToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = getAdminPassword();

    if (password && password === adminPassword) {
      const signedToken = createSignedToken();

      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
      response.cookies.set('skacubano_admin_token', signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en la autenticación del servidor' }, { status: 500 });
  }
}
