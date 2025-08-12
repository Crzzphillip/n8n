## src2/user-management/email/templates/workflow-shared.mjml

Overview: src2/user-management/email/templates/workflow-shared.mjml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/user-management/email/templates/workflow-shared.mjml` and use the following source:

```
<mjml>
	<mj-include path="./_common.mjml" />
	<mj-body>
		<mj-section>
			<mj-column>
				<mj-text font-size="24px" color="#ff6f5c">A workflow has been shared with you</mj-text>
			</mj-column>
		</mj-section>
		<mj-section background-color="#FFFFFF" border="1px solid #ddd">
			<mj-column>
				<mj-text><b>"{{ workflowName }}"</b> workflow has been shared with you.</mj-text>
				<mj-text>To access it, please click the button below.</mj-text>
				<mj-button href="{{workflowUrl}}">Open Workflow</mj-button>
			</mj-column>
		</mj-section>
		<mj-include path="./_logo.mjml" />
	</mj-body>
</mjml>

```
