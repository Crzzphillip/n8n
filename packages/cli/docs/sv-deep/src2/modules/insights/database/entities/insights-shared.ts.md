## src2/modules/insights/database/entities/insights-shared.ts

Overview: src2/modules/insights/database/entities/insights-shared.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Functions: isValid, isValidPeriodNumber, isValidTypeNumber
- Exports: PeriodUnitToNumber, PeriodUnit, PeriodUnitNumber, NumberToPeriodUnit, isValidPeriodNumber, TypeToNumber, TypeUnit, TypeUnitNumber, NumberToType, isValidTypeNumber

### Recreate

Place this file at `src2/modules/insights/database/entities/insights-shared.ts` and use the following source:

```ts
function isValid<T extends Record<number | string | symbol, unknown>>(
	value: number | string | symbol,
	constant: T,
): value is keyof T {
	return Object.keys(constant).includes(value.toString());
}

// Periods
export const PeriodUnitToNumber = {
	hour: 0,
	day: 1,
	week: 2,
} as const;

export type PeriodUnit = keyof typeof PeriodUnitToNumber;

export type PeriodUnitNumber = (typeof PeriodUnitToNumber)[PeriodUnit];
export const NumberToPeriodUnit = Object.entries(PeriodUnitToNumber).reduce(
	(acc, [key, value]: [PeriodUnit, PeriodUnitNumber]) => {
		acc[value] = key;
		return acc;
	},
	{} as Record<PeriodUnitNumber, PeriodUnit>,
);
export function isValidPeriodNumber(value: number) {
	return isValid(value, NumberToPeriodUnit);
}

// Types
export const TypeToNumber = {
	time_saved_min: 0,
	runtime_ms: 1,
	success: 2,
	failure: 3,
} as const;

export type TypeUnit = keyof typeof TypeToNumber;

export type TypeUnitNumber = (typeof TypeToNumber)[TypeUnit];
export const NumberToType = Object.entries(TypeToNumber).reduce(
	(acc, [key, value]: [TypeUnit, TypeUnitNumber]) => {
		acc[value] = key;
		return acc;
	},
	{} as Record<TypeUnitNumber, TypeUnit>,
);

export function isValidTypeNumber(value: number) {
	return isValid(value, NumberToType);
}

```
