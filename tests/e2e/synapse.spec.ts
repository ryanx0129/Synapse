import { expect, test } from "@playwright/test";

test("complete judged learning and resilient ingestion flow", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");
  await expect(page.getByText("Synapse")).toBeVisible();
  await expect(page.getByText("CURATED PRESET")).toBeVisible();
  await page.getByRole("button", { name: /2D Path/i }).click();

  const search = page.getByPlaceholder("Search concepts…");
  await search.fill("Backpropagation");
  await page.getByRole("list", { name: "Concept search results" }).getByRole("button").click();
  await expect(page.getByRole("heading", { name: "Backpropagation" })).toBeVisible();
  await expect(page.getByText("3.4 Backpropagation")).toBeVisible();

  await page.getByLabel("Explain in your own words").fill(
    "The chain rule composes local derivatives backward through every layer to calculate gradients for the weights.",
  );
  await page.getByRole("button", { name: "Verify knowledge" }).click();
  await expect(page.getByText("correct")).toBeVisible();
  await expect(page.getByRole("complementary", { name: /Backpropagation inspector/ }).getByLabel("Knowledge status: Mastered")).toBeVisible();

  await page.getByRole("button", { name: /3D Galaxy/i }).click();
  await expect(page.getByRole("heading", { name: "Backpropagation" })).toBeVisible();
  await page.getByRole("button", { name: /2D Path/i }).click();
  await search.fill("Vanishing Gradients");
  await page.getByRole("list", { name: "Concept search results" }).getByRole("button").click();
  await page.getByRole("button", { name: "Diagnose path" }).click();
  await expect(page.getByRole("button", { name: "Start repair" })).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: /2D Path/i }).click();
  await search.fill("Backpropagation");
  await page.getByRole("list", { name: "Concept search results" }).getByRole("button").click();
  await expect(page.getByRole("complementary", { name: /Backpropagation inspector/ }).getByLabel("Knowledge status: Mastered")).toBeVisible();

  await page.getByRole("button", { name: /Upload PDF \/ Text/i }).click();
  await page.getByLabel("Study material").fill(
    "# Photosynthesis\nPhotosynthesis converts light energy into chemical energy. Chlorophyll absorbs light. The light reactions produce ATP and NADPH. The Calvin cycle uses those products to fix carbon into sugars.",
  );
  await page.getByRole("button", { name: "Generate locally" }).click();
  await expect(page.getByText("DETERMINISTIC")).toBeVisible();

  await page.route("**/api/extract-graph", (route) =>
    route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Simulated provider outage." }) }),
  );
  await page.getByRole("button", { name: /Upload PDF \/ Text/i }).click();
  await page.getByLabel("Study material").fill(
    "A second document describes enzymes, substrates, active sites, catalytic rate, and inhibition in enough detail for a graph.",
  );
  await page.getByText("Deterministic demo mode").click();
  await page.getByRole("button", { name: "Generate with GPT" }).click();
  await expect(page.getByText(/current graph is unchanged/i)).toBeVisible();

  expect(consoleErrors.filter((message) => !message.includes("WebGL"))).toEqual([]);
});
