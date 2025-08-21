import { NextRequest, NextResponse } from 'next/server';
import '../../../../import-controllers';
import { ensureBootstrapped } from '../../../../lib/bootstrap';
import { matchAndHandle } from '../../../../lib/registry-adapter';

export async function GET(req: NextRequest) { await ensureBootstrapped(); return matchAndHandle(req); }
export async function POST(req: NextRequest) { await ensureBootstrapped(); return matchAndHandle(req); }
export async function PUT(req: NextRequest) { await ensureBootstrapped(); return matchAndHandle(req); }
export async function DELETE(req: NextRequest) { await ensureBootstrapped(); return matchAndHandle(req); }