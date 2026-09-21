# Architecture

## Overview

The application uses a modular monolith because the assessment is a single focused workflow and does not justify microservices.

```text
+---------------------------+
| React + Material UI       |
| Dashboard / Employees     |
+-------------+-------------+
              |
              | JSON/HTTP
              v
+---------------------------+
| FastAPI                    |
| - Employee API             |
| - Analytics API            |
| - Validation / errors      |
+-------------+-------------+
              |
              | SQLAlchemy
              v
+---------------------------+
| Relational database        |
| SQLite locally             |
| PostgreSQL in production   |
+---------------------------+
```

## Backend layering

- `api/`: HTTP concerns, query parsing, status codes.
- `schemas.py`: request/response validation.
- `models.py`: persistence model.
- `services/`: business rules that should remain easy to unit test without HTTP.
- `db.py`: engine/session management.
- `core/`: application configuration and static reporting FX rules.

## Main data model

A single `employees` table is sufficient for the stated scope. Country and department are indexed strings rather than separate reference tables because the assessment does not require master-data administration and the seeded vocabulary is small.

Important constraints:

- `employee_code` unique.
- `email` unique.
- salary must be positive.
- currency must be a three-letter uppercase code.
- indexes on employee code/email/country/department for common search/filter patterns.

## Request flow: salary update

```text
User submits edit form
        |
        v
React sends PATCH /api/employees/{id}
        |
        v
FastAPI validates request with Pydantic
        |
        v
SQLAlchemy loads employee and updates allowed fields
        |
        v
Database transaction commits
        |
        v
Updated employee is returned as JSON
        |
        v
React refreshes the employee view / dashboard
```

## Analytics flow

The analytics endpoint fetches only the salary-related columns needed for the selected filters and calculates normalized reporting values in Python. With the assessment's fixed 10,000-row dataset, this is simple, deterministic, and database-portable. It avoids vendor-specific median SQL functions.

## Scale decision

10,000 employees is small enough that a modular monolith and indexed relational table are sufficient. The employee list uses server-side pagination so the browser does not download all records for every page request.
