import { expect, test } from "@playwright/test";

function createTextPdf(text: string) {
  const stream = `BT\n/F1 12 Tf\n72 720 Td\n(${text.replace(/[()\\]/gu, " ")}) Tj\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

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
  await expect(page.getByText("DETERMINISTIC", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Upload PDF \/ Text/i }).click();
  await page.getByRole("tab", { name: "Upload PDF" }).click();
  await page.locator("input[type=file]").setInputFiles({
    name: "gradient-study-notes.pdf",
    mimeType: "application/pdf",
    buffer: createTextPdf(
      "Gradient descent follows the negative gradient to reduce loss. Learning rate controls each update. Convex objectives have a single global minimum.",
    ),
  });
  await page.getByRole("button", { name: "Generate locally" }).click();
  await expect(page.getByRole("option", { name: "gradient-study-notes" })).toBeAttached();
  await expect(page.getByText("DETERMINISTIC", { exact: true })).toBeVisible();

  await page.route("**/api/extract-graph", (route) =>
    route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Simulated provider outage." }) }),
  );
  await page.getByRole("button", { name: /Upload PDF \/ Text/i }).click();
  await page.getByRole("tab", { name: "Paste text / Markdown" }).click();
  await page.getByLabel("Study material").fill(
    "A second document describes enzymes, substrates, active sites, catalytic rate, and inhibition in enough detail for a graph.",
  );
  await page.getByText("Deterministic demo mode").click();
  await page.getByRole("button", { name: "Generate with GPT" }).click();
  await expect(page.getByText(/current graph is unchanged/i)).toBeVisible();

  expect(
    consoleErrors.filter(
      (message) => !message.includes("WebGL") && !message.includes("status of 503"),
    ),
  ).toEqual([]);
});
