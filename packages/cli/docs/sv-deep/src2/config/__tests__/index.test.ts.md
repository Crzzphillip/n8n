## src2/config/__tests__/index.test.ts

Overview: src2/config/__tests__/index.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/config/__tests__/index.test.ts` and use the following source:

```ts
describe('userManagement.jwtRefreshTimeoutHours', () => {
	it("resets jwtRefreshTimeoutHours to 0 if it's greater than or equal to jwtSessionDurationHours", async () => {
		process.env.N8N_USER_MANAGEMENT_JWT_DURATION_HOURS = '1';
		process.env.N8N_USER_MANAGEMENT_JWT_REFRESH_TIMEOUT_HOURS = '1';
		const { default: config } = await import('@/config');

		expect(config.getEnv('userManagement.jwtRefreshTimeoutHours')).toBe(0);
	});
});

```
