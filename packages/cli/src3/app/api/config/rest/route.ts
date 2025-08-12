import { NextRequest, NextResponse } from 'next/server';
import { setRestBasePath } from '../../../../src3/lib/next-env-adapter';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const base = typeof body?.rest === 'string' ? body.rest : 'rest';
  setRestBasePath(base);
  return NextResponse.json({ ok: true, rest: base });
}