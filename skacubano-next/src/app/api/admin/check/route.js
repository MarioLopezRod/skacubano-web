import { NextResponse } from 'next/server';
import { verifySignedToken, getAdminTokenFromRequest } from '@/lib/auth';

export async function GET(request) {
  const token = await getAdminTokenFromRequest(request);

  if (token && verifySignedToken(token)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
