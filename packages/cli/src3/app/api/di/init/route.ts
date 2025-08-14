import { NextResponse } from 'next/server';
import { initDI } from '../../../../di/init';

export function POST() {
  initDI();
  return NextResponse.json({ ok: true });
}