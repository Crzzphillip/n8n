import type { NextRequest, NextResponse } from 'next/server';
import type {
  AuthenticatedPermissionOptions,
  CustomPermissionOptions,
  EnterprisePermissionOptions,
  GuestPermissionOptions,
  RBACPermissionOptions,
  RolePermissionOptions,
  PermissionType,
  DefaultUserMiddlewareOptions,
} from '@/types/rbac';

export type RouterMiddlewareType = Exclude<PermissionType, 'instanceOwner'>;

export type NextNavigationRequest = {
  req: NextRequest;
  res?: NextResponse;
  params?: Record<string, string>;
  searchParams?: URLSearchParams;
};

export type CustomMiddlewareOptions = CustomPermissionOptions<{
  req: NextRequest;
  res?: NextResponse;
  params?: Record<string, string>;
  searchParams?: URLSearchParams;
}>;

export type MiddlewareOptions = {
  authenticated: AuthenticatedPermissionOptions;
  custom: CustomMiddlewareOptions;
  defaultUser: DefaultUserMiddlewareOptions;
  enterprise: EnterprisePermissionOptions;
  guest: GuestPermissionOptions;
  rbac: RBACPermissionOptions;
  role: RolePermissionOptions;
};

export type RouterMiddlewareReturnType = void | NextResponse | Promise<NextResponse | void>;

export interface RouterMiddleware<RouterMiddlewareOptions = {}> {
  (
    req: NextRequest,
    options: RouterMiddlewareOptions & {
      params?: Record<string, string>;
      searchParams?: URLSearchParams;
    },
  ): RouterMiddlewareReturnType;
}
