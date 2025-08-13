## src2/user-management/email/interfaces.ts

Overview: src2/user-management/email/interfaces.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: InviteEmailData, PasswordResetData, SendEmailResult, MailData

### Recreate

Place this file at `src2/user-management/email/interfaces.ts` and use the following source:

```ts
export type InviteEmailData = {
	email: string;
	inviteAcceptUrl: string;
};

export type PasswordResetData = {
	email: string;
	firstName: string;
	passwordResetUrl: string;
};

export type SendEmailResult = {
	emailSent: boolean;
	errors?: string[];
};

export type MailData = {
	body: string | Buffer;
	emailRecipients: string | string[];
	subject: string;
	textOnly?: string;
};

```
