# API integration and migration notes

## Current API usage

- Public content reads use WPGraphQL; no frontend content read through `/wp-json` was found.
- Contact-form writes use the `submitAlomarContact` GraphQL mutation.
- The existing `custom/v1/gravity-form` REST route is registered by the separate Gravity Forms integration and is not part of this frontend migration.
- WordPress core REST APIs and plugin-owned routes must not be removed as part of replacing frontend reads.

## Contact mutation wiring

The frontend mutation existed before the backend schema registration was active. The mutation implementation is in the existing Alomar core plugin's `class-rest-api.php`, while the plugin bootstrap did not load that class. The theme now loads and initializes the existing class when the file is available; it does not duplicate the mutation implementation.

Validation confirmed the mutation field is in the schema: a deliberately incomplete mutation returned the expected GraphQL validation error for its required `input` argument. No mutation with input was sent, so no contact submission or inquiry was created. Production validation still requires an authorized end-to-end test and confirmation of spam handling, email delivery, and CORS/origin policy if requests are browser-originated.

## Read/write separation

| Operation | API | Notes |
|---|---|---|
| Site content, project, sector, company, leadership, and article reads | WPGraphQL | Server-side frontend fetches use the configured GraphQL URL. |
| Contact inquiry submission | WPGraphQL mutation | Browser client uses the mutation; validation and transport failures are surfaced as failures. |
| Gravity Forms integration | Existing REST route `custom/v1/gravity-form` | Independent plugin integration; preserve unless separately migrated and tested. |

## Safe migration steps

1. Keep the existing GraphQL content contract and plugin active while verifying production records.
2. If replacing a REST integration, implement and test the new contract before changing callers.
3. Confirm field validation, authentication/nonce policy, rate limiting, spam protection, CORS, and email delivery for write endpoints.
4. Retain the old route until callers and operational dependencies are identified and migrated.
5. Test using a controlled destination or approved test inquiry; do not send a real contact submission as a schema check.

The local GraphQL schema was validated without executing the contact write mutation. Production migration and end-to-end form acceptance remain open.
