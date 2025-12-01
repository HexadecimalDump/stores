## Run instructions

Use the following command to run the application:

```bash
$ docker-compuse up --build
```

The front-end application can be accessed [here](http://localhost:3000).

The back-end API documentation (Swagger UI) is available [here](http://localhost:8080/docs).

## API Sketch

The back-end is built using the NestJS framework, while the front-end is a straightforward React application. A simple client-side rendered app was sufficient for the scope of this assignment; server-side rendering was not deemed necessary.

Ddetails regarding endpoints, models, and interactions are documented in the Swagger specification, which is accessible [here](http://localhost:8080/docs).

Key functional areas include:

- Dedicated routes for managing `products`.
- Dedicated routes for managing `stores`.
- Additional routes designed for linking and managing products within specific stores.

## Decisions & Trade-offs

My primary focus was on the back-end implementation, leveraging my core expertise. The back-end codebase is almost entirely human-written, with minimal AI assistance.

The trade-off for this focus was a heavy reliance on AI for generating the front-end code to meet the project's scope and deadline. Despite using AI generation, I maintained full oversight, actively curating the process and manually correcting bugs introduced by the AI. Similarly, the initial suite of back-end unit tests was generated with AI assistance.

## Testing Approach

The back-end was tested using a combination of unit tests and manual verification. The front-end application underwent manual testing only.

## If I had more time

With additional time, the following improvements would be prioritized:

- **Front-end Refinement:** I would invest more time in manually designing and developing the front-end to improve overall quality and coherence, reducing the reliance on AI-generated code. This area currently presents a significant opportunity for enhancement.
- **Testing Expansion:** The testing suite would be expanded to include comprehensive integration and end-to-end (E2E) tests for the back-end, and a full suite of unit, integration, and E2E tests would be implemented for the front-end application.
- **Database Utilities:** I would refine the database seeding strategy to move away from using migrations for data population. Additionally, time would be spent creating a reusable set of generic helper services and functions for streamlined data querying, including robust support for sorting and filtering operations.
