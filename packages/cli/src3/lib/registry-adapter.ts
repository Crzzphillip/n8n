import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';
import { Container } from '@n8n/di';
import { ControllerRegistryMetadata } from '@n8n/decorators';
import { GlobalConfig } from '@n8n/config';

// Very light router: iterate controller metadata and find a match
export async function matchAndHandle(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method.toLowerCase();

  const metadata = Container.get(ControllerRegistryMetadata);
  const globalConfig = Container.get(GlobalConfig);
  const base = `/${globalConfig.endpoints.rest}`.replace(/\/+/g, '/');

  for (const controllerClass of metadata.controllerClasses) {
    const m = metadata.getControllerMetadata(controllerClass);
    const controller = Container.get(controllerClass) as Record<string, any>;
    const prefix = `${base}/${m.basePath}`.replace(/\/+/g, '/').replace(/\/$/, '');
    if (!pathname.startsWith(prefix)) continue;
    const local = pathname.slice(prefix.length) || '/';

    for (const [handlerName, route] of m.routes) {
      if (route.method !== method) continue;
      const fullPath = `${prefix}${route.path}`.replace(/\/+/g, '/');
      // crude matching for path params
      const pattern = new RegExp('^' + fullPath.replace(/:[^/]+/g, '[^/]+') + '$');
      if (!pattern.test(pathname)) continue;

      // Build a minimal Express-like req/res
      const params: Record<string, string> = {};
      const keys = [...route.path.matchAll(/:([^/]+)/g)].map((m) => m[1]);
      const values = pathname.replace(prefix, '').split('/').filter(Boolean);
      const tmpl = route.path.split('/').filter(Boolean);
      let vi = 0;
      tmpl.forEach((seg) => {
        if (seg.startsWith(':')) {
          params[seg.slice(1)] = values[vi] ?? '';
        }
        vi++;
      });

      const body = req.method === 'GET' ? undefined : await safeJson(req);
      const query = Object.fromEntries(url.searchParams);

      const fauxReq: any = { params, method: req.method, query, body, headers: Object.fromEntries(req.headers.entries()) };

      let statusCode = 200;
      const chunks: any[] = [];
      const fauxRes: any = {
        status(code: number) { statusCode = code; return this; },
        json(obj: any) { chunks.push(obj); return this; },
        send(obj: any) { chunks.push(obj); return this; },
      };

      const result = await controller[handlerName](fauxReq, fauxRes);
      if (chunks.length > 0) {
        return NextResponse.json(chunks[chunks.length - 1], { status: statusCode });
      }
      if (result !== undefined) {
        return NextResponse.json(result, { status: statusCode });
      }
      return NextResponse.json({ ok: true }, { status: statusCode });
    }
  }

  return NextResponse.json({ status: 'error', message: 'Route not found' }, { status: 404 });
}

async function safeJson(req: NextRequest) {
  try {
    const text = await req.text();
    if (!text) return undefined;
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}