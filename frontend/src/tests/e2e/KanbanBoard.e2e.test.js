import { test, expect } from "@playwright/test";
import path from "path";

test("Kanban Board", async ({ page }) => {
  await page.goto("/"); // baseURL already set

  await expect(page.getByText("Kanban Board")).toBeVisible();
});

test("User can add task", async ({ page }) => {
  await page.goto("/");

  // fill input
  await page.getByPlaceholder("Add a new task...").fill("E2E Task");
  // click add task button
  await page.getByRole("button", { name: "Create Task" }).click();
  // Verify task appears
  await expect(page.getByText("E2E Task").first()).toBeVisible();
});

test("User can delet task", async ({ page }) => {
  await page.goto("/");

  // create task
  await page.getByPlaceholder("Add a new task...").fill("Delete Me");
  await page.getByRole("button", { name: "Create Task" }).click();

  // delete task
  await page
    .locator("text=Delete Me")
    .first()
    .locator("../..")
    .getByRole("button", { name: "X" })
    .click();
  await expect(page.getByText("Delete Me").first()).not.toBeVisible();
});

test("User can drag task from one column to another", async ({ page }) => {
  await page.goto("/");

  // create task
  await page.getByPlaceholder("Add a new task...").fill("Drag me");
  await page.getByRole("button", { name: "Create Task" }).first().click();
  const task = page.getByText("Drag me").first();
  await expect(task).toBeVisible();

  const doneColumn = page.getByTestId("column-done");

  // Get bounding boxes
  const taskBox = await task.boundingBox();
  const doneBox = await doneColumn.boundingBox();

  if (!taskBox || !doneBox) throw new Error("Element not found");

  // drag and drop
  await page.mouse.move(
    taskBox.x + taskBox.width / 2,
    taskBox.y + taskBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    doneBox.x + doneBox.width / 2,
    doneBox.y + doneBox.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();

  // verify
  await expect(doneColumn).toContainText("Drag me");
});

test("User can upload image and see preview", async ({ page }) => {
  await page.goto("/");

  // Fill title
  await page.getByPlaceholder("Add a new task...").fill("Image Task");

  // Upload file
  const filePath = path.join(process.cwd(), "src/tests/assets/sample.jpg");
  await page.getByTestId("file-input").setInputFiles(filePath);

  // Submit
  await page.getByRole("button", { name: "Create Task" }).click();

  // Verify task appears
  await expect(page.getByText("Image Task")).toBeVisible();

  // Verify image preview appears
  await expect(page.getByTestId("task-image-preview")).toBeVisible();
});
