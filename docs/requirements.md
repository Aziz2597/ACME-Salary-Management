# ACME Salary Management — One-Page Requirements

## Goal

Replace spreadsheet-based salary management with a web application that lets an HR Manager maintain current employee salary records for 10,000 employees across multiple countries and answer practical questions about how compensation is distributed across the organization.

## Primary user

HR Manager.

## In scope

1. Employee salary records: view, search, filter, create, and update.
2. Employee fields needed for salary analysis: employee identifier, name, email, country, department, job title, salary amount, and currency.
3. Salary-focused analytics: total employees, average, median, minimum, maximum, salary bands, and breakdowns by country and department.
4. A responsive web UI built with React.
5. A REST backend with validation and relational persistence.
6. A deterministic seed process creating 10,000 employees.
7. Automated tests covering core business logic and key API/user flows.
8. Deployment-ready configuration and documentation.

## Deliberately out of scope

- Payroll processing or salary payment execution: the problem is salary data management and analysis, not payroll operations.
- Employee self-service: the only stated persona is the HR Manager.
- SSO, enterprise identity, and complex RBAC: useful in production but not required by the assessment and would consume effort that is better spent demonstrating the core workflow.
- Live foreign-exchange integration: not required; a fixed reporting conversion is sufficient for a self-contained assessment dataset.
- Benefits, taxes, attendance, performance management, notifications, mobile applications, and integrations: not part of the stated problem.
- Salary history/audit workflow: the assessment asks to manage salary data, not maintain a full compensation history system.

## Product assumptions

- Salaries remain stored in their employee's local currency.
- Cross-country comparisons are shown in a single reporting currency (USD) using static illustrative rates.
- The HR Manager can directly create and update records in the assessment demo.
- The database contains exactly 10,000 seeded records for the assessment demo.

## Success criteria

An evaluator can open the deployed application, browse employee data, search/filter employees, update a salary, and inspect salary analytics without using Excel. Core validation and API behavior are covered by automated tests, and the repository explains the design and trade-offs.
