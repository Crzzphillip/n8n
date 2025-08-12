## src2/user-management/email/templates/project-shared.mjml

Overview: src2/user-management/email/templates/project-shared.mjml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/user-management/email/templates/project-shared.mjml` and use the following source:

```
<mjml>
	<mj-include path="./_common.mjml" />
	<mj-body>
		<mj-section>
			<mj-column>
				<mj-text font-size="24px" color="#ff6f5c"
					>You have been added as a {{ role }} to the {{ projectName }} project</mj-text
				>
			</mj-column>
		</mj-section>
		<mj-section background-color="#FFFFFF" border="1px solid #ddd">
			<mj-column>
				<mj-text
					>This gives you access to all the workflows and credentials in that project</mj-text
				>
				<mj-button href="{{projectUrl}}">View project</mj-button>
			</mj-column>
		</mj-section>
		<mj-include path="./_logo.mjml" />
	</mj-body>
</mjml>

```
