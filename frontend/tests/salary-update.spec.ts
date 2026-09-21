import { expect, test } from "@playwright/test";

test("HR manager can search and update an employee salary", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "ACME Salary Management" })
  ).toBeVisible();

  await expect(page.getByTestId("employee-count")).toHaveText("10,000");

  await page.getByRole("tab", { name: "Employees" }).click();

  await page.getByLabel("Search employees").fill("E00001");

  const employeeRow = page.getByRole("row").filter({
    hasText: "E00001",
    });

  await expect(employeeRow).toBeVisible();
  await employeeRow.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByRole("dialog")).toHaveText(/Update salary/);

  const salary = page.getByLabel("Annual salary");
  await salary.fill("2500000");

  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save" })
    .click();

  await expect(
    page.getByText("Salary updated successfully.")
  ).toBeVisible();

  await expect(page.getByText("$29,750")).toBeVisible();
});