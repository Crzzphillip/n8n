## src2/user-management/email/templates/password-reset-requested.mjml

Overview: src2/user-management/email/templates/password-reset-requested.mjml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/user-management/email/templates/password-reset-requested.mjml` and use the following source:

```
<mjml>
	<mj-include path="./_common.mjml" />
	<mj-body>
		<mj-section>
			<mj-column>
				<mj-text font-size="24px" color="#ff6f5c">Reset your n8n password</mj-text>
			</mj-column>
		</mj-section>
		<mj-section background-color="#FFFFFF" border="1px solid #ddd">
			<mj-column>
				<mj-text font-size="20px">Hi {{firstName}},</mj-text>
				<mj-text>Somebody asked to reset your password on n8n at <b>{{domain}}</b> .</mj-text>
				<mj-text> Click the following link to choose a new password. </mj-text>
				<mj-button href="{{passwordResetUrl}}">Set a new password</mj-button>

				<mj-text font-size="14px">
					The link is only valid for 20 minutes since this email was sent.
				</mj-text>
			</mj-column>
		</mj-section>
		<mj-section>
			<mj-column>
				<mj-text font-size="12px" color="#777">
					If you did not request this email, you can safely ignore this. <br />
					Your password will not be changed.
				</mj-text>
			</mj-column>
		</mj-section>
		<mj-include path="./_logo.mjml" />
	</mj-body>
</mjml>

```
