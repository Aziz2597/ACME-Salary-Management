# Trade-offs and Engineering Decisions

## SQLite locally, PostgreSQL in production

The assessment explicitly permits SQLite. Using it locally keeps setup easy for a beginner and removes the need for a local database service. The application still uses SQLAlchemy/Alembic and a PostgreSQL-compatible schema so production can use a managed relational database.

## One employee table instead of a large normalized model

The scope is current employee salary management, not enterprise HR master-data management. Keeping country and department as indexed fields reduces schema and UI complexity while still supporting the required analysis.

## Modular monolith instead of microservices

There is one primary user workflow, one database, and no stated independent scaling boundary. Microservices would add network, deployment, and observability complexity without solving a problem in this assessment.

## Static FX rates instead of a live provider

The assessment requires multi-country salary data but does not request live financial information. Static rates make the demo deterministic and self-contained. A production implementation would put rates behind a versioned external source and record the effective date.

## No authentication

The persona is specified, but an authentication mechanism is not. Authentication/SSO/RBAC would be required for a real HR application and is intentionally listed as a limitation rather than hidden.

## Analytics in Python

For 10,000 records, pulling only the necessary salary columns and calculating median/group summaries in Python is straightforward and database-portable. If the dataset grew substantially, aggregation should move into the database or an analytics store.

## No salary history

The current problem statement does not require historical compensation tracking. Adding it would change the domain model and UI materially. The MVP manages the current record only.
