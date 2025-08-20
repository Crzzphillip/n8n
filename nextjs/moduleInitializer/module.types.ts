import type { ModalState } from '@/Interface';
import type { DynamicTabOptions } from '@/utils/modules/tabUtils';
import type { ComponentType } from 'react';

export type ModalDefinition = {
	key: string;
	component:
		| ComponentType<any>
		| (() => Promise<{ default: ComponentType<any> }>);
	initialState?: ModalState;
};

export type ResourceMetadata = {
	key: string;
	displayName: string;
	i18nKeys?: Record<string, string>;
};

export type RouteMeta = {
	middleware?: string[];
	middlewareOptions?: Record<string, unknown>;
	projectRoute?: boolean;
	moduleName?: string;
};

export type ModuleRoute = {
	path: string;
	// One of these can be used depending on your router setup
	component?: ComponentType<any> | (() => Promise<{ default: ComponentType<any> }>);
	element?: any;
	children?: ModuleRoute[];
	meta?: RouteMeta;
};

export type FrontendModuleDescription = {
	id: string;
	name: string;
	description: string;
	icon: string;
	routes?: ModuleRoute[];
	projectTabs?: {
		overview?: DynamicTabOptions[];
		project?: DynamicTabOptions[];
		shared?: DynamicTabOptions[];
	};
	resources?: ResourceMetadata[];
	modals?: ModalDefinition[];
};
