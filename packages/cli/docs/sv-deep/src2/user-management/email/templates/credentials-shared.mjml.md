## src2/user-management/email/templates/credentials-shared.mjml

Overview: src2/user-management/email/templates/credentials-shared.mjml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/user-management/email/templates/credentials-shared.mjml` and use the following source:

```
<mjml>
	<mj-include path="./_common.mjml" />
	<mj-body>
		<mj-section>
			<mj-column>
				<mj-text font-size="24px" color="#ff6f5c">A credential has been shared with you</mj-text>
			</mj-column>
		</mj-section>
		<mj-section background-color="#FFFFFF" border="1px solid #ddd">
			<mj-column>
				<mj-text><b>"{{ credentialsName }}"</b> credential has been shared with you.</mj-text>
				<mj-text>To access it, please click the button below.</mj-text>
				<mj-button href="{{credentialsListUrl}}">Open credential</mj-button>
			</mj-column>
		</mj-section>
		<mj-include path="./_logo.mjml" />
	</mj-body>
</mjml>

```
