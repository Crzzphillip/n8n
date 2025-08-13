## src2/public-api/v1/shared/spec/parameters/cursor.yml

Overview: src2/public-api/v1/shared/spec/parameters/cursor.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/shared/spec/parameters/cursor.yml` and use the following source:

```yaml
name: cursor
in: query
description: Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail.
required: false
style: form
schema:
  type: string

```
