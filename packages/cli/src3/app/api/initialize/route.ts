import { NextRequest, NextResponse } from 'next/server';
import { ensureBootstrapped } from '../../../lib/bootstrap';
import { ensureRuntimeInitialized } from '../../../lib/runtime-init';
import { setRestBasePath } from '../../../lib/next-env-adapter';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  if (typeof body?.rest === 'string') setRestBasePath(body.rest);
  await ensureBootstrapped();
  await ensureRuntimeInitialized();
  return NextResponse.json({ ok: true });
}