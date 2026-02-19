# AGENTS.md

## Tests
- All tests must pass at all times.
- Every new code change must be covered by at least one unit test.
- Avoid an excessive number of unit tests; keep tests focused and purposeful.
- Components must be tested to verify that CTAs work.
- Hooks must be tested, including their behavior within components.
- Services and stores (including queries and commands) should be tested to verify that they work as expected.
- Factor test data creation as much as possible into factories located in `test-utils`.

## Expressiveness
- Naming must express intent and be in English.
- Tests must clearly state what is being tested.

## Architecture
- Clearly separate smart components from presentational components.
- Factor presentational components as much as possible to unify the design system.
- Use the simplest concepts first.
- Respect the existing architecture: stores abstract `react-query`, services handle HTTP calls, and each page has its own subfolder.

## Design System
- Keep the look and feel consistent.
- Provide an easy user journey that follows UX best practices (CTA and information hierarchy, etc.).

## Local development
- For local development, there is mock server based on fastify in the subfolder `server`. All new communications with the server should have its mocked version.
- All developments should make sure to work with the mock server.
- New pages and features should have a mock server implementation.

## Development
- Type everything and avoid using `any`.
- Use the most used dependencies and the latest stable versions that are compatible with the project.
- The project should always compile after any implemenation change.
- Respect the design used for Home using FetchTemplate for loading initial data.
- Use react query mutations for creating and updating data.
- Never put mock data in the production code. Mock data should be served by the mock server.