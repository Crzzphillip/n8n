declare module 'zustand' {
	export function create<TState>(
		initializer: (set: any, get: any, api?: any) => TState,
	): any;
}

declare module 'zustand/middleware' {
	export function persist<TState>(
		config: any,
		options?: any,
	): any;
	export function createJSONStorage(
		getStorage: () => Storage,
	): any;
}


