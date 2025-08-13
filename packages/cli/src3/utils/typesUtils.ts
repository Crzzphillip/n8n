export function tryToParseNumber(value: any): number | null {
	if (typeof value === 'number') {
		return value;
	}
	
	if (typeof value === 'string') {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? null : parsed;
	}
	
	return null;
}

export function isNumber(value: any): value is number {
	return typeof value === 'number' && !isNaN(value);
}

export function isString(value: any): value is string {
	return typeof value === 'string';
}

export function isBoolean(value: any): value is boolean {
	return typeof value === 'boolean';
}

export function isObject(value: any): value is Record<string, any> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: any): value is any[] {
	return Array.isArray(value);
}