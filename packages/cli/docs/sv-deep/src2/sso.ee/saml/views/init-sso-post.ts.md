## src2/sso.ee/saml/views/init-sso-post.ts

Overview: src2/sso.ee/saml/views/init-sso-post.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { PostBindingContext } from 'samlify/types/src/entity';

### Declarations

- Functions: getInitSSOFormView
- Exports: getInitSSOFormView

### Recreate

Place this file at `src2/sso.ee/saml/views/init-sso-post.ts` and use the following source:

```ts
import type { PostBindingContext } from 'samlify/types/src/entity';

export function getInitSSOFormView(context: PostBindingContext): string {
	return `
	<form id="saml-form" method="post" action="${context.entityEndpoint}" autocomplete="off">
    <input type="hidden" name="${context.type}" value="${context.context}" />
    ${context.relayState ? '<input type="hidden" name="RelayState" value="{{relayState}}" />' : ''}
</form>
<script type="text/javascript">
    // Automatic form submission
    (function(){
        document.forms[0].submit();
    })();
</script>`;
}

```
