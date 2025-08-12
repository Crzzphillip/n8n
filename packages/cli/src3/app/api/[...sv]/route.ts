import { NextRequest, NextResponse } from 'next/server';
import '../../../import-controllers';
import { matchAndHandle } from '../../../lib/registry-adapter';

async function handle(req: NextRequest) {
  try {
    const resp = await matchAndHandle(req);
    return resp;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;