import { NextResponse } from 'next/server';
import { verifySignedToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('skacubano_admin_token')?.value;

  if (token && verifySignedToken(token)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
