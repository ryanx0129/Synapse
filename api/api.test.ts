import type { VercelRequest, VercelResponse } from "@vercel/node";
import extractGraphHandler from "./extract-graph";
import verifyAnswerHandler from "./verify-answer";
import { machineLearningPreset } from "../src/data/presets";

function mockResponse() {
  let statusCode = 200;
  let body: unknown;
  const response = {
    setHeader: vi.fn(),
    status: vi.fn((code: number) => {
      statusCode = code;
      return response;
    }),
    json: vi.fn((value: unknown) => {
      body = value;
      return response;
    }),
  } as unknown as VercelResponse;
  return { response, result: () => ({ statusCode, body }) };
}

describe("server AI boundaries without credentials", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it("returns a labeled deterministic graph fallback", async () => {
    const { response, result } = mockResponse();
    await extractGraphHandler(
      {
        method: "POST",
        body: {
          document: { id: "doc-hash", title: "Biology notes" },
          chunks: [
            {
              id: "doc-hash-p1-c0",
              documentId: "doc-hash",
              page: 1,
              text: "Cells contain membranes. Membranes regulate transport. Proteins enable selective movement. Gradients can drive diffusion.",
            },
          ],
        },
      } as VercelRequest,
      response,
    );
    const output = result();
    expect(output.statusCode).toBe(200);
    expect(output.body).toMatchObject({ mode: "fallback" });
  });

  it("uses local rubric verification instead of calling an external API", async () => {
    const concept = machineLearningPreset.nodes.find((node) => node.id === "ml-backpropagation")!;
    const { response, result } = mockResponse();
    await verifyAnswerHandler(
      {
        method: "POST",
        body: {
          graphId: machineLearningPreset.id,
          concept: {
            id: concept.id,
            label: concept.label,
            summary: concept.summary,
            question: concept.question,
            rubric: concept.rubric,
            sourceSpans: concept.sourceSpans,
          },
          learnerAnswer:
            "The chain rule composes local derivatives through the layers to calculate the weight gradients.",
        },
      } as VercelRequest,
      response,
    );
    expect(result().body).toMatchObject({ mode: "local", verdict: "correct" });
  });
});

