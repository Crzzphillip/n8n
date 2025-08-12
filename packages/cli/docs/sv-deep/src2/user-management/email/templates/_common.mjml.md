## src2/user-management/email/templates/_common.mjml

Overview: src2/user-management/email/templates/_common.mjml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/user-management/email/templates/_common.mjml` and use the following source:

```
<mj-head>
	<mj-attributes>
		<mj-all font-family="Open Sans, sans-serif"></mj-all>
		<mj-body background-color="#fbfcfe"></mj-body>
		<mj-text
			font-weight="400"
			font-size="16px"
			color="#444444"
			line-height="24px"
			padding="10px 0 0 0"
			align="center"
		></mj-text>
		<mj-button
			background-color="#ff6f5c"
			color="#ffffff"
			font-size="18px"
			font-weight="600"
			align="center"
			padding-top="20px"
			line-height="24px"
			border-radius="4px"
		></mj-button>
		<mj-section padding="20px 0px"></mj-section>
	</mj-attributes>
</mj-head>

```
